import assert from "node:assert/strict";
import test from "node:test";

import { translateEvents } from "../lib/translate.js";

async function collect(events) {
	const chunks = [];
	for await (const chunk of translateEvents(events)) chunks.push(chunk);
	return chunks;
}

test("translates reasoning, text, and finish with usage before finish", async () => {
	const chunks = await collect([
		{ type: "reasoning-start", id: "reasoning-0" },
		{ type: "reasoning-delta", id: "reasoning-0", text: "think" },
		{ type: "reasoning-end", id: "reasoning-0" },
		{ type: "text-start", id: "txt-0" },
		{ type: "text-delta", id: "txt-0", text: "hi" },
		{ type: "text-end", id: "txt-0" },
		{
			type: "finish",
			finishReason: "stop",
			totalUsage: { inputTokens: 10, outputTokens: 2, cachedInputTokens: 4 },
		},
	]);

	assert.deepEqual(
		chunks.map((chunk) => chunk.type),
		["block-start", "reasoning-delta", "block-end", "block-start", "text-delta", "block-end", "usage", "finish"],
	);
	assert.deepEqual(chunks.at(-2), {
		type: "usage",
		usage: { inputTokens: 6, outputTokens: 2, cacheReadTokens: 4, cacheWriteTokens: 0 },
	});
	assert.deepEqual(chunks.at(-1), { type: "finish", reason: { kind: "stop" } });
});

test("maps tool-calls finish when the model reports stop but emitted tools", async () => {
	const chunks = await collect([
		{ type: "tool-input-start", id: "call_1", toolName: "bash" },
		{ type: "tool-input-delta", id: "call_1", delta: '{"cmd":"ls"}' },
		{ type: "tool-input-end", id: "call_1" },
		{ type: "finish", finishReason: "stop" },
	]);
	assert.equal(chunks.at(-1).reason.kind, "tool-calls");
	const ended = chunks.find((chunk) => chunk.type === "block-end");
	assert.equal(ended.block.arguments, '{"cmd":"ls"}');
});

test("empty stop becomes EMPTY_RESPONSE", async () => {
	const chunks = await collect([{ type: "finish", finishReason: "stop" }]);
	assert.equal(chunks.at(-1).reason.kind, "error");
	assert.equal(chunks.at(-1).reason.failure.code, "EMPTY_RESPONSE");
});
