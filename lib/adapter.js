import {
	CallId,
	LlmAdapter,
	LlmError,
	ReasoningEffortId,
	assertUsableApiKey,
	attributionHeaders,
} from "@deepseek-ai/dsh-llm";
import { API_KEY_ENV, COMMAND_CODE_VERSION, MODELS, PROVIDER, PROVIDER_NAME, findModel, offeredEfforts } from "./models.js";
import { buildGenerateBody, generateUrl, resolveCommandCodeApiKey } from "./request.js";
import { ndjsonLines, translateEvents } from "./translate.js";

function effortLabel(id) {
	return id.slice(0, 1).toUpperCase() + id.slice(1);
}

export class CommandCodeAdapter extends LlmAdapter {
	constructor({ resolveApiKey }) {
		super();
		this.resolveApiKey = resolveApiKey;
	}

	providerInfo(provider) {
		return { id: provider, name: PROVIDER_NAME };
	}

	async listModels(provider) {
		return MODELS.map((model) => ({
			provider,
			id: model.id,
			name: model.name,
			inputModalities: model.input,
		}));
	}

	async resolveModel(provider, modelId) {
		const model = findModel(modelId);
		if (!model) {
			throw new LlmError(`unknown Command Code model "${modelId}"`, "UNKNOWN_MODEL");
		}
		const efforts = offeredEfforts(model);
		return {
			provider,
			id: model.id,
			name: model.name,
			inputModalities: model.input,
			context: { contextWindow: model.contextWindow },
			defaultMaxTokens: model.maxTokens,
			...(efforts.length > 0
				? {
						reasoning: {
							efforts: efforts.map((id) => ({
								id: ReasoningEffortId(id),
								name: effortLabel(id),
							})),
						},
					}
				: {}),
		};
	}

	async *stream(options) {
		if (options.stop !== undefined) {
			throw new LlmError("Command Code Go does not support stop sequences", "UNSUPPORTED");
		}
		const model = findModel(options.model);
		if (!model) {
			throw new LlmError(`unknown Command Code model "${options.model}"`, "UNKNOWN_MODEL");
		}

		let apiKey;
		try {
			apiKey = resolveCommandCodeApiKey(await this.resolveApiKey(API_KEY_ENV));
			apiKey = assertUsableApiKey(apiKey ?? "", "commandcode-go-for-dsh", API_KEY_ENV);
		} catch (error) {
			if (error instanceof LlmError) throw error;
			throw new LlmError(
				`commandcode-go-for-dsh: no API key for "${PROVIDER}"; store ${API_KEY_ENV} or export it`,
				"MISSING_CREDENTIAL",
			);
		}

		const body = buildGenerateBody(model, options);
		const response = await fetch(generateUrl(), {
			method: "POST",
			headers: {
				...attributionHeaders(),
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				Accept: "application/x-ndjson",
				"x-cli-environment": "production",
				"x-command-code-version": COMMAND_CODE_VERSION,
				"x-session-id": options.sessionId ?? crypto.randomUUID(),
				...(process.env.CMD_ZDR === "1" ? { "x-cmd-zdr": "1" } : {}),
			},
			body: JSON.stringify(body),
			signal: options.signal,
		});

		if (!response.ok || !response.body) {
			let detail = "";
			try {
				detail = await response.text();
			} catch {
				// ignore
			}
			const status = response.status;
			const code = status === 401 || status === 403 ? "AUTH" : status === 429 ? "RATE_LIMIT" : "PROVIDER";
			throw new LlmError(`Command Code ${status}: ${detail || response.statusText}`, code, { status });
		}

		for await (const chunk of translateEvents(ndjsonLines(response.body))) {
			if (chunk.type === "tool-call-delta") {
				yield { ...chunk, id: CallId(chunk.id) };
			} else if (chunk.type === "block-end" && chunk.block.type === "tool-call") {
				yield { ...chunk, block: { ...chunk.block, id: CallId(chunk.block.id) } };
			} else {
				yield chunk;
			}
		}
	}
}

export { API_KEY_ENV, MODELS, PROVIDER, PROVIDER_NAME };
