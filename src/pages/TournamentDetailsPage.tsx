import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTournamentStore, type TournamentMatch, type TournamentPlayer } from "@/store/useTournamentStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy } from "lucide-react";
import type { SlotSearchItem } from "@/store/useTournamentStore";

const getErrorMessage = (err: unknown) =>
	err instanceof Error ? err.message : "Something went wrong";

const playerName = (player?: TournamentPlayer | null) => {
	if (!player) return "TBD";
	if (typeof player.userId === "string") return `Player ${player.position}`;
	return player.userId?.kickUsername || `Player ${player.position}`;
};

const roundLabel = (roundNumber: number, roundsCount: number) => {
	if (roundNumber === roundsCount) return "Finals";
	if (roundNumber === roundsCount - 1) return "Semi-Finals";
	if (roundNumber === roundsCount - 2) return "Quarter-Finals";
	return `Round ${roundNumber}`;
};

function TournamentDetailsPage() {
	const { id } = useParams();
	const {
		tournamentDetails,
		fetchTournamentById,
		searchSlots,
		slotSearchResults,
		clearSlotSearch,
		joinTournament,
		startTournament,
		submitMatchResult,
	} = useTournamentStore();
	const { user, token } = useAuthStore();
	const { toast } = useToast();

	const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
	const [slotQuery, setSlotQuery] = useState("");
	const [selectedSlot, setSelectedSlot] = useState<SlotSearchItem | null>(null);
	const [resultsMap, setResultsMap] = useState<Record<string, { multiplier1: string; multiplier2: string }>>({});
	const debouncedQuery = useDebounce(slotQuery, 350);

	useEffect(() => {
		if (!id) return;
		fetchTournamentById(id).catch((err) => {
			toast({ title: "Error", description: err.message, variant: "destructive" });
		});
	}, [id, fetchTournamentById, toast]);

	useEffect(() => {
		if (debouncedQuery.length < 2) {
			clearSlotSearch();
			return;
		}
		searchSlots(debouncedQuery).catch((err) => {
			toast({ title: "Slot search failed", description: err.message, variant: "destructive" });
		});
	}, [debouncedQuery, searchSlots, clearSlotSearch, toast]);

	const groupedMatches = useMemo(() => {
		const matches = tournamentDetails?.matches || [];
		const grouped: Record<number, TournamentMatch[]> = {};
		for (const match of matches) {
			grouped[match.roundNumber] = grouped[match.roundNumber] || [];
			grouped[match.roundNumber].push(match);
		}
		return grouped;
	}, [tournamentDetails?.matches]);

	const occupiedPositions = useMemo(() => {
		const map = new Map<number, TournamentPlayer>();
		for (const p of tournamentDetails?.players || []) {
			map.set(p.position, p);
		}
		return map;
	}, [tournamentDetails?.players]);

	const onJoin = async () => {
		if (!id || !selectedSlot) return;
		if (!selectedPosition) {
			toast({
				title: "Select position",
				description: "Pick an open bracket place before joining.",
				variant: "destructive",
			});
			return;
		}
		if (!token) {
			toast({ title: "Login required", description: "Please login first.", variant: "destructive" });
			return;
		}
		try {
			const slotDisplayName =
				selectedSlot.name?.trim() || selectedSlot.slotName?.trim() || "";

			if (!slotDisplayName) {
				toast({
					title: "Invalid slot",
					description: "Please select a valid slot from search results.",
					variant: "destructive",
				});
				return;
			}

			await joinTournament(id, {
				position: selectedPosition,
				slotName: selectedSlot.slotName,
				slotDisplayName,
				provider: selectedSlot.provider,
				slotImage: selectedSlot.image,
			});
			toast({ title: "Joined tournament" });
			setSelectedSlot(null);
			setSelectedPosition(null);
			setSlotQuery("");
			clearSlotSearch();
		} catch (err: unknown) {
			toast({ title: "Join failed", description: getErrorMessage(err), variant: "destructive" });
		}
	};

	const onStart = async () => {
		if (!id) return;
		try {
			await startTournament(id);
			toast({ title: "Tournament started" });
		} catch (err: unknown) {
			toast({ title: "Start failed", description: getErrorMessage(err), variant: "destructive" });
		}
	};

	const onSubmitResult = async (matchId: string) => {
		const data = resultsMap[matchId];
		if (!data) return;

		const m1 = Number(data.multiplier1);
		const m2 = Number(data.multiplier2);
		if (Number.isNaN(m1) || Number.isNaN(m2)) {
			toast({ title: "Invalid multipliers", variant: "destructive" });
			return;
		}

		try {
			await submitMatchResult(matchId, { multiplier1: m1, multiplier2: m2 });
			toast({ title: "Result submitted" });
		} catch (err: unknown) {
			toast({ title: "Submit failed", description: getErrorMessage(err), variant: "destructive" });
		}
	};

	if (!tournamentDetails) {
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
				<div className='relative z-10 flex flex-col min-h-screen'>
					<Navbar />
					<main className='container flex-grow max-w-6xl px-4 py-8 mx-auto'>
						Loading tournament...
					</main>
					<Footer />
				</div>
			</div>
		);
	}

	const { tournament, players } = tournamentDetails;
	const isAdmin = user?.role === "admin";
	const currentUserEntry = players.find((p) => {
		if (!user) return false;
		if (typeof p.userId === "string") return p.userId === user.id;
		return p.userId?._id === user.id;
	});
	const isUserAlreadyJoined = Boolean(currentUserEntry);
	const roundsCount = Math.max(
		1,
		...Object.keys(groupedMatches).map((round) => Number(round))
	);

	const bracketRowHeight = 128;
	const bracketBaseGap = 24;
	const bracketStep = bracketRowHeight + bracketBaseGap;

	const getRoundTopOffset = (roundNumber: number) =>
		((Math.pow(2, roundNumber - 1) - 1) / 2) * bracketStep;

	const getRoundGap = (roundNumber: number) =>
		Math.max(
			bracketBaseGap,
			Math.pow(2, roundNumber - 1) * bracketStep - bracketRowHeight
		);

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
			<div className='relative z-10 flex flex-col min-h-screen'>
				<Navbar />
				<main className='container flex-grow max-w-6xl px-4 py-8 mx-auto'>
				<div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
					<h1 className='text-3xl font-bold'>{tournament.name}</h1>
					<Link to='/tournaments'>
						<Button className='bg-[#ffffff] text-black hover:bg-[#F1A82F]'>Back</Button>
					</Link>
				</div>

				<Card className='mb-5 border border-[#F1A82F] bg-[#000000]/70 backdrop-blur-sm'>
					<CardContent className='pt-6 grid grid-cols-1 gap-2 md:grid-cols-2 text-sm text-[#f0e8d8]'>
						<p>Status: <strong>{tournament.status}</strong></p>
						<p>Players: {players.length}/{tournament.maxPlayers}</p>
						<p>Prize: ${tournament.prizeAmount}</p>
						<p>Starts: {new Date(tournament.startDate).toLocaleString()}</p>
						<p className='md:col-span-2'>Champion: {tournament.champion?.kickUsername || "TBD"}</p>
					</CardContent>
				</Card>

				{tournament.status === "upcoming" && !isAdmin && (
					<Card className='mb-5 border border-[#F1A82F] bg-[#000000]/70 backdrop-blur-sm'>
						<CardHeader>
							<CardTitle>Join Tournament</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div>
								<div className='mb-2 text-xs font-bold uppercase tracking-wide text-[#F1A82F]'>
									Select Your Bracket Place
								</div>
								<div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
									{Array.from({ length: tournament.maxPlayers }, (_, idx) => idx + 1).map((pos) => {
										const taken = occupiedPositions.get(pos);
										const isSelected = selectedPosition === pos;
										const isTaken = Boolean(taken);

										return (
											<button
												type='button'
												key={pos}
												disabled={isTaken || isUserAlreadyJoined}
												onClick={() => setSelectedPosition(pos)}
												className={`rounded-md border px-2 py-2 text-left text-xs transition ${
													isTaken
														? "cursor-not-allowed border-[#5d5d5d] bg-[#2a2a2a] text-[#bdbdbd]"
														: isSelected
															? "border-[#ffffff] bg-[#F1A82F]/40 text-white"
															: "border-[#F1A82F]/40 bg-[#000000] text-[#f2f2f2] hover:bg-[#1f1f1f]"
												}`}
											>
												<div className='font-bold'>Position #{pos}</div>
												<div className='truncate text-[11px]'>
													{taken
														? `Taken by ${typeof taken.userId === "string" ? "Player" : taken.userId?.kickUsername || "Player"}`
														: "Open"}
												</div>
											</button>
										);
									})}
								</div>
							</div>

							<div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
								<Input
									placeholder='Search slot game (min 2 chars)'
									value={slotQuery}
									onChange={(e) => setSlotQuery(e.target.value)}
									className='bg-[#ffffff] text-black placeholder:text-black border-[#F1A82F] md:col-span-3'
								/>
							</div>

							<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
								{slotSearchResults.map((slot) => (
									<button
										type='button'
										key={`${slot.slotName}-${slot.provider}`}
										onClick={() => setSelectedSlot(slot)}
										className={`flex items-center gap-3 rounded-md border p-2 text-left transition ${
											selectedSlot?.slotName === slot.slotName
												? "border-[#ffffff] bg-[#F1A82F]/40"
												: "border-[#F1A82F]/40 bg-[#111111] hover:bg-[#222222]"
										}`}
									>
										<img src={slot.image} alt={slot.name} className='object-cover w-12 h-12 rounded' />
										<div>
											<div className='text-sm font-semibold'>
												{slot.name || slot.slotName}
											</div>
											<div className='text-xs text-[#d8d8d8]'>{slot.provider}</div>
										</div>
									</button>
								))}
							</div>

							<Button
								onClick={onJoin}
								disabled={!selectedSlot || !selectedPosition || isUserAlreadyJoined}
								className='bg-[#ffffff] text-black hover:bg-[#F1A82F]'
							>
								{isUserAlreadyJoined
									? `Joined at position #${currentUserEntry?.position}`
									: "Join Tournament"}
							</Button>
						</CardContent>
					</Card>
				)}

				{isAdmin && tournament.status === "upcoming" && (
					<div className='mb-5'>
						<Button onClick={onStart} className='bg-[#ffffff] text-black hover:bg-[#F1A82F]'>
							Start Tournament
						</Button>
					</div>
				)}

				<div className='rounded-2xl border border-[#F1A82F]/25 bg-[#000000]/80 p-5 backdrop-blur-sm'>
					<div className='mb-4 flex items-center gap-2 text-[#F1A82F]'>
						<Trophy className='w-4 h-4' />
						<span className='text-sm font-bold uppercase tracking-[0.15em]'>Bracket</span>
					</div>

					<div className='pb-2 overflow-x-auto'>
						<div className='flex min-w-[900px] gap-10'>
							{Object.entries(groupedMatches)
								.sort((a, b) => Number(a[0]) - Number(b[0]))
								.map(([round, matches]) => {
									const roundNumber = Number(round);
									const isFinalRound = roundNumber === roundsCount;

									return (
										<div key={round} className='w-[280px] shrink-0'>
											<div className='mb-4 border-b border-[#F1A82F]/20 pb-3 text-sm font-bold uppercase tracking-[0.1em] text-[#f2e7c7]'>
												{roundLabel(roundNumber, roundsCount)}
											</div>

											<div
												className='flex flex-col'
												style={{
													paddingTop: `${getRoundTopOffset(roundNumber)}px`,
													rowGap: `${getRoundGap(roundNumber)}px`,
												}}
											>
												{matches.map((m) => {
													const player1IsWinner =
														m.winner && m.player1 && m.winner._id === m.player1._id;
													const player2IsWinner =
														m.winner && m.player2 && m.winner._id === m.player2._id;

													return (
														<div key={m._id} className='relative'>
															{!isFinalRound && (
																<div className='absolute -right-10 top-1/2 h-px w-10 -translate-y-1/2 bg-[#F1A82F]/35' />
															)}

															<div className='min-h-[128px] rounded-xl border border-[#F1A82F]/35 bg-[#0a2438]/85 p-2 shadow-[0_0_0_1px_rgba(241,168,47,0.08)]'>
																<div
																	className={`mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 ${
																		player1IsWinner
																			? "bg-[#17452c] ring-1 ring-[#F1A82F]/40"
																			: "bg-[#0f3048]"
																	}`}
																>
																	<img
																		src={m.player1?.slotImage || "https://via.placeholder.com/40?text=%20"}
																		alt={m.player1?.slotDisplayName || "slot"}
																		className='object-cover rounded h-9 w-9'
																	/>
																	<div className='flex-1 min-w-0'>
																		<div className='truncate text-sm font-semibold text-[#fff7dd]'>
																			{m.player1?.slotDisplayName || playerName(m.player1)}
																		</div>
																		<div className='truncate text-[11px] text-[#d8d8d8]'>
																			{playerName(m.player1)}
																		</div>
																	</div>
																	<div className='text-xs font-bold text-[#F1A82F]'>
																		{m.multiplier1 ?? "-"}x
																	</div>
																</div>

																<div
																	className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
																		player2IsWinner
																			? "bg-[#17452c] ring-1 ring-[#F1A82F]/40"
																			: "bg-[#0f3048]"
																	}`}
																>
																	<img
																		src={m.player2?.slotImage || "https://via.placeholder.com/40?text=%20"}
																		alt={m.player2?.slotDisplayName || "slot"}
																		className='object-cover rounded h-9 w-9'
																	/>
																	<div className='flex-1 min-w-0'>
																		<div className='truncate text-sm font-semibold text-[#fff7dd]'>
																			{m.player2?.slotDisplayName || playerName(m.player2)}
																		</div>
																		<div className='truncate text-[11px] text-[#d8d8d8]'>
																			{playerName(m.player2)}
																		</div>
																	</div>
																	<div className='text-xs font-bold text-[#F1A82F]'>
																		{m.multiplier2 ?? "-"}x
																	</div>
																</div>

																{isAdmin &&
																	tournament.status === "live" &&
																	m.status === "pending" &&
																	m.player1 &&
																	m.player2 && (
																		<div className='mt-3 space-y-2 border-t border-[#F1A82F]/20 pt-3'>
																			<div className='grid grid-cols-2 gap-2'>
																				<Input
																					type='number'
																					placeholder='P1 x'
																					value={resultsMap[m._id]?.multiplier1 || ""}
																					onChange={(e) =>
																						setResultsMap((prev) => ({
																							...prev,
																							[m._id]: {
																								multiplier1: e.target.value,
																								multiplier2: prev[m._id]?.multiplier2 || "",
																							},
																						}))
																					}
																					className='border-[#F1A82F] bg-[#ffffff] text-black placeholder:text-black'
																				/>
																				<Input
																					type='number'
																					placeholder='P2 x'
																					value={resultsMap[m._id]?.multiplier2 || ""}
																					onChange={(e) =>
																						setResultsMap((prev) => ({
																							...prev,
																							[m._id]: {
																								multiplier1: prev[m._id]?.multiplier1 || "",
																								multiplier2: e.target.value,
																							},
																						}))
																					}
																					className='border-[#F1A82F] bg-[#ffffff] text-black placeholder:text-black'
																				/>
																			</div>
																			<Button
																				onClick={() => onSubmitResult(m._id)}
																				className='w-full bg-[#ffffff] text-black hover:bg-[#F1A82F]'
																			>
																				Submit Result
																			</Button>
																		</div>
																	)}
															</div>
														</div>
													);
												})}
											</div>
										</div>
									);
								})}
						</div>
					</div>
				</div>
				</main>
				<Footer />
			</div>
		</div>
	);
}

export default TournamentDetailsPage;
