import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { useRoobetStore } from "../store/RoobetStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	buildDefaultPreviousRange,
	formatMoney,
	formatRangeLabel,
	getPrizeAmountByRank,
	getTotalPrize,
	maskUsername,
} from "@/lib/roobetLeaderboard";

const PreviousRoobetPage: React.FC = () => {
	const {
		previousLeaderboard,
		leaderboardConfig,
		previousLoading,
		previousError,
		fetchPreviousLeaderboard,
		fetchLeaderboardConfig,
	} = useRoobetStore();

	const [showHowItWorks, setShowHowItWorks] = useState(false);

	useEffect(() => {
		if (!leaderboardConfig) {
			fetchLeaderboardConfig();
		}
	}, [fetchLeaderboardConfig, leaderboardConfig]);

	const previousRange = leaderboardConfig?.previous ?? buildDefaultPreviousRange();
	const prizeByRank = getPrizeAmountByRank(previousRange.prizeSplit);
	const totalPrize = getTotalPrize(previousRange.prizeSplit);

	useEffect(() => {
		if (!leaderboardConfig) {
			return;
		}

		fetchPreviousLeaderboard(previousRange.startDate, previousRange.endDate);
	}, [fetchPreviousLeaderboard, leaderboardConfig, previousRange.endDate, previousRange.startDate]);

	const topPlayers = previousLeaderboard?.data?.slice(0, 15) ?? [];

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden text-[#FFFBED]">
			<div
				className="fixed inset-0 z-0 bg-center bg-no-repeat bg-contain opacity-40"
				style={{
					backgroundImage: "url('https://i.ibb.co/2YNrPKrD/3dgifmaker96052.gif')",
					backgroundColor: "#000",
				}}
			/>
			<div className="fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />

			<div className="relative z-10">
				<Navbar />

				<main className="mx-auto w-full max-w-7xl flex-grow px-6 py-12 text-center">
					<h1 className="mb-2 text-4xl font-extrabold text-[#F1A82F] md:text-5xl">
						💰 PREVIOUS LEADERBOARD 💰
					</h1>
					<p className="mb-2 text-lg text-[#F1A82F]/80">{formatRangeLabel(previousRange)}</p>
					<p className="mb-8 text-sm text-[#F1A82F]/70">Total Prize Pool: ${formatMoney(totalPrize)}</p>

					<div className="mb-10 flex items-center justify-center gap-4">
						<Button
							className="rounded-full bg-[#F1A82F] px-6 py-3 font-semibold text-[#0F0F0F] shadow-lg hover:bg-[#F9B97C]"
							onClick={() => window.open("https://roobet.com/?ref=luckyw", "_blank", "noopener noreferrer")}
						>
							Join Now
						</Button>

						<Button
							className="flex items-center gap-2 rounded-full border border-[#F1A82F] px-6 py-3 font-semibold text-[#F1A82F] hover:bg-[#F1A82F]/10"
							onClick={() => setShowHowItWorks(true)}
						>
							<Info className="h-4 w-4" /> How It Works
						</Button>
					</div>

					{previousLoading && <p className="text-[#F1A82F]">Loading leaderboard…</p>}
					{previousError && <p className="text-[#F9B97C]">{previousError}</p>}

					{topPlayers.length > 0 ? (
						<div className="mb-12 overflow-x-auto rounded-2xl border border-[#F1A82F]/20 bg-[#0F0F0F]/80 shadow-lg backdrop-blur-md">
							<table className="w-full table-auto">
								<thead className="bg-[#F1A82F] text-sm uppercase text-[#0F0F0F]">
									<tr>
										<th className="w-[10%] p-4">Rank</th>
										<th className="w-[40%] p-4">Player</th>
										<th className="w-[25%] p-4 text-right">Wagered</th>
										<th className="w-[25%] p-4 text-right">Prize</th>
									</tr>
								</thead>

								<tbody>
									{topPlayers.map((player) => {
										const rank = player.rankLevel;
										return (
											<tr key={player.uid} className="border-t border-[#F9B97C]/20 transition hover:bg-[#F9B97C]/10">
												<td className="p-4 text-center">#{rank}</td>
												<td className="truncate p-4 font-semibold text-center">{maskUsername(player.username)}</td>
												<td className="p-4 text-right font-mono text-[#F9B97C]">${formatMoney(Number(player.weightedWagered))}</td>
												<td className="p-4 text-right font-bold text-[#F1A82F]">${formatMoney(prizeByRank[rank] ?? 0)}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					) : !loading && !error ? (
						<p className="mb-12 text-[#F1A82F]/70">No players yet this period.</p>
					) : null}
				</main>
				<Footer />
			</div>

			<Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
				<DialogContent className="max-w-lg border border-[#F1A82F]/30 bg-[#0F0F0F] text-[#FFFBED]">
					<DialogHeader>
						<DialogTitle className="text-center text-2xl font-bold text-[#F1A82F]">How the Leaderboard Works</DialogTitle>
						<DialogDescription className="text-center text-[#F1A82F]/80">Weighted wagers based on RTP determine ranking.</DialogDescription>
					</DialogHeader>
					<div className="space-y-3 text-sm">
						<p>RTP &lt;= 97% -&gt; <strong>100%</strong> weight</p>
						<p>RTP &gt; 97% -&gt; <strong>50%</strong> weight</p>
						<p>RTP &gt;= 98% -&gt; <strong>10%</strong> weight</p>
						<p className="border-t border-[#F1A82F]/30 pt-3">Slots and Provably Fair count, Dice excluded.</p>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default PreviousRoobetPage;
