export function parseJsonLine(line, lineNumber) {
	try {
		return JSON.parse(line);
	} catch (error) {
		const preview = line.length > 240 ? `${line.slice(0, 240)}...` : line;
		throw new Error(`Malformed Command Code NDJSON at line ${lineNumber}: ${preview} (${error})`);
	}
}

export async function* ndjsonLines(body) {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let lineNumber = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		let nl;
		while ((nl = buffer.indexOf("\n")) >= 0) {
			const line = buffer.slice(0, nl).trim();
			buffer = buffer.slice(nl + 1);
			if (!line) continue;
			lineNumber += 1;
			yield parseJsonLine(line, lineNumber);
		}
	}
	buffer = buffer.trim();
	if (buffer) {
		lineNumber += 1;
		yield parseJsonLine(buffer, lineNumber);
	}
}

function toolEventId(event) {
	return event.id ?? event.toolCallId;
}

function toolEventName(event) {
	return event.toolName ?? event.name ?? "";
}

function mapUsage(usage) {
	const totalInputTokens = usage.inputTokens ?? usage.input_tokens ?? 0;
	const cacheReadTokens =
		usage.cachedInputTokens ?? usage.inputTokenDetails?.cacheReadTokens ?? usage.raw?.prompt_cache_hit_tokens ?? 0;
	return {
		inputTokens: Math.max(0, totalInputTokens - cacheReadTokens),
		outputTokens: usage.outputTokens ?? usage.output_tokens ?? 0,
		cacheReadTokens,
		cacheWriteTokens: 0,
	};
}

function mapFinish(reason, sawToolCall) {
	if (reason === "length") return { kind: "max-tokens" };
	if (reason === "tool-calls" || reason === "tool_calls" || reason === "tool_use" || sawToolCall) {
		return { kind: "tool-calls" };
	}
	return { kind: "stop" };
}

/**
 * Translate Command Code NDJSON events into harness StreamChunk objects.
 * Block-end / usage / finish are flushed when the stream ends or a finish event arrives.
 */
export async function* translateEvents(events) {
	const idToIndex = new Map();
	const open = new Map();
	const toolJsonByIndex = new Map();
	const endedToolCalls = new Set();
	let nextIndex = 0;
	let pendingUsage;
	let pendingFinish;
	let sawTerminalEvent = false;

	function openBlock(kind, extra = {}) {
		const index = nextIndex++;
		const block = { index, kind, text: "", ...extra };
		open.set(index, block);
		return block;
	}

	function closeBlock(block) {
		if (block.kind === "text") return { type: "text", text: block.text };
		if (block.kind === "reasoning") return { type: "reasoning", text: block.text };
		return {
			type: "tool-call",
			id: block.id ?? "",
			name: block.name ?? "",
			arguments: block.text,
		};
	}

	function* flushOpen() {
		for (const block of [...open.values()].sort((a, b) => a.index - b.index)) {
			yield { type: "block-end", index: block.index, block: closeBlock(block) };
		}
		open.clear();
	}

	for await (const event of events) {
		if (!event || typeof event !== "object") continue;
		const type = event.type;
		if (!type) continue;

		switch (type) {
			case "reasoning-start": {
				const block = openBlock("reasoning");
				idToIndex.set(event.id, block.index);
				yield { type: "block-start", index: block.index, blockType: "reasoning" };
				break;
			}
			case "reasoning-delta": {
				const index = idToIndex.get(event.id);
				if (index === undefined) break;
				const block = open.get(index);
				if (!block || block.kind !== "reasoning") break;
				const delta = event.text ?? "";
				block.text += delta;
				if (delta) yield { type: "reasoning-delta", index, text: delta };
				break;
			}
			case "reasoning-end": {
				const index = idToIndex.get(event.id);
				if (index === undefined) break;
				const block = open.get(index);
				if (!block) break;
				open.delete(index);
				yield { type: "block-end", index, block: closeBlock(block) };
				break;
			}
			case "text-start": {
				const block = openBlock("text");
				idToIndex.set(event.id, block.index);
				yield { type: "block-start", index: block.index, blockType: "text" };
				break;
			}
			case "text-delta": {
				const index = idToIndex.get(event.id);
				if (index === undefined) break;
				const block = open.get(index);
				if (!block || block.kind !== "text") break;
				const delta = event.text ?? "";
				block.text += delta;
				if (delta) yield { type: "text-delta", index, text: delta };
				break;
			}
			case "text-end": {
				const index = idToIndex.get(event.id);
				if (index === undefined) break;
				const block = open.get(index);
				if (!block) break;
				open.delete(index);
				yield { type: "block-end", index, block: closeBlock(block) };
				break;
			}
			case "tool-input-start": {
				const id = toolEventId(event);
				if (!id) break;
				const block = openBlock("tool-call", { id, name: toolEventName(event), text: "" });
				idToIndex.set(id, block.index);
				toolJsonByIndex.set(block.index, "");
				yield { type: "block-start", index: block.index, blockType: "tool-call" };
				yield {
					type: "tool-call-delta",
					index: block.index,
					id,
					name: block.name,
					argumentsDelta: "",
				};
				break;
			}
			case "tool-input-delta": {
				const id = toolEventId(event);
				if (!id) break;
				const index = idToIndex.get(id);
				if (index === undefined) break;
				const block = open.get(index);
				if (!block || block.kind !== "tool-call") break;
				const delta = event.delta ?? "";
				const acc = (toolJsonByIndex.get(index) ?? "") + delta;
				toolJsonByIndex.set(index, acc);
				block.text = acc;
				if (delta) {
					yield { type: "tool-call-delta", index, id, name: block.name, argumentsDelta: delta };
				}
				break;
			}
			case "tool-input-end":
			case "tool-call": {
				const id = toolEventId(event);
				if (!id) break;
				let index = idToIndex.get(id);
				if (index === undefined) {
					const block = openBlock("tool-call", { id, name: toolEventName(event), text: "" });
					index = block.index;
					idToIndex.set(id, index);
					yield { type: "block-start", index, blockType: "tool-call" };
				}
				const block = open.get(index);
				if (!block || block.kind !== "tool-call") break;
				const completeInput = event.input ?? event.args;
				if (completeInput && typeof completeInput === "object") {
					block.text = JSON.stringify(completeInput);
				} else if (toolJsonByIndex.get(index)) {
					block.text = toolJsonByIndex.get(index);
				}
				if (endedToolCalls.has(index)) break;
				endedToolCalls.add(index);
				open.delete(index);
				yield { type: "block-end", index, block: closeBlock(block) };
				break;
			}
			case "finish-step":
			case "finish": {
				sawTerminalEvent = true;
				const usage = event.usage ?? event.totalUsage;
				if (usage) pendingUsage = mapUsage(usage);
				pendingFinish = mapFinish(event.finishReason ?? event.rawFinishReason, endedToolCalls.size > 0);
				break;
			}
			case "error": {
				throw new Error(
					event.message ?? (event.error === undefined ? "Command Code stream error" : String(event.error)),
				);
			}
		}
	}

	yield* flushOpen();

	if (!sawTerminalEvent) {
		throw new Error("Command Code stream ended before a terminal event");
	}

	if (pendingUsage) yield { type: "usage", usage: pendingUsage };

	const empty = nextIndex === 0 && endedToolCalls.size === 0;
	yield {
		type: "finish",
		reason:
			empty && pendingFinish?.kind === "stop"
				? {
						kind: "error",
						failure: {
							message: "model returned a completed response with no content",
							code: "EMPTY_RESPONSE",
						},
					}
				: (pendingFinish ?? { kind: "stop" }),
	};
}
