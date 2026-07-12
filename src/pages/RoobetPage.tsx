import React, { useEffect, useMemo, useState } from "react";
import { Info, Search, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRoobetStore } from "../store/RoobetStore";
import {
	buildDefaultCurrentRange,
	buildDefaultPreviousRange,
	formatMoney,
	formatRangeLabel,
	getPrizeAmountByRank,
	getTotalPrize,
	maskUsername,
} from "@/lib/roobetLeaderboard";

type Mode = "current" | "previous";

function getCountdownTarget(endDate: string) {
	const end = new Date(`${endDate}T00:00:00.000Z`);
	const nextDay = new Date(end);
	nextDay.setUTCDate(nextDay.getUTCDate() + 1);
	return nextDay;
}

const RoobetPage: React.FC = () => {
	const {
		currentLeaderboard,
		previousLeaderboard,
		leaderboardConfig,
		currentLoading,
		previousLoading,
		currentError,
		previousError,
		fetchLeaderboard,
		fetchPreviousLeaderboard,
		fetchLeaderboardConfig,
	} = useRoobetStore();

	const [showHowItWorks, setShowHowItWorks] = useState(false);
	const [mode, setMode] = useState<Mode>("current");
	const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (!leaderboardConfig) {
			fetchLeaderboardConfig();
		}
	}, [fetchLeaderboardConfig, leaderboardConfig]);

	const currentRange = leaderboardConfig?.current ?? buildDefaultCurrentRange();
	const previousRange = leaderboardConfig?.previous ?? buildDefaultPreviousRange();
	const activeRange = mode === "current" ? currentRange : previousRange;
	const prizeByRank = getPrizeAmountByRank(activeRange.prizeSplit);
	const totalPrize = getTotalPrize(activeRange.prizeSplit);

	useEffect(() => {
		if (!leaderboardConfig) {
			return;
		}

		if (mode === "current") {
			fetchLeaderboard(activeRange.startDate, activeRange.endDate);
		} else {
			fetchPreviousLeaderboard(activeRange.startDate, activeRange.endDate);
		}
	}, [activeRange.endDate, activeRange.startDate, fetchLeaderboard, fetchPreviousLeaderboard, leaderboardConfig, mode]);

	useEffect(() => {
		const tick = () => {
			if (mode !== "current") {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
				return;
			}

			const endTime = getCountdownTarget(currentRange.endDate).getTime();
			const diff = Math.max(0, endTime - Date.now());
			const total = Math.floor(diff / 1000);

			setTimeLeft({
				days: Math.floor(total / 86400),
				hours: Math.floor((total % 86400) / 3600),
				minutes: Math.floor((total % 3600) / 60),
				seconds: total % 60,
			});
		};

		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [currentRange.endDate, mode]);

	// Reset search whenever the user switches between current/previous leaderboards
	useEffect(() => {
		setSearchTerm("");
	}, [mode]);

	const fullLeaderboard = (mode === "current" ? currentLeaderboard : previousLeaderboard)?.data ?? [];

	const normalizedSearch = searchTerm.trim().toLowerCase();

	const topPlayers = useMemo(() => {
		if (!normalizedSearch) {
			return fullLeaderboard.slice(0, 20);
		}

		// Match against the real username (never the masked one), so search
		// still works even though the table only ever displays masked names.
		return fullLeaderboard.filter((player) =>
			player.username.toLowerCase().includes(normalizedSearch)
		);
	}, [fullLeaderboard, normalizedSearch]);

	const isSearching = normalizedSearch.length > 0;
	const isLoading = mode === "current" ? currentLoading : previousLoading;
	const errorMessage = mode === "current" ? currentError : previousError;

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

				<main className="flex-grow w-full px-6 py-12 mx-auto text-center max-w-7xl">
					<h1 className="mb-2 text-4xl font-extrabold text-[#F1A82F] md:text-5xl">
						💰 {mode === "current" ? "CURRENT" : "PREVIOUS"} LEADERBOARD 💰
					</h1>

					<p className="mb-2 text-lg text-[#F1A82F]/80">{formatRangeLabel(activeRange)}</p>
					<p className="mb-8 text-sm text-[#F1A82F]/70">Total Prize Pool: ${formatMoney(totalPrize)}</p>

					<div className="flex justify-center gap-3 mb-8">
						<Button
							className={
								mode === "current"
									? "bg-[#F1A82F] text-[#0F0F0F] hover:bg-[#F9B97C]"
									: "border border-[#F1A82F]/40 bg-transparent text-[#F1A82F] hover:bg-[#F1A82F]/10"
							}
							onClick={() => setMode("current")}
						>
							Current
						</Button>
						<Button
							className={
								mode === "previous"
									? "bg-[#F1A82F] text-[#0F0F0F] hover:bg-[#F9B97C]"
									: "border border-[#F1A82F]/40 bg-transparent text-[#F1A82F] hover:bg-[#F1A82F]/10"
							}
							onClick={() => setMode("previous")}
						>
							Previous
						</Button>
					</div>

					{mode === "current" ? (
						<div className="mb-8">
							<h3 className="mb-2 text-2xl font-bold text-[#F1A82F]">Leaderboard Ends In</h3>
							<div className="flex justify-center gap-4 text-2xl font-extrabold text-[#F9B97C]">
								<TimerBox label="Days" value={timeLeft.days} />
								<TimerBox label="Hours" value={timeLeft.hours} />
								<TimerBox label="Minutes" value={timeLeft.minutes} />
								<TimerBox label="Seconds" value={timeLeft.seconds} />
							</div>
						</div>
					) : null}

					<div className="flex items-center justify-center gap-4 mb-6">
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
							<Info className="w-4 h-4" /> How It Works
						</Button>
					</div>

					<div className="flex justify-center mb-10">
						<div className="relative w-full max-w-sm">
							<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F1A82F]/50" />
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search your username..."
								className="w-full rounded-full border border-[#F1A82F]/40 bg-[#0F0F0F]/60 py-2 pl-10 pr-10 text-sm text-[#FFFBED] placeholder:text-[#F1A82F]/40 focus:border-[#F1A82F] focus:outline-none"
							/>
							{searchTerm ? (
								<button
									type="button"
									onClick={() => setSearchTerm("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F1A82F]/50 hover:text-[#F1A82F]"
									aria-label="Clear search"
								>
									<X className="w-4 h-4" />
								</button>
							) : null}
						</div>
					</div>

					{isLoading && <p className="text-[#F1A82F]">Loading leaderboard…</p>}
					{errorMessage && <p className="text-[#F9B97C]">{errorMessage}</p>}

					{topPlayers.length > 0 ? (
						<div className="mb-12 overflow-x-auto rounded-2xl border border-[#F1A82F]/20 bg-[#0F0F0F]/80 shadow-lg backdrop-blur-md">
							{isSearching ? (
								<p className="border-b border-[#F1A82F]/20 px-4 py-2 text-left text-xs uppercase tracking-wide text-[#F1A82F]/60">
									Showing {topPlayers.length} match{topPlayers.length === 1 ? "" : "es"} for "{searchTerm.trim()}"
								</p>
							) : null}

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
										const rankColor =
											rank === 1
												? "bg-yellow-400 text-black"
												: rank === 2
												? "bg-gray-400 text-black"
												: rank === 3
												? "bg-yellow-700 text-white"
												: rank <= 12
												? "bg-[#F1A82F]/20 text-[#F1A82F]"
												: "bg-white/10 text-white/60";

										return (
											<tr key={player.uid} className="border-t border-[#F9B97C]/20 transition hover:bg-[#F9B97C]/10">
												<td className="p-4 text-center">
													<span className={`inline-flex h-10 w-10 items-center justify-center rounded-full font-bold ${rankColor}`}>
														#{rank}
													</span>
												</td>

												<td className="p-4 font-semibold text-center truncate">{maskUsername(player.username)}</td>

												<td className="p-4 text-right font-mono text-[#F9B97C]">
													${formatMoney(Number(player.weightedWagered))}
												</td>

												<td className="p-4 text-right font-bold text-[#F1A82F]">
													${formatMoney(prizeByRank[rank] ?? 0)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					) : !isLoading && !errorMessage ? (
						<p className="mb-12 text-[#F1A82F]/70">
							{isSearching ? "No matching player found." : "No players in this period."}
						</p>
					) : null}
				</main>

				<Footer />
			</div>

			<Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
				<DialogContent className="max-w-lg border border-[#F1A82F]/30 bg-[#0F0F0F] text-[#FFFBED]">
					<DialogHeader>
						<DialogTitle className="text-center text-2xl font-bold text-[#F1A82F]">
							How the Leaderboard Works
						</DialogTitle>
						<DialogDescription className="text-center text-[#F1A82F]/80">
							Your wagers on Roobet count toward the leaderboard with RTP-based weighting.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-3 text-sm">
						<p>
							Games with an RTP of <strong>97% or less</strong> contribute <strong>100%</strong> of the amount wagered.
						</p>
						<p>
							Games with an RTP <strong>above 97% and below 98%</strong> contribute <strong>50%</strong> of the amount wagered.
						</p>
						<p>
							Games with an RTP of <strong>98% and above</strong> contribute <strong>10%</strong> of the amount wagered.
						</p>
						<p className="border-t border-[#F1A82F]/30 pt-3">
							Only <strong>Slots</strong> and <strong>Provably Fair</strong> count (house games with <strong>Dice excluded</strong>).
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

const TimerBox = ({ label, value }: { label: string; value: number }) => (
	<div className="flex flex-col items-center rounded-xl bg-[#F1A82F]/10 px-4 py-2">
		<span className="text-3xl">{String(value).padStart(2, "0")}</span>
		<span className="text-xs uppercase text-[#F1A82F]/70">{label}</span>
	</div>
);

export default RoobetPage;