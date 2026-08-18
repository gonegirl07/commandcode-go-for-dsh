import z from "@deepseek-ai/schemastery";
import { LlmError, assertUsableApiKey } from "@deepseek-ai/dsh-llm";
import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
import { CommandCodeAdapter } from "./adapter.js";
import { API_KEY_ENV, MODELS, PROVIDER, PROVIDER_NAME, settingsModels } from "./models.js";
import { buildUsageReport } from "./usage.js";

export const name = "commandcode-go-for-dsh";
export const inject = ["llm"];
export const SETTINGS_NS = settingsNamespace(name);

const ModelEntry = z.object({
	id: z.string().required(),
	name: z.string(),
	contextWindow: z.number(),
	maxTokens: z.number(),
});

export const Settings = z.object({
	displayName: z.string(),
	api: z.string(),
	baseURL: z.string(),
	apiKeyEnv: z.string(),
	models: z.array(ModelEntry),
});

const SETTINGS_BASE = {
	displayName: PROVIDER_NAME,
	apiKeyEnv: API_KEY_ENV,
	models: settingsModels(),
};

async function resolveCredential(ctx, ref) {
	const credentials = ctx.get("credentials");
	if (credentials !== undefined) {
		const hit = await credentials.resolve(ref);
		if (hit !== undefined) return assertUsableApiKey(hit.value, name, ref);
	}
	try {
		const { launchEnvironmentOf } = await import("@deepseek-ai/dsh-launch-environment");
		const ambient = launchEnvironmentOf(ctx).get(ref);
		if (ambient !== undefined && ambient.value.length > 0) {
			return assertUsableApiKey(ambient.value, name, ref);
		}
	} catch {
		// launch-environment is optional for embedders
	}
	const env = process.env[ref];
	if (env) return assertUsableApiKey(env, name, ref);
	throw new LlmError(
		`${name}: no API key for provider route "${PROVIDER}"; store ${ref} through the credentials service or export ${ref}`,
		"MISSING_CREDENTIAL",
	);
}

export function apply(ctx) {
	installSettingsSection(ctx, SETTINGS_NS, Settings, SETTINGS_BASE, {
		setSource() {},
		onChange() {},
	});

	const adapter = new CommandCodeAdapter({
		resolveApiKey: (ref) => resolveCredential(ctx, ref),
	});
	ctx.llm.registerConfigurableProviders([
		{
			provider: PROVIDER,
			displayName: PROVIDER_NAME,
			settingsNs: name,
			settingsPath: [],
			declared: true,
		},
	]);
	ctx.llm.registerAdapter([PROVIDER], adapter);
	ctx.llm.registerModelDiscovery(name, async () =>
		MODELS.map((model) => ({
			id: model.id,
			name: model.name,
			contextWindow: model.contextWindow,
			maxTokens: model.maxTokens,
		})),
	);

	const commands = ctx.get("commands");
	if (commands !== undefined) {
		ctx.effect(() =>
			commands.register({
				name: "cc-usage",
				description: "Show Command Code plan credits and usage limits",
				recordInput: false,
				handler: async () => {
					try {
						const apiKey = await resolveCredential(ctx, API_KEY_ENV);
						const report = await buildUsageReport(apiKey);
						if (!report.ok) return { kind: "error", text: report.error };
						return { kind: "success", text: report.text };
					} catch (error) {
						return {
							kind: "error",
							text: error instanceof Error ? error.message : String(error),
						};
					}
				},
			}),
		);
	}
}

export { API_KEY_ENV, MODELS, PROVIDER, PROVIDER_NAME, settingsModels } from "./models.js";
export { CommandCodeAdapter } from "./adapter.js";
export { buildGenerateBody, resolveCommandCodeApiKey } from "./request.js";
export { formatReport, parseCredits, parseSubscription } from "./usage.js";
