import { BASE_URL, COMMAND_CODE_VERSION } from "./models.js";

const TIMEOUT_MS = 10_000;
const RAW_PREVIEW = 280;

export const MONTHLY_ALLOWANCE = {
	"individual-go": 10,
	"individual-goat": 70,
	"individual-pro": 80,
	"individual-max": 150,
	"individual-max-10x": 150,
	"individual-max-20x": 300,
};

function asFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function parseWindow(value) {
	if (!value || typeof value !== "object") return undefined;
	const used = asFiniteNumber(value.used);
	const cap = asFiniteNumber(value.cap);
	const resetAt = asFiniteNumber(value.resetAt);
	if (used === undefined || cap === undefined || resetAt === undefined) return undefined;
	return { used, cap, exceeded: value.exceeded === true, resetAt };
}

export function parseCredits(data) {
	if (!data || typeof data !== "object" || !data.credits || typeof data.credits !== "object") return undefined;
	const monthlyCredits = asFiniteNumber(data.credits.monthlyCredits);
	if (monthlyCredits === undefined) return undefined;
	const windows = data.windowLimits && typeof data.windowLimits === "object" ? data.windowLimits : undefined;
	return {
		monthlyCredits,
		purchasedCredits: asFiniteNumber(data.credits.purchasedCredits) ?? 0,
		freeCredits: asFiniteNumber(data.credits.freeCredits) ?? 0,
		belowThreshold: data.credits.belowThreshold === true,
		limited: windows?.limited === true,
		fiveHour: windows ? parseWindow(windows.fiveHour) : undefined,
		weekly: windows ? parseWindow(windows.weekly) : undefined,
	};
}

export function parseSubscription(data) {
	if (!data || typeof data !== "object" || !data.data || typeof data.data !== "object") return undefined;
	const row = data.data;
	const planId = typeof row.planId === "string" ? row.planId : undefined;
	const status = typeof row.status === "string" ? row.status : undefined;
	const currentPeriodEnd = typeof row.currentPeriodEnd === "string" ? row.currentPeriodEnd : undefined;
	if (!planId && !status && !currentPeriodEnd) return undefined;
	return { planId, status, currentPeriodEnd };
}

function usd(amount, compact = false) {
	if (compact && Number.isInteger(amount)) return `$${amount}`;
	return `$${amount.toFixed(2)}`;
}

function formatReset(resetAt) {
	return new Date(resetAt).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

function formatCycleEnd(iso) {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatWindow(label, window) {
	const suffix = window.exceeded ? "exceeded, reset" : "reset";
	return `${label.padEnd(7)}  ${usd(window.used)} / ${usd(window.cap, true)}    ${suffix} ${formatReset(window.resetAt)}`;
}

export function formatReport(credits, subscription, subscriptionError) {
	const lines = [];
	const headerBits = ["Command Code", subscription?.planId];
	if (subscription?.status && subscription.status !== "active") headerBits.push(`(${subscription.status})`);
	lines.push(headerBits.filter(Boolean).join("  "));

	const monthlyCap = subscription?.planId ? MONTHLY_ALLOWANCE[subscription.planId] : undefined;
	const month =
		monthlyCap !== undefined
			? `${usd(credits.monthlyCredits)} / ${usd(monthlyCap, true)} left`
			: `${usd(credits.monthlyCredits)} left`;
	lines.push(`${"Month".padEnd(7)}  ${month}`);

	if (credits.purchasedCredits > 0 || credits.freeCredits > 0) {
		const extras = [];
		if (credits.purchasedCredits > 0) extras.push(`${usd(credits.purchasedCredits)} purchased`);
		if (credits.freeCredits > 0) extras.push(`${usd(credits.freeCredits)} free`);
		lines.push(`${"Extra".padEnd(7)}  ${extras.join(" + ")}`);
	}

	if (credits.limited) {
		if (credits.fiveHour) lines.push(formatWindow("5-hour", credits.fiveHour));
		if (credits.weekly) lines.push(formatWindow("Week", credits.weekly));
	}

	if (subscription?.currentPeriodEnd) {
		lines.push(`${"Cycle".padEnd(7)}  ends ${formatCycleEnd(subscription.currentPeriodEnd)}`);
	} else if (subscriptionError) {
		lines.push(`${"Cycle".padEnd(7)}  unavailable (${subscriptionError})`);
	}

	return lines.join("\n");
}

function previewRaw(raw) {
	if (!raw) return "";
	const compact = raw.replace(/\s+/g, " ").trim();
	return compact.length <= RAW_PREVIEW ? compact : `${compact.slice(0, RAW_PREVIEW)}…`;
}

export async function getJson(path, apiKey, fetchImpl = fetch) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		const response = await fetchImpl(`${BASE_URL}${path}`, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: "application/json",
				"x-cli-environment": "production",
				"x-command-code-version": COMMAND_CODE_VERSION,
			},
			signal: controller.signal,
		});
		const raw = await response.text();
		if (response.status === 401) {
			return { ok: false, error: "Unauthorized. Check the Command Code API key.", status: 401, raw };
		}
		if (response.status === 429) {
			return { ok: false, error: "Rate limited. Try again later.", status: 429, raw };
		}
		if (response.status >= 500) {
			return {
				ok: false,
				error: `Command Code billing API unavailable (HTTP ${response.status}).`,
				status: response.status,
				raw,
			};
		}
		if (!response.ok) {
			return {
				ok: false,
				error: `Command Code billing API failed (HTTP ${response.status}).`,
				status: response.status,
				raw,
			};
		}
		try {
			return { ok: true, data: JSON.parse(raw) };
		} catch {
			return { ok: false, error: "Billing API returned non-JSON.", raw };
		}
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return { ok: false, error: "Command Code billing API timed out." };
		}
		return { ok: false, error: "Command Code billing API request failed." };
	} finally {
		clearTimeout(timer);
	}
}

export async function buildUsageReport(apiKey, fetchImpl = fetch) {
	const [creditsResult, subscriptionResult] = await Promise.all([
		getJson("/alpha/billing/credits", apiKey, fetchImpl),
		getJson("/alpha/billing/subscriptions", apiKey, fetchImpl),
	]);

	if (!creditsResult.ok) return { ok: false, error: creditsResult.error };

	const credits = parseCredits(creditsResult.data);
	if (!credits) {
		return { ok: false, error: `Billing API changed shape. ${previewRaw(JSON.stringify(creditsResult.data))}`.trim() };
	}

	let subscription;
	let subscriptionError;
	if (subscriptionResult.ok) {
		subscription = parseSubscription(subscriptionResult.data);
		if (!subscription) subscriptionError = "changed shape";
	} else {
		subscriptionError = subscriptionResult.error;
	}

	const warning = credits.belowThreshold || credits.fiveHour?.exceeded || credits.weekly?.exceeded;
	return { ok: true, text: formatReport(credits, subscription, subscriptionError), warning };
}
