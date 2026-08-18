export const PROVIDER = "commandcode";
export const PROVIDER_NAME = "Command Code Go";
export const BASE_URL = "https://api.commandcode.ai";
export const GENERATE_PATH = "/alpha/generate";
export const COMMAND_CODE_VERSION = "0.52.1";
export const API_KEY_ENV = "COMMANDCODE_API_KEY";

const ZERO_COST = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

export const DEEPSEEK_V4_THINKING_LEVEL_MAP = {
	off: null,
	minimal: null,
	low: null,
	medium: null,
	high: "high",
	xhigh: null,
	max: "max",
};

function model(entry) {
	return { cost: ZERO_COST, ...entry };
}

export const MODELS = [
	// DeepSeek — official default is flash; Pro is first so TUI `s` activates it.
	model({
		id: "deepseek/deepseek-v4-pro",
		name: "DeepSeek V4 Pro (Command Code)",
		reasoning: true,
		thinkingLevelMap: DEEPSEEK_V4_THINKING_LEVEL_MAP,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),
	model({
		id: "deepseek/deepseek-v4-flash",
		name: "DeepSeek V4 Flash (Command Code)",
		reasoning: true,
		thinkingLevelMap: DEEPSEEK_V4_THINKING_LEVEL_MAP,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),

	// Moonshot Kimi
	model({
		id: "moonshotai/Kimi-K3",
		name: "Kimi K3 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 65_536,
	}),
	model({
		id: "moonshotai/Kimi-K2.7-Code",
		name: "Kimi K2.7 Code (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256000,
		maxTokens: 65536,
	}),
	model({
		id: "moonshotai/Kimi-K2.7-Code-Highspeed",
		name: "Kimi K2.7 Code HighSpeed (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 262000,
		maxTokens: 65536,
	}),
	model({
		id: "moonshotai/Kimi-K2.6",
		name: "Kimi K2.6 (Command Code)",
		reasoning: false,
		input: ["text", "image"],
		contextWindow: 256000,
		maxTokens: 65536,
	}),
	model({
		id: "moonshotai/Kimi-K2.5",
		name: "Kimi K2.5 (Command Code)",
		reasoning: false,
		input: ["text", "image"],
		contextWindow: 256000,
		maxTokens: 65536,
	}),

	// Zhipu / Z AI
	model({
		id: "zai-org/GLM-5.3",
		name: "GLM 5.3 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),
	model({
		id: "zai-org/GLM-5.2",
		name: "GLM 5.2 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),
	model({
		id: "zai-org/GLM-5.2-Fast",
		name: "GLM 5.2 Fast (Command Code)",
		reasoning: false,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 65_536,
	}),
	model({
		id: "zai-org/GLM-5.1",
		name: "GLM 5.1 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 32768,
	}),
	model({
		id: "zai-org/GLM-5",
		name: "GLM 5 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 32768,
	}),

	// MiniMax
	model({
		id: "MiniMaxAI/MiniMax-M3",
		name: "MiniMax M3 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),
	model({
		id: "MiniMaxAI/MiniMax-M2.7",
		name: "MiniMax M2.7 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 65536,
	}),
	model({
		id: "MiniMaxAI/MiniMax-M2.5",
		name: "MiniMax M2.5 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 65536,
	}),

	// Xiaomi MiMo
	model({
		id: "xiaomi/mimo-v2.5-pro",
		name: "MiMo V2.5 Pro (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),
	model({
		id: "xiaomi/mimo-v2.5",
		name: "MiMo V2.5 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),

	// Alibaba Qwen
	model({
		id: "Qwen/Qwen3.8-Max",
		name: "Qwen 3.8 Max (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),
	model({
		id: "Qwen/Qwen3.7-Max",
		name: "Qwen 3.7 Max (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),
	model({
		id: "Qwen/Qwen3.7-Plus",
		name: "Qwen 3.7 Plus (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),
	model({
		id: "Qwen/Qwen3.7-Flash",
		name: "Qwen 3.7 Flash (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),
	model({
		id: "Qwen/Qwen3.6-Max-Preview",
		name: "Qwen 3.6 Max Preview (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 32768,
	}),
	model({
		id: "Qwen/Qwen3.6-Plus",
		name: "Qwen 3.6 Plus (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 32768,
	}),

	// StepFun
	model({
		id: "stepfun/Step-3.7-Flash",
		name: "Step 3.7 Flash (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256000,
		maxTokens: 65536,
	}),
	model({
		id: "stepfun/Step-3.5-Flash",
		name: "Step 3.5 Flash (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),

	// Tencent — official id is hy3-paid; keep the older Hy3 id as well.
	model({
		id: "tencent/hy3-paid",
		name: "Tencent Hy3 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 262_144,
		maxTokens: 65_536,
	}),
	model({
		id: "tencent/Hy3",
		name: "Tencent Hy3 (legacy id)",
		reasoning: true,
		input: ["text"],
		contextWindow: 262_144,
		maxTokens: 65_536,
	}),

	// NVIDIA
	model({
		id: "nvidia/nemotron-3-ultra-550b-a55b",
		name: "Nemotron 3 Ultra (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
	}),

	// Thinking Machines
	model({
		id: "thinkingmachines/inkling",
		name: "Inkling (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256_000,
		maxTokens: 65_536,
	}),
	model({
		id: "thinkingmachines/inkling-small",
		name: "Inkling Small (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256_000,
		maxTokens: 65_536,
	}),

	// Poolside
	model({
		id: "poolside/laguna-s-2.1-free",
		name: "Laguna S 2.1 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 256_000,
		maxTokens: 65_536,
	}),

	// Sakana
	model({
		id: "sakana/fugu-ultra",
		name: "Fugu Ultra (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 200_000,
		maxTokens: 65_536,
	}),

	// Meta Muse
	model({
		id: "meta/muse-spark-1.2",
		name: "Muse Spark 1.2 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256_000,
		maxTokens: 65_536,
	}),
	model({
		id: "meta/muse-spark-1.2-contributor",
		name: "Muse Spark 1.2 Contributor (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256_000,
		maxTokens: 65_536,
	}),
	model({
		id: "meta/muse-spark-1.1",
		name: "Muse Spark 1.1 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256_000,
		maxTokens: 65_536,
	}),

	// Google Gemini — Go plan may reject these.
	model({
		id: "google/gemini-3.7-flash",
		name: "Gemini 3.7 Flash (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 65_536,
	}),
	model({
		id: "google/gemini-3.6-flash",
		name: "Gemini 3.6 Flash (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 65_536,
	}),
	model({
		id: "google/gemini-3.5-flash",
		name: "Gemini 3.5 Flash (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 65_536,
	}),
	model({
		id: "google/gemini-3.5-flash-lite",
		name: "Gemini 3.5 Flash Lite (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 65_536,
	}),
	model({
		id: "google/gemini-3.1-flash-lite",
		name: "Gemini 3.1 Flash Lite (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 65_536,
	}),

	// Anthropic — Go plan may reject these.
	model({
		id: "claude-sonnet-5",
		name: "Claude Sonnet 5 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 200_000,
		maxTokens: 64_000,
	}),
	model({
		id: "claude-opus-5",
		name: "Claude Opus 5 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 200_000,
		maxTokens: 64_000,
	}),
	model({
		id: "claude-opus-4-8",
		name: "Claude Opus 4.8 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 200_000,
		maxTokens: 64_000,
	}),
	model({
		id: "claude-opus-4-7",
		name: "Claude Opus 4.7 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 200_000,
		maxTokens: 64_000,
	}),
	model({
		id: "claude-sonnet-4-6",
		name: "Claude Sonnet 4.6 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 200_000,
		maxTokens: 64_000,
	}),
	model({
		id: "claude-haiku-4-5",
		name: "Claude Haiku 4.5 (Command Code)",
		reasoning: false,
		input: ["text", "image"],
		contextWindow: 200_000,
		maxTokens: 64_000,
	}),
	model({
		id: "claude-fable-5",
		name: "Claude Fable 5 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 200_000,
		maxTokens: 64_000,
	}),

	// OpenAI — Go plan may reject these.
	model({
		id: "gpt-5.6-sol",
		name: "GPT-5.6 Sol (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 272_000,
		maxTokens: 65_536,
	}),
	model({
		id: "gpt-5.6-terra",
		name: "GPT-5.6 Terra (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 272_000,
		maxTokens: 65_536,
	}),
	model({
		id: "gpt-5.6-luna",
		name: "GPT-5.6 Luna (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 272_000,
		maxTokens: 65_536,
	}),
	model({
		id: "gpt-5.5",
		name: "GPT-5.5 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 272_000,
		maxTokens: 65_536,
	}),
	model({
		id: "gpt-5.4",
		name: "GPT-5.4 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 272_000,
		maxTokens: 65_536,
	}),
	model({
		id: "gpt-5.4-mini",
		name: "GPT-5.4 Mini (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 272_000,
		maxTokens: 65_536,
	}),
	model({
		id: "gpt-5.3-codex",
		name: "GPT-5.3 Codex (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 272_000,
		maxTokens: 65_536,
	}),

	// xAI — Go plan may reject these.
	model({
		id: "xai/grok-4.6",
		name: "Grok 4.6 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 256_000,
		maxTokens: 65_536,
	}),
	model({
		id: "xai/grok-4.5",
		name: "Grok 4.5 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256_000,
		maxTokens: 65_536,
	}),
];

export function findModel(modelId) {
	return MODELS.find((entry) => entry.id === modelId);
}

export function settingsModels() {
	return MODELS.map((entry) => ({
		id: entry.id,
		name: entry.name,
		contextWindow: entry.contextWindow,
		maxTokens: entry.maxTokens,
	}));
}

export function offeredEfforts(entry) {
	if (!entry.thinkingLevelMap) return [];
	return Object.entries(entry.thinkingLevelMap)
		.filter(([, wire]) => wire === null || typeof wire === "string")
		.filter(([level, wire]) => level === "off" || typeof wire === "string")
		.map(([level]) => level);
}

export function mapReasoningEffort(entry, effort) {
	if (effort === undefined) return undefined;
	const map = entry.thinkingLevelMap;
	if (!map) return undefined;
	if (!Object.hasOwn(map, effort)) {
		throw Object.assign(new Error(`Command Code does not support reasoning effort "${effort}" on ${entry.id}`), {
			code: "UNSUPPORTED_REASONING_EFFORT",
		});
	}
	const wire = map[effort];
	return typeof wire === "string" ? wire : undefined;
}
