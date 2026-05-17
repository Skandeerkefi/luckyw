import { useEffect } from "react";
import { useRoobetStore } from "../store/RoobetStore";
import {
	buildDefaultPreviousRange,
	formatMoney,
	formatRangeLabel,
	getPrizeAmountByRank,
	getTotalPrize,
	maskUsername,
} from "@/lib/roobetLeaderboard";

export const PreviousLeaderboard = () => {
	const {
		previousLeaderboard,
		leaderboardConfig,
		previousLoading,
		previousError,
		fetchPreviousLeaderboard,
		fetchLeaderboardConfig,
	} = useRoobetStore();

	useEffect(() => {
		if (!leaderboardConfig) {
			fetchLeaderboardConfig();
		}
	}, [fetchLeaderboardConfig, leaderboardConfig]);

	useEffect(() => {
		if (!leaderboardConfig) {
			return;
		}

		const previousRange = leaderboardConfig.previous ?? buildDefaultPreviousRange();
		fetchPreviousLeaderboard(previousRange.startDate, previousRange.endDate);
	}, [fetchPreviousLeaderboard, leaderboardConfig]);

	const previousRange = leaderboardConfig?.previous ?? buildDefaultPreviousRange();
	const prizeByRank = getPrizeAmountByRank(previousRange.prizeSplit);
	const totalPrize = getTotalPrize(previousRange.prizeSplit);
	const topPlayers = previousLeaderboard?.data?.slice(0, 3) ?? [];
	const podiumOrder =
		topPlayers.length === 3 ? [topPlayers[1], topPlayers[0], topPlayers[2]] : topPlayers;

	if (previousLoading) {
		return <p className="text-lg text-center text-white/70">Loading previous leaderboard…</p>;
	}

	if (previousError) {
		return <p className="text-center text-red-400">{previousError}</p>;
	}

	if (!previousLeaderboard?.data?.length) {
		return <p className="text-center text-white/60">No previous leaderboard data available.</p>;
	}

	return (
		<div className="mx-auto max-w-5xl">
			<div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-center text-white/70">
				<p>
					Period: <span className="text-[#F1A82F]">{formatRangeLabel(previousRange)}</span>
				</p>
				<p className="rounded-full border border-[#F1A82F]/30 bg-[#F1A82F]/10 px-4 py-2 text-sm text-[#F1A82F]">
					Total Prize Pool: ${formatMoney(totalPrize)}
				</p>
			</div>

			<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
				{podiumOrder.map((player) => {
					const rankIndex = topPlayers.findIndex((entry) => entry.uid === player.uid);
					const rank = rankIndex + 1;
					const isTop1 = rankIndex === 0;

					return (
						<div
							key={player.uid}
							className={`relative rounded-3xl border border-[#F1A82F]/40 bg-gradient-to-br from-[#1F0A0A] to-[#3A1F0F] p-6 text-center shadow-[0_0_25px_rgba(241,168,47,0.4)] transition-transform duration-300 hover:scale-105 ${
								isTop1 ? "scale-110" : ""
							}`}
						>
							<div className="mb-3 text-5xl">
								{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
							</div>
							<div className="mb-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F1A82F] to-[#FFD700]">
								{maskUsername(player.username)}
							</div>
							<div className="mb-4 text-white/80">{formatMoney(Number(player.weightedWagered))} Wagered</div>
							<div className="rounded-full bg-gradient-to-r from-[#F1A82F] to-[#FFD700] px-4 py-2 text-lg font-bold text-black shadow-[0_0_15px_rgba(241,168,47,0.7)]">
								Prize: ${formatMoney(prizeByRank[rank] ?? 0)}
							</div>
							{isTop1 ? (
								<div className="absolute inset-0 -z-10 animate-pulse rounded-3xl bg-yellow-400/10 blur-2xl" />
							) : null}
						</div>
					);
				})}
			</div>

			<div className="mt-6 text-center">
				<button
					onClick={() => (window.location.href = "/PreviousLeaderboard")}
					className="relative rounded-xl bg-gradient-to-r from-[#F1A82F] to-[#FFD700] px-8 py-3 font-bold text-black shadow-[0_0_15px_rgba(241,168,47,0.7)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(241,168,47,0.8)]"
				>
					View Full Previous Leaderboard
				</button>
			</div>
		</div>
	);
};
