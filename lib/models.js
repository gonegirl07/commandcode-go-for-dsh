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

export const MODELS = [
	{
		id: "deepseek/deepseek-v4-pro",
		name: "DeepSeek V4 Pro (Command Code)",
		reasoning: true,
		thinkingLevelMap: DEEPSEEK_V4_THINKING_LEVEL_MAP,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "deepseek/deepseek-v4-flash",
		name: "DeepSeek V4 Flash (Command Code)",
		reasoning: true,
		thinkingLevelMap: DEEPSEEK_V4_THINKING_LEVEL_MAP,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "moonshotai/Kimi-K3",
		name: "Kimi K3 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 65_536,
		cost: ZERO_COST,
	},
	{
		id: "moonshotai/Kimi-K2.7-Code",
		name: "Kimi K2.7 Code (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256000,
		maxTokens: 65536,
		cost: ZERO_COST,
	},
	{
		id: "moonshotai/Kimi-K2.7-Code-Highspeed",
		name: "Kimi K2.7 Code HighSpeed (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 262000,
		maxTokens: 65536,
		cost: ZERO_COST,
	},
	{
		id: "moonshotai/Kimi-K2.6",
		name: "Kimi K2.6 (Command Code)",
		reasoning: false,
		input: ["text", "image"],
		contextWindow: 256000,
		maxTokens: 65536,
		cost: ZERO_COST,
	},
	{
		id: "moonshotai/Kimi-K2.5",
		name: "Kimi K2.5 (Command Code)",
		reasoning: false,
		input: ["text", "image"],
		contextWindow: 256000,
		maxTokens: 65536,
		cost: ZERO_COST,
	},
	{
		id: "zai-org/GLM-5.2",
		name: "GLM 5.2 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "zai-org/GLM-5.2-Fast",
		name: "GLM 5.2 Fast (Command Code)",
		reasoning: false,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 65_536,
		cost: ZERO_COST,
	},
	{
		id: "zai-org/GLM-5.1",
		name: "GLM 5.1 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 32768,
		cost: ZERO_COST,
	},
	{
		id: "zai-org/GLM-5",
		name: "GLM 5 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 32768,
		cost: ZERO_COST,
	},
	{
		id: "MiniMaxAI/MiniMax-M3",
		name: "MiniMax M3 (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "MiniMaxAI/MiniMax-M2.7",
		name: "MiniMax M2.7 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 65536,
		cost: ZERO_COST,
	},
	{
		id: "MiniMaxAI/MiniMax-M2.5",
		name: "MiniMax M2.5 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 65536,
		cost: ZERO_COST,
	},
	{
		id: "xiaomi/mimo-v2.5-pro",
		name: "MiMo V2.5 Pro (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "xiaomi/mimo-v2.5",
		name: "MiMo V2.5 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "Qwen/Qwen3.7-Max",
		name: "Qwen 3.7 Max (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "Qwen/Qwen3.7-Plus",
		name: "Qwen 3.7 Plus (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "Qwen/Qwen3.6-Max-Preview",
		name: "Qwen 3.6 Max Preview (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 32768,
		cost: ZERO_COST,
	},
	{
		id: "Qwen/Qwen3.6-Plus",
		name: "Qwen 3.6 Plus (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 200000,
		maxTokens: 32768,
		cost: ZERO_COST,
	},
	{
		id: "stepfun/Step-3.7-Flash",
		name: "Step 3.7 Flash (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256000,
		maxTokens: 65536,
		cost: ZERO_COST,
	},
	{
		id: "stepfun/Step-3.5-Flash",
		name: "Step 3.5 Flash (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "tencent/Hy3",
		name: "Tencent Hy3 (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 262_144,
		maxTokens: 65_536,
		cost: ZERO_COST,
	},
	{
		id: "nvidia/nemotron-3-ultra-550b-a55b",
		name: "Nemotron 3 Ultra (Command Code)",
		reasoning: true,
		input: ["text"],
		contextWindow: 1_000_000,
		maxTokens: 131072,
		cost: ZERO_COST,
	},
	{
		id: "thinkingmachines/inkling",
		name: "Inkling (Command Code)",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 256_000,
		maxTokens: 65_536,
		cost: ZERO_COST,
	},
];

export function findModel(modelId) {
	return MODELS.find((model) => model.id === modelId);
}

export function offeredEfforts(model) {
	if (!model.thinkingLevelMap) return [];
	return Object.entries(model.thinkingLevelMap)
		.filter(([, wire]) => wire === null || typeof wire === "string")
		.filter(([level, wire]) => level === "off" || typeof wire === "string")
		.map(([level]) => level);
}

export function mapReasoningEffort(model, effort) {
	if (effort === undefined) return undefined;
	const map = model.thinkingLevelMap;
	if (!map) return undefined;
	if (!Object.hasOwn(map, effort)) {
		throw Object.assign(new Error(`Command Code does not support reasoning effort "${effort}" on ${model.id}`), {
			code: "UNSUPPORTED_REASONING_EFFORT",
		});
	}
	const wire = map[effort];
	return typeof wire === "string" ? wire : undefined;
}
