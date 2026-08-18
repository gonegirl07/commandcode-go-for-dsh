import { BASE_URL, GENERATE_PATH, mapReasoningEffort } from "./models.js";
import { serializeMessages, staticConfig } from "./serialize.js";

export function resolveCommandCodeApiKey(apiKey) {
	if (!apiKey || apiKey === "COMMANDCODE_API_KEY" || apiKey === "$COMMANDCODE_API_KEY") {
		return process.env.COMMANDCODE_API_KEY;
	}
	return apiKey;
}

export function buildGenerateBody(model, options) {
	const tools = (options.tools ?? []).map((tool) => ({
		name: tool.name,
		description: tool.description,
		input_schema: tool.parameters,
	}));
	const mappedReasoningEffort = mapReasoningEffort(model, options.reasoningEffort);

	return {
		config: staticConfig(),
		memory: "",
		taste: null,
		skills: null,
		permissionMode: "standard",
		params: {
			model: model.id,
			system: options.system ?? "",
			messages: serializeMessages(options.messages),
			tools,
			max_tokens: options.maxTokens ?? model.maxTokens ?? 8192,
			...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
			...(typeof mappedReasoningEffort === "string" ? { reasoning_effort: mappedReasoningEffort } : {}),
			stream: true,
		},
	};
}

export function generateUrl() {
	return `${BASE_URL}${GENERATE_PATH}`;
}
