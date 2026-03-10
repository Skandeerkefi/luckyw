import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTournamentStore } from "@/store/useTournamentStore";
import type { TournamentFormat } from "@/store/useTournamentStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, History, PlusCircle } from "lucide-react";

const getErrorMessage = (err: unknown) =>
	err instanceof Error ? err.message : "Something went wrong";

function TournamentsPage() {
	const { tournaments, fetchTournaments, createTournament, deleteTournament, isLoading } =
		useTournamentStore();
	const { user } = useAuthStore();
	const { toast } = useToast();

	const [search, setSearch] = useState("");
	const [createOpen, setCreateOpen] = useState(false);
	const [form, setForm] = useState({
		name: "",
		format: "1v1" as TournamentFormat,
		prizeAmount: 100,
		maxPlayers: 8,
		teamCount: 3,
		startDate: "",
	});

	useEffect(() => {
		fetchTournaments().catch((err) => {
			toast({ title: "Error", description: err.message, variant: "destructive" });
		});
	}, [fetchTournaments, toast]);

	const filtered = useMemo(() => {
		return tournaments.filter((t) =>
			t.name.toLowerCase().includes(search.toLowerCase())
		);
	}, [tournaments, search]);

	const onCreateTournament = async () => {
		try {
			if (!form.name.trim()) {
				toast({
					title: "Missing fields",
					description: "Tournament name is required.",
					variant: "destructive",
				});
				return;
			}

			const defaultStartDate = new Date(Date.now() + 5 * 60 * 1000).toISOString();
			const startDateToSend = form.startDate
				? new Date(form.startDate).toISOString()
				: defaultStartDate;

			await createTournament({
				...form,
				name: form.name.trim(),
				slotGameName:
					form.format === "3v3"
						? `${form.name.trim()} 3v3 Team Slots`
						: `${form.name.trim()} Slots`,
				startDate: startDateToSend,
				prizeAmount: Number(form.prizeAmount),
				maxPlayers: form.format === "3v3" ? form.teamCount * 3 : form.maxPlayers,
				teamCount: form.format === "3v3" ? form.teamCount : undefined,
			});
			toast({ title: "Tournament created" });
			setCreateOpen(false);
			setForm({
				name: "",
				format: "1v1",
				prizeAmount: 100,
				maxPlayers: 8,
				teamCount: 3,
				startDate: "",
			});
		} catch (err: unknown) {
			toast({ title: "Create failed", description: getErrorMessage(err), variant: "destructive" });
		}
	};

	const onDelete = async (id: string) => {
		try {
			await deleteTournament(id);
			toast({ title: "Tournament deleted" });
		} catch (err: unknown) {
			toast({ title: "Delete failed", description: getErrorMessage(err), variant: "destructive" });
		}
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
			<div className='relative z-10 flex flex-col min-h-screen'>
				<Navbar />

				<main className='container flex-grow max-w-6xl px-4 py-8 mx-auto'>
				<div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
					<div className='flex items-center gap-2'>
						<Trophy className='w-6 h-6 text-[#ffffff]' />
						<h1 className='text-3xl font-bold'>Slot Tournaments</h1>
					</div>
					<div className='flex gap-2'>
						<Link to='/tournaments/history'>
							<Button className='bg-[#ffffff] text-black hover:bg-[#F1A82F]'>
								<History className='w-4 h-4 mr-2' />
								History
							</Button>
						</Link>
						{user?.role === "admin" && (
							<Button
								onClick={() => setCreateOpen((prev) => !prev)}
								className='bg-[#ffffff] text-black hover:bg-[#F1A82F]'
							>
								<PlusCircle className='w-4 h-4 mr-2' />
								{createOpen ? "Close" : "Create"}
							</Button>
						)}
					</div>
				</div>

				<Card className='mb-5 border border-[#F1A82F] bg-[#000000]/70'>
					<CardContent className='pt-6'>
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Search tournaments...'
							className='bg-[#ffffff] text-black placeholder:text-black border-[#F1A82F]'
						/>
					</CardContent>
				</Card>

				{createOpen && user?.role === "admin" && (
					<Card className='mb-6 border border-[#F1A82F] bg-[#000000]/70'>
						<CardHeader>
							<CardTitle>Create Tournament</CardTitle>
						</CardHeader>
						<CardContent className='grid grid-cols-1 gap-3 md:grid-cols-2'>
							<Input
								placeholder='Tournament name'
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								className='bg-[#ffffff] text-black placeholder:text-black border-[#F1A82F]'
							/>
							<select
								value={form.format}
								onChange={(e) =>
									setForm({
										...form,
										format: e.target.value as TournamentFormat,
										maxPlayers: e.target.value === "3v3" ? form.teamCount * 3 : 8,
									})
								}
								className='h-9 rounded-md border border-[#F1A82F] bg-[#ffffff] px-3 text-black md:col-span-1'
							>
								<option value='1v1'>1v1 Tournament</option>
								<option value='3v3'>3v3 Team Slot Tournament</option>
							</select>
							<Input
								type='number'
								placeholder='Prize Amount'
								value={form.prizeAmount}
								onChange={(e) =>
									setForm({ ...form, prizeAmount: Number(e.target.value) })
								}
								className='bg-[#ffffff] text-black placeholder:text-black border-[#F1A82F]'
							/>
							{form.format === "1v1" ? (
								<select
									value={form.maxPlayers}
									onChange={(e) =>
										setForm({
											...form,
											maxPlayers: Number(e.target.value),
										})
									}
									className='h-9 rounded-md border border-[#F1A82F] bg-[#ffffff] px-3 text-black md:col-span-1'
								>
									<option value={8}>8 Players</option>
									<option value={16}>16 Players</option>
								</select>
							) : (
								<div className='grid grid-cols-2 gap-2 md:col-span-1'>
									<Input
										type='number'
										min={2}
										max={12}
										placeholder='Teams'
										value={form.teamCount}
										onChange={(e) => {
											const teams = Math.max(2, Math.min(12, Number(e.target.value) || 2));
											setForm({ ...form, teamCount: teams, maxPlayers: teams * 3 });
										}}
										className='bg-[#ffffff] text-black placeholder:text-black border-[#F1A82F]'
									/>
									<div className='flex h-9 items-center rounded-md border border-[#F1A82F] bg-[#ffffff] px-3 text-black'>
										{form.maxPlayers} Players ({form.teamCount} teams x 3)
									</div>
								</div>
							)}
							<Input
								type='datetime-local'
								value={form.startDate}
								onChange={(e) => setForm({ ...form, startDate: e.target.value })}
								className='bg-[#ffffff] text-black placeholder:text-black border-[#F1A82F] md:col-span-2'
							/>
							<Button
								onClick={onCreateTournament}
								className='bg-[#ffffff] text-black hover:bg-[#F1A82F] md:col-span-2'
							>
								Create Tournament
							</Button>
						</CardContent>
					</Card>
				)}

				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					{filtered.map((t) => (
						<Card key={t._id} className='border border-[#F1A82F] bg-[#000000]/70'>
							<CardHeader>
								<CardTitle className='text-xl'>{t.name}</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2 text-sm text-[#f0e8d8]'>
								<p>Status: <span className='font-semibold'>{t.status}</span></p>
								<p>Format: {t.format === "3v3" ? "3v3 Team Slot" : "1v1 Bracket"}</p>
								<p>Players: {t.joinedPlayers || 0}/{t.maxPlayers}</p>
								<p>Prize: ${t.prizeAmount}</p>
								{t.winningTeamName && <p>Winning Team: {t.winningTeamName}</p>}
								<p>Starts: {new Date(t.startDate).toLocaleString()}</p>
								<div className='flex gap-2 pt-2'>
									<Link to={`/tournaments/${t._id}`}>
										<Button className='bg-[#ffffff] text-black hover:bg-[#F1A82F]'>
											Open
										</Button>
									</Link>
									{user?.role === "admin" && t.status !== "finished" && (
										<Button variant='destructive' onClick={() => onDelete(t._id)}>
											Delete
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{!isLoading && filtered.length === 0 && (
					<div className='py-16 text-center text-[#f0e8d8]'>
						No tournaments found.
					</div>
				)}
				</main>

				<Footer />
			</div>
		</div>
	);
}

export default TournamentsPage;
