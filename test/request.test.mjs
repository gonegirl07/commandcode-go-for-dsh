import assert from "node:assert/strict";
import test from "node:test";

import { findModel } from "../lib/models.js";
import { buildGenerateBody, resolveCommandCodeApiKey } from "../lib/request.js";

const deepSeek = findModel("deepseek/deepseek-v4-pro");
const kimi = findModel("moonshotai/Kimi-K3");

test("forwards supported DeepSeek effort levels to alpha/generate", () => {
	const high = buildGenerateBody(deepSeek, { messages: [], reasoningEffort: "high" });
	const max = buildGenerateBody(deepSeek, { messages: [], reasoningEffort: "max" });
	assert.equal(high.params.reasoning_effort, "high");
	assert.equal(max.params.reasoning_effort, "max");
});

test("omits unsupported efforts and leaves unrelated models unchanged", () => {
	const low = buildGenerateBody(deepSeek, { messages: [], reasoningEffort: "low" });
	const kimiHigh = buildGenerateBody(kimi, { messages: [], reasoningEffort: "high" });
	assert.equal(Object.hasOwn(low.params, "reasoning_effort"), false);
	assert.equal(Object.hasOwn(kimiHigh.params, "reasoning_effort"), false);
});

test("resolves literal Command Code environment-key references", () => {
	const previous = process.env.COMMANDCODE_API_KEY;
	process.env.COMMANDCODE_API_KEY = "user_env_test";
	try {
		assert.equal(resolveCommandCodeApiKey("COMMANDCODE_API_KEY"), "user_env_test");
		assert.equal(resolveCommandCodeApiKey("$COMMANDCODE_API_KEY"), "user_env_test");
		assert.equal(resolveCommandCodeApiKey("user_direct"), "user_direct");
	} finally {
		if (previous === undefined) delete process.env.COMMANDCODE_API_KEY;
		else process.env.COMMANDCODE_API_KEY = previous;
	}
});

test("serializes tools and system text into the CLI envelope", () => {
	const body = buildGenerateBody(deepSeek, {
		system: "be brief",
		messages: [{ role: "user", content: [{ type: "text", text: "hi" }] }],
		tools: [{ name: "bash", description: "run", parameters: { type: "object" } }],
		maxTokens: 128,
	});
	assert.equal(body.params.model, "deepseek/deepseek-v4-pro");
	assert.equal(body.params.system, "be brief");
	assert.equal(body.params.stream, true);
	assert.equal(body.params.max_tokens, 128);
	assert.deepEqual(body.params.messages, [
		{ role: "user", content: [{ type: "text", text: "hi" }] },
	]);
	assert.deepEqual(body.params.tools, [{ name: "bash", description: "run", input_schema: { type: "object" } }]);
});
