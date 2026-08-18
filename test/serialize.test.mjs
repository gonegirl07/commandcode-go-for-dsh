import assert from "node:assert/strict";
import test from "node:test";

import { serializeMessages } from "../lib/serialize.js";

test("converts assistant tool calls and later tool results", () => {
	const wire = serializeMessages([
		{ role: "user", content: [{ type: "text", text: "list files" }] },
		{
			role: "assistant",
			content: [
				{ type: "text", text: "ok" },
				{ type: "tool-call", id: "call_1", name: "bash", arguments: '{"command":"ls"}' },
			],
		},
		{
			role: "user",
			content: [
				{
					type: "tool-result",
					toolCallId: "call_1",
					content: [{ type: "text", text: "a.txt" }],
				},
			],
		},
	]);

	assert.deepEqual(wire, [
		{ role: "user", content: [{ type: "text", text: "list files" }] },
		{
			role: "assistant",
			content: [
				{ type: "text", text: "ok" },
				{
					type: "tool-call",
					toolCallId: "call_1",
					toolName: "bash",
					input: { command: "ls" },
				},
			],
		},
		{
			role: "tool",
			content: [
				{
					type: "tool-result",
					toolCallId: "call_1",
					toolName: "bash",
					output: { type: "text", value: "a.txt" },
				},
			],
		},
	]);
});

test("rejects image blocks", () => {
	assert.throws(
		() =>
			serializeMessages([
				{
					role: "user",
					content: [{ type: "image", attachment: { attachmentId: "x" } }],
				},
			]),
		/image attachments/,
	);
});
