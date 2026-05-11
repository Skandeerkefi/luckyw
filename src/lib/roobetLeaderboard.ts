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
	{ rank: 1, amount: 800 },
	{ rank: 2, amount: 550 },
	{ rank: 3, amount: 325 },
	{ rank: 4, amount: 200 },
	{ rank: 5, amount: 150 },
	{ rank: 6, amount: 125 },
	{ rank: 7, amount: 125 },
	{ rank: 8, amount: 100 },
	{ rank: 9, amount: 75 },
	{ rank: 10, amount: 50 },
];

export function toDateOnlyUtc(date: Date): string {
	return date.toISOString().split("T")[0];
}

export function buildDefaultCurrentRange(): LeaderboardWindowConfig {
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = now.getUTCMonth();
	const day = now.getUTCDate();

	const start =
		day >= 11
			? new Date(Date.UTC(year, month, 11, 0, 0, 0, 0))
			: new Date(Date.UTC(year, month - 1, 11, 0, 0, 0, 0));
	const end = new Date(start);
	end.setUTCMonth(end.getUTCMonth() + 1);

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
	previousStart.setUTCMonth(previousStart.getUTCMonth() - 1);

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

	return `${start.getUTCMonth() + 1}/${start.getUTCDate()}-${end.getUTCMonth() + 1}/${end.getUTCDate()} Monthly Edition 🏆`;
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
