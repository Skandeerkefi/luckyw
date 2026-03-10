import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTournamentStore } from "@/store/useTournamentStore";
import type { TournamentHistoryItem } from "@/store/useTournamentStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";

type HistoryPlayerRef = NonNullable<NonNullable<TournamentHistoryItem["matches"]>[number]["player1"]>;
type HistoryMatch = NonNullable<TournamentHistoryItem["matches"]>[number];

const getPlayerId = (player: HistoryPlayerRef | null | undefined) => {
	if (!player || typeof player === "string") return "";
	return String(player._id || player.id || "");
};

const getHistoryPlayerName = (
	history: TournamentHistoryItem,
	player: HistoryPlayerRef | null | undefined
) => {
	if (!player) return "TBD";
	if (typeof player === "string") {
		const found = history.players?.find((p) => String(p.id) === player);
		return found?.kickUsername || `Player ${found?.position || "?"}`;
	}

	if (player.userId?.kickUsername) return player.userId.kickUsername;
	if (player.kickUsername) return player.kickUsername;

	const id = getPlayerId(player);
	const found = history.players?.find((p) => String(p.id) === id);
	return found?.kickUsername || `Player ${found?.position || player.position || "?"}`;
};

const getHistorySlotName = (
	history: TournamentHistoryItem,
	player: HistoryPlayerRef | null | undefined
) => {
	if (!player) return "TBD";
	if (typeof player === "string") {
		const found = history.players?.find((p) => String(p.id) === player);
		return found?.slotDisplayName || found?.slotName || "TBD";
	}
	if (player.slotDisplayName) return player.slotDisplayName;
	if (player.slotName) return player.slotName;
	const id = getPlayerId(player);
	const found = history.players?.find((p) => String(p.id) === id);
	return found?.slotDisplayName || found?.slotName || "TBD";
};

const getHistorySlotImage = (
	history: TournamentHistoryItem,
	player: HistoryPlayerRef | null | undefined
) => {
	if (!player) return "";
	if (typeof player === "string") {
		const found = history.players?.find((p) => String(p.id) === player);
		return found?.slotImage || "";
	}
	if (player.slotImage) return player.slotImage;
	const id = getPlayerId(player);
	const found = history.players?.find((p) => String(p.id) === id);
	return found?.slotImage || "";
};

