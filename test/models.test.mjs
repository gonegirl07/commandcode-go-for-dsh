import assert from "node:assert/strict";
import test from "node:test";

import { MODELS, findModel, settingsModels } from "../lib/models.js";

test("roster has unique ids and covers the official Command Code catalog", () => {
	const ids = MODELS.map((model) => model.id);
	assert.equal(new Set(ids).size, ids.length);
	for (const id of [
		"deepseek/deepseek-v4-pro",
		"deepseek/deepseek-v4-flash",
		"moonshotai/Kimi-K3",
		"zai-org/GLM-5.3",
		"Qwen/Qwen3.8-Max",
		"Qwen/Qwen3.7-Flash",
		"tencent/hy3-paid",
		"thinkingmachines/inkling-small",
		"poolside/laguna-s-2.1-free",
		"sakana/fugu-ultra",
		"meta/muse-spark-1.2",
		"google/gemini-3.7-flash",
		"claude-sonnet-5",
		"gpt-5.6-luna",
		"xai/grok-4.6",
	]) {
		assert.ok(findModel(id), `missing ${id}`);
	}
	assert.ok(ids.length >= 50);
});

test("settings models keep id, name, and capacities", () => {
	const [first] = settingsModels();
	assert.equal(first.id, "deepseek/deepseek-v4-pro");
	assert.equal(typeof first.name, "string");
	assert.equal(first.contextWindow, 1_000_000);
	assert.equal(first.maxTokens, 131072);
	assert.equal(settingsModels().length, MODELS.length);
});
