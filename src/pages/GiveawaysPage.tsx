import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GiveawayCard } from "@/components/GiveawayCard";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Gift, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { GiveawayEntryRequirement } from "@/store/useGiveawayStore";
import type { GiveawayPlayerDetails } from "@/store/useGiveawayStore";

function GiveawaysPage() {
	const {
		giveaways,
		fetchGiveaways,
		fetchGiveawayPlayers,
		enterGiveaway,
		createGiveaway,
		drawWinner,
	} = useGiveawayStore();
	const { user } = useAuthStore();
	const { toast } = useToast();

	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState<
		"all" | "active" | "completed" | "upcoming"
	>("all");
	const [newTitle, setNewTitle] = useState("");
	const [newEndTime, setNewEndTime] = useState("");
	const [openPlayersFor, setOpenPlayersFor] = useState<string | null>(null);
	const [playersByGiveaway, setPlayersByGiveaway] = useState<
		Record<string, GiveawayPlayerDetails[]>
	>({});
	const [playersLoadingFor, setPlayersLoadingFor] = useState<string | null>(null);
	const [entryRequirement, setEntryRequirement] =
		useState<GiveawayEntryRequirement>("leaderboard_wager");
	const [requiredWagerAmount, setRequiredWagerAmount] = useState<string>("1");

	useEffect(() => {
		fetchGiveaways();
	}, [fetchGiveaways]);

	const filteredGiveaways = giveaways.filter((giveaway) => {
		const matchesSearch = giveaway.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesStatus = filter === "all" || giveaway.status === filter;
		return matchesSearch && matchesStatus;
	});

	const handleEnter = async (id: string) => {
		if (!user) {
			toast({
				title: "Not Logged In",
				description: "Please log in to enter the giveaway.",
				variant: "destructive",
			});
			return;
		}
		await enterGiveaway(id, toast);
	};

	const handleCreateGiveaway = async () => {
		if (!newTitle || !newEndTime) {
			toast({
				title: "Missing fields",
				description: "Please provide both title and end time.",
				variant: "destructive",
			});
			return;
		}
		const parsedRequiredWager = Number(requiredWagerAmount);
		const effectiveRequiredWager =
			entryRequirement === "leaderboard_wager"
				? Number.isFinite(parsedRequiredWager) && parsedRequiredWager > 0
					? parsedRequiredWager
					: 1
				: 0;

		await createGiveaway(
			newTitle,
			newEndTime,
			entryRequirement,
			effectiveRequiredWager,
			toast
		);
		setNewTitle("");
		setNewEndTime("");
		setEntryRequirement("leaderboard_wager");
		setRequiredWagerAmount("1");
	};

	const handleDrawWinner = async (id: string) => {
		await drawWinner(id, toast);

		if (!playersByGiveaway[id]) {
			setPlayersLoadingFor(id);
			try {
				const players = await fetchGiveawayPlayers(id);
				setPlayersByGiveaway((prev) => ({ ...prev, [id]: players }));
			} catch {
				// Keep draw UX smooth even if players details fetch fails.
			} finally {
				setPlayersLoadingFor(null);
			}
		}
	};


	const handleSeePlayers = async (id: string) => {
		setOpenPlayersFor(id);
		if (playersByGiveaway[id]) return;

		setPlayersLoadingFor(id);
		try {
			const players = await fetchGiveawayPlayers(id);
			setPlayersByGiveaway((prev) => ({ ...prev, [id]: players }));
		} catch (error: unknown) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to fetch players list.",
				variant: "destructive",
			});
		} finally {
			setPlayersLoadingFor(null);
		}
	};

	const selectedGiveaway = giveaways.find((g) => g._id === openPlayersFor);
	const selectedPlayers = openPlayersFor
		? playersByGiveaway[openPlayersFor] || []
		: [];

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
				<div className='flex items-center gap-2 mb-8'>
					<Gift className='w-6 h-6 text-[#ffffff]' />
					<h1 className='text-3xl font-bold'>Giveaways</h1>
				</div>

				<div className='p-6 mb-8 rounded-lg bg-[#000000] border border-[#F1A82F]'>
					<p className='mb-6 text-[#ffffff]'>
						Join King&apos;s exciting giveaways for a chance to win real
						prizes! New opportunities every week.
					</p>

					{user?.role === "admin" && (
						<div className='mb-6'>
							<h2 className='mb-2 font-semibold text-[#ffffff]'>
								Create New Giveaway
							</h2>
							<Input
								placeholder='Title'
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								className='mb-2 bg-[#ffffff] border border-[#F1A82F] text-black placeholder:text-[#EA6D0C]'
							/>
							<Input
								type='datetime-local'
								value={newEndTime}
								onChange={(e) => setNewEndTime(e.target.value)}
								className='mb-2 bg-[#ffffff] border border-[#F1A82F] text-black placeholder:text-[#EA6D0C]'
							/>
							<select
								value={entryRequirement}
								onChange={(e) =>
									setEntryRequirement(e.target.value as GiveawayEntryRequirement)
								}
								className='mb-2 h-10 w-full rounded-md border border-[#F1A82F] bg-[#ffffff] px-3 text-black'
							>
								<option value='leaderboard_wager'>
									Require current Roobet leaderboard wager
								</option>
								<option value='no_wager_requirement'>
									No wager requirement
								</option>
							</select>
							{entryRequirement === "leaderboard_wager" && (
								<Input
									type='number'
									min='0'
									step='0.01'
									value={requiredWagerAmount}
									onChange={(e) => setRequiredWagerAmount(e.target.value)}
									placeholder='Required wager amount'
									className='mb-2 bg-[#ffffff] border border-[#F1A82F] text-black placeholder:text-[#EA6D0C]'
								/>
							)}
							<Button
								onClick={handleCreateGiveaway}
								className='bg-[#ffffff] hover:bg-[#F1A82F] text-black'
							>
								Create Giveaway
							</Button>
						</div>
					)}

					<div className='flex flex-col gap-4 md:flex-row'>
						<div className='relative flex-1'>
							<Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-[#000000]' />
							<Input
								placeholder='Search giveaways...'
								className='pl-9 bg-[#ffffff] border border-[#F1A82F] text-white placeholder:text-[#F1A82F]'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className='flex items-center gap-2'>
							<Filter className='w-4 h-4 text-[#ffffff]' />
							<Tabs
								defaultValue='all'
								onValueChange={(val) =>
									setFilter(val as "all" | "active" | "completed" | "upcoming")
								}
								className=' border border-[#F1A82F] rounded-md'
							>
								<TabsList className='flex space-x-2 bg-black'>
									{["all", "active", "upcoming", "completed"].map((val) => (
										<TabsTrigger
											key={val}
											value={val}
											className='text-[#ffffff] data-[state=active]:bg-[#ffffff] data-[state=active]:text-black'
										>
											{val.charAt(0).toUpperCase() + val.slice(1)}
										</TabsTrigger>
									))}
								</TabsList>
							</Tabs>
						</div>
					</div>
				</div>

				{filteredGiveaways.length > 0 ? (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{filteredGiveaways.map((giveaway) => (
							<div
								key={giveaway._id}
								className='p-4 rounded-lg  border border-[#F1A82F] shadow-sm'
							>
								<GiveawayCard
									id={giveaway._id}
									title={giveaway.title}
									prize='Surprise Prize'
									endTime={new Date(giveaway.endTime).toLocaleString()}
									participants={giveaway.totalParticipants}
									status={giveaway.status}
									isEntered={giveaway.isEntered}
									onEnter={handleEnter}
								/>
								{giveaway.winner && (
									<div className='mt-2 rounded-md border border-[#F1A82F]/40 bg-black/60 p-2 text-xs text-[#f0e8d8]'>
										<p className='text-sm text-[#EA6D0C]'>
											🎉 Winner: <strong>{giveaway.winner.kickUsername || "-"}</strong>
										</p>
									</div>
								)}
								<p className='mt-1 text-xs text-[#f0e8d8]'>
									Requirement:{" "}
									{giveaway.entryRequirement === "no_wager_requirement"
										? "No wager required"
										: `Current Roobet leaderboard wager required (min ${
												giveaway.requiredWagerAmount ?? 1
										  })`}
								</p>
								{user?.role === "admin" && giveaway.totalParticipants > 0 && (
										<div className='grid grid-cols-1 gap-2 mt-2'>
										{giveaway.status === "active" && (
											<Button
												onClick={() => handleDrawWinner(giveaway._id)}
												variant='destructive'
												className='w-full bg-[#EA6D0C] hover:bg-[#F1A82F] text-black'
											>
												Draw Winner
											</Button>
										)}
											<Button
												onClick={() => handleSeePlayers(giveaway._id)}
												variant='outline'
												className='w-full border-[#F1A82F] text-[#F1A82F] hover:bg-[#F1A82F]/20'
											>
												See Players
											</Button>
										</div>
									)}
							</div>
						))}
					</div>
				) : (
					<div className='py-12 text-center'>
						<Gift className='w-16 h-16 mx-auto mb-4 text-[#F1A82F]' />
						<h2 className='mb-2 text-2xl font-bold text-[#EA6D0C]'>
							No Giveaways Found
						</h2>
						<p className='text-[#F1A82F]'>
							{searchQuery || filter !== "all"
								? "No giveaways match your filters."
								: "Check back soon for exciting giveaways!"}
						</p>
					</div>
				)}
				</main>

				<Dialog open={Boolean(openPlayersFor)} onOpenChange={(open) => !open && setOpenPlayersFor(null)}>
					<DialogContent className='w-[92vw] max-w-md border border-[#F1A82F] bg-black text-white'>
						<DialogHeader>
							<DialogTitle className='text-[#F1A82F]'>Players Details</DialogTitle>
							<DialogDescription className='text-[#f0e8d8]'>
								{selectedGiveaway
									? `Joined users for ${selectedGiveaway.title}`
									: "Joined users"}
							</DialogDescription>
						</DialogHeader>

						<div className='max-h-[50vh] space-y-2 overflow-y-auto pr-1'>
							{openPlayersFor && playersLoadingFor === openPlayersFor ? (
								<p className='text-sm text-[#f0e8d8]'>Loading players...</p>
							) : selectedPlayers.length === 0 ? (
								<p className='text-sm text-[#f0e8d8]'>No players joined yet.</p>
							) : (
								selectedPlayers.map((player) => (
									<div
										key={player._id}
										className='rounded border border-[#F1A82F]/40 bg-black/60 p-3 text-xs text-[#f0e8d8]'
									>
										<p>
											Kick: <span className='text-white'>{player.kickUsername || "-"}</span>
										</p>
										<p>
											Roobet: <span className='text-white'>{player.rainbetUsername || "-"}</span>
										</p>
										<p>
											Discord: <span className='text-white'>{player.discordUsername || "-"}</span>
										</p>
									</div>
								))
							)}
						</div>

						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => setOpenPlayersFor(null)}
								className='border-[#F1A82F] text-[#F1A82F] hover:bg-[#F1A82F]/20'
							>
								Close
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<Footer />
			</div>
		</div>
	);
}

export default GiveawaysPage;
