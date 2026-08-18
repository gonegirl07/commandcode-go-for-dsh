import assert from "node:assert/strict";
import test from "node:test";

import { formatReport, parseCredits, parseSubscription } from "../lib/usage.js";

test("formats a Go plan report", () => {
	const credits = parseCredits({
		credits: { monthlyCredits: 8.77, purchasedCredits: 0, freeCredits: 0, belowThreshold: false },
		windowLimits: {
			limited: true,
			fiveHour: { used: 0.14, cap: 3, exceeded: false, resetAt: Date.parse("2026-08-16T19:15:00") },
			weekly: { used: 1.23, cap: 6, exceeded: false, resetAt: Date.parse("2026-08-22T10:44:00") },
		},
	});
	const subscription = parseSubscription({
		data: { planId: "individual-go", status: "active", currentPeriodEnd: "2026-09-15T00:00:00.000Z" },
	});
	const report = formatReport(credits, subscription);
	assert.match(report, /Command Code  individual-go/);
	assert.match(report, /Month\s+\$8\.77 \/ \$10 left/);
	assert.match(report, /5-hour/);
	assert.match(report, /Week/);
	assert.match(report, /Cycle\s+ends Sep 15, 2026/);
});

test("rejects an unexpected credits payload", () => {
	assert.equal(parseCredits({ hello: true }), undefined);
});
