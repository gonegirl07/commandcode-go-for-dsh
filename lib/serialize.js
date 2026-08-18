function flattenText(blocks) {
	return (blocks ?? [])
		.filter((block) => block.type === "text")
		.map((block) => block.text)
		.join("");
}

function stringifyUnknown(value) {
	if (value instanceof Error) return value.message || value.stack || "Error";
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return "Unknown error (non-serializable)";
	}
}

function parseToolArguments(raw) {
	if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
	if (typeof raw !== "string" || raw.trim() === "") return {};
	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
}

/**
 * Convert DeepSeek Harness messages into Command Code's Vercel AI SDK
 * ModelMessage[] envelope used by POST /alpha/generate.
 */
export function serializeMessages(messages) {
	const out = [];
	const toolNameById = new Map();

	for (const message of messages ?? []) {
		const blocks = Array.isArray(message.content) ? message.content : [];

		if (blocks.some((block) => block.type === "image")) {
			throw Object.assign(new Error("Command Code Go does not send image attachments yet"), {
				code: "UNSUPPORTED_CONTENT",
			});
		}

		if (message.role === "system") continue;

		if (message.role === "assistant") {
			const content = [];
			for (const block of blocks) {
				if (block.type === "text" && block.text) {
					content.push({ type: "text", text: block.text });
				} else if (block.type === "tool-call") {
					toolNameById.set(block.id, block.name);
					content.push({
						type: "tool-call",
						toolCallId: block.id,
						toolName: block.name,
						input: parseToolArguments(block.arguments),
					});
				}
			}
			if (content.length > 0) out.push({ role: "assistant", content });
			continue;
		}

		const toolResults = blocks.filter((block) => block.type === "tool-result");
		const text = flattenText(blocks);
		if (text.length > 0 || toolResults.length === 0) {
			out.push({
				role: "user",
				content: text.length > 0 ? [{ type: "text", text }] : [{ type: "text", text: "" }],
			});
		}
		for (const result of toolResults) {
			const value = flattenText(result.content) || stringifyUnknown(result.content) || "(no output)";
			const block = {
				type: "tool-result",
				toolCallId: result.toolCallId,
				toolName: toolNameById.get(result.toolCallId) ?? "unknown",
				output: { type: result.isError ? "error-text" : "text", value },
			};
			const last = out[out.length - 1];
			if (last && last.role === "tool") last.content.push(block);
			else out.push({ role: "tool", content: [block] });
		}
	}

	return out;
}

export function staticConfig() {
	return {
		workingDir: process.cwd(),
		date: new Date().toISOString().slice(0, 10),
		environment: "production",
		structure: [],
		isGitRepo: false,
		currentBranch: "",
		mainBranch: "",
		gitStatus: "",
		recentCommits: [],
	};
}