function TournamentHistoryPage() {
	const { history, fetchHistory } = useTournamentStore();
	const { toast } = useToast();
	const [expandedIds, setExpandedIds] = useState<string[]>([]);

	useEffect(() => {
		fetchHistory().catch((err) => {
			toast({ title: "Error", description: err.message, variant: "destructive" });
		});
	}, [fetchHistory, toast]);

	const toggleExpanded = (id: string) => {
		setExpandedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	return (
		<div className='relative flex flex-col min-h-screen text-white'>
			<div
				className='fixed inset-0 z-0 bg-center bg-no-repeat bg-contain opacity-44'
				style={{
					backgroundImage: "url('https://i.ibb.co/2YNrPKrD/3dgifmaker96052.gif)",
					backgroundColor: "#000",
				}}
			/>
			<div className='fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-black/90 to-black' />
			<div className='relative z-10 flex min-h-screen flex-col'>
				<Navbar />
				<main className='container flex-grow max-w-6xl px-4 py-8 mx-auto'>
				<div className='flex items-center justify-between mb-6'>
					<h1 className='text-3xl font-bold'>Tournament History</h1>
					<Link to='/tournaments'>
						<Button className='bg-[#ffffff] text-black hover:bg-[#F1A82F]'>
							Back to Tournaments
						</Button>
					</Link>
				</div>

				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					{history.map((item: TournamentHistoryItem) => (
						<Card key={item._id} className='border border-[#F1A82F] bg-[#000000]/70 md:col-span-2'>
							<CardHeader>
								<div className='flex flex-wrap items-center justify-between gap-2'>
									<CardTitle>{item.name}</CardTitle>
									<Button
										onClick={() => toggleExpanded(item._id)}
										className='bg-[#ffffff] text-black hover:bg-[#F1A82F]'
									>
										{expandedIds.includes(item._id) ? (
											<>
												Hide Details <ChevronUp className='ml-2 h-4 w-4' />
											</>
										) : (
											<>
												Show Bracket & Details <ChevronDown className='ml-2 h-4 w-4' />
											</>
										)}
									</Button>
								</div>
							</CardHeader>
							<CardContent className='space-y-2 text-sm text-[#f0e8d8]'>
								<p>Prize: ${item.prizeAmount}</p>
								<p>Players: {item.maxPlayers}</p>
								{item.slotGameName && <p>Game Pool: {item.slotGameName}</p>}
								{item.startDate && (
									<p>Started: {new Date(item.startDate).toLocaleString()}</p>
								)}
								<p>
									Champion: {item.championKickUsername || item.championUserId?.kickUsername || "N/A"}
								</p>
								<p>Finished: {new Date(item.finishedAt).toLocaleString()}</p>

								{expandedIds.includes(item._id) && (
									<div className='mt-4 space-y-4 border-t border-[#F1A82F]/40 pt-4'>
										<div>
											<div className='mb-2 text-xs font-bold uppercase tracking-wide text-[#F1A82F]'>
												Players
											</div>
											<div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
												{(item.players || [])
													.slice()
													.sort((a, b) => a.position - b.position)
													.map((p) => (
														<div
															key={`${item._id}-${p.id || p.position}`}
															className='rounded-md border border-[#F1A82F]/30 bg-[#101010] p-2'
														>
															<div className='font-semibold'>#{p.position} {p.kickUsername || "Unknown"}</div>
															<div className='text-xs text-[#d8d8d8]'>
																{p.slotDisplayName || p.slotName}
															</div>
															<div className='text-xs text-[#d8d8d8]'>Provider: {p.provider}</div>
														</div>
													))}
											</div>
										</div>

										<div>
											<div className='mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#F1A82F]'>
												<Trophy className='h-4 w-4' />
												Bracket History
											</div>
											<div className='overflow-x-auto'>
												<div className='flex min-w-[900px] gap-6'>
													{Object.entries(
														(item.matches || []).reduce<Record<number, HistoryMatch[]>>((acc, match) => {
															const round = Number(match.roundNumber || 1);
															acc[round] = acc[round] || [];
															acc[round].push(match);
															return acc;
														}, {})
													)
														.sort((a, b) => Number(a[0]) - Number(b[0]))
														.map(([round, matches]) => (
															<div key={`${item._id}-round-${round}`} className='w-[280px] shrink-0'>
																<div className='mb-2 border-b border-[#F1A82F]/30 pb-2 font-bold text-[#f6df9c]'>
																	Round {round}
																</div>
																<div className='space-y-3'>
																	{matches.map((m) => {
																		const p1Name = getHistoryPlayerName(item, m.player1);
																		const p2Name = getHistoryPlayerName(item, m.player2);
																		const p1Slot = getHistorySlotName(item, m.player1);
																		const p2Slot = getHistorySlotName(item, m.player2);
																		const p1Image = getHistorySlotImage(item, m.player1);
																		const p2Image = getHistorySlotImage(item, m.player2);
																		const winnerName = getHistoryPlayerName(item, m.winner);

																		return (
																			<div key={`${item._id}-${m.id || m.matchNumber}`} className='rounded-lg border border-[#F1A82F]/30 bg-[#101010] p-2'>
																				<div className='mb-1 text-xs text-[#f1d59d]'>Match {m.matchNumber}</div>
																				<div className='rounded bg-[#0f3048] px-2 py-1'>
																					<div className='flex items-center gap-2'>
																						{p1Image ? <img src={p1Image} alt={p1Slot} className='h-7 w-7 rounded object-cover' /> : null}
																						<div className='min-w-0 flex-1'>
																							<div className='truncate text-xs font-semibold'>{p1Slot}</div>
																							<div className='truncate text-[11px] text-[#d8d8d8]'>{p1Name}</div>
																						</div>
																						<div className='text-xs font-bold text-[#F1A82F]'>{m.multiplier1 ?? "-"}x</div>
																					</div>
																				</div>
																				<div className='mt-1 rounded bg-[#17452c] px-2 py-1'>
																					<div className='flex items-center gap-2'>
																						{p2Image ? <img src={p2Image} alt={p2Slot} className='h-7 w-7 rounded object-cover' /> : null}
																						<div className='min-w-0 flex-1'>
																							<div className='truncate text-xs font-semibold'>{p2Slot}</div>
																							<div className='truncate text-[11px] text-[#d8d8d8]'>{p2Name}</div>
																						</div>
																						<div className='text-xs font-bold text-[#F1A82F]'>{m.multiplier2 ?? "-"}x</div>
																					</div>
																				</div>
																				<div className='mt-1 text-[11px] text-[#f0e8d8]'>Winner: {winnerName}</div>
																			</div>
																		);
																	})}
																</div>
															</div>
														))}
												</div>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>

				{history.length === 0 && (
					<div className='py-16 text-center text-[#f0e8d8]'>No tournament history yet.</div>
				)}
				</main>
				<Footer />
			</div>
		</div>
	);
}

export default TournamentHistoryPage;
