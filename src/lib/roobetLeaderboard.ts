export type PrizeSplitEntry = {
	rank: number;
	amount: number;
};

export type LeaderboardWindowConfig = {
	startDate: string;
	endDate: string;
	prizeSplit: PrizeSplitEntry[];
};

export type LeaderboardConfigResponse = {
	current: LeaderboardWindowConfig;
	previous: LeaderboardWindowConfig;
	updatedAt?: string | null;
};

export const DEFAULT_PRIZE_SPLIT: PrizeSplitEntry[] = [
	{ rank: 1, amount: 600 },
	{ rank: 2, amount: 450 },
	{ rank: 3, amount: 350 },
	{ rank: 4, amount: 275 },
	{ rank: 5, amount: 225 },
	{ rank: 6, amount: 200 },
	{ rank: 7, amount: 175 },
	{ rank: 8, amount: 150 },
	{ rank: 9, amount: 125 },
	{ rank: 10, amount: 100 },
	{ rank: 11, amount: 90 },
	{ rank: 12, amount: 80 },
	{ rank: 13, amount: 70 },
	{ rank: 14, amount: 60 },
	{ rank: 15, amount: 50 },
];

export function toDateOnlyUtc(date: Date): string {
	return date.toISOString().split("T")[0];
}

export function buildDefaultCurrentRange(): LeaderboardWindowConfig {
	const now = new Date();
	const nowMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
	const cycleStart = new Date(Date.UTC(2026, 8, 8)); // 09/08/2026
	const cycleLength = 15 * 86400000;

	const diff = nowMs - cycleStart.getTime();
	const cycleNum = Math.floor(diff / cycleLength);
	const start = new Date(cycleStart.getTime() + cycleNum * cycleLength);
	const end = new Date(start.getTime() + (15 - 1) * 86400000);

	return {
		startDate: toDateOnlyUtc(start),
		endDate: toDateOnlyUtc(end),
		prizeSplit: DEFAULT_PRIZE_SPLIT,
	};
}

export function buildDefaultPreviousRange(): LeaderboardWindowConfig {
	const current = buildDefaultCurrentRange();
	const currentStart = new Date(`${current.startDate}T00:00:00.000Z`);
	const previousEnd = new Date(currentStart);
	previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
	const previousStart = new Date(previousEnd);
	previousStart.setUTCDate(previousStart.getUTCDate() - 15 + 1);

	return {
		startDate: toDateOnlyUtc(previousStart),
		endDate: toDateOnlyUtc(previousEnd),
		prizeSplit: DEFAULT_PRIZE_SPLIT.map((entry) => ({ ...entry })),
	};
}

export function getPrizeAmountByRank(prizeSplit: PrizeSplitEntry[]) {
	return prizeSplit.reduce<Record<number, number>>((accumulator, entry) => {
		accumulator[entry.rank] = entry.amount;
		return accumulator;
	}, {});
}

export function getTotalPrize(prizeSplit: PrizeSplitEntry[]) {
	return prizeSplit.reduce((total, entry) => total + Number(entry.amount || 0), 0);
}

export function formatRangeLabel(range: { startDate: string; endDate: string }) {
	const start = new Date(`${range.startDate}T00:00:00.000Z`);
	const end = new Date(`${range.endDate}T00:00:00.000Z`);

	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(start.getUTCMonth() + 1)}/${pad(start.getUTCDate())}/${start.getUTCFullYear()} - ${pad(end.getUTCMonth() + 1)}/${pad(end.getUTCDate())}/${end.getUTCFullYear()}`;
}

export function maskUsername(username: string): string {
	if (!username || username.length <= 2) return "***";
	const first = username.charAt(0);
	const last = username.charAt(username.length - 1);
	const asterisks = "*".repeat(Math.max(1, username.length - 2));
	return first + asterisks + last;
}

export function formatMoney(value: number) {
	return Number(value || 0).toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}
