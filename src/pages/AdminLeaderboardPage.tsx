import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Crown, Save } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoobetStore } from "@/store/RoobetStore";
import { formatMoney, getTotalPrize } from "@/lib/roobetLeaderboard";
import { buildApiUrl } from "@/lib/api";

type PrizeRow = {
	rank: number;
	amount: string;
};

const emptyPrizeRows = (): PrizeRow[] =>
	Array.from({ length: 10 }, (_, index) => ({ rank: index + 1, amount: "0" }));

const AdminLeaderboardPage = () => {
	const { user, token } = useAuthStore();
	const { leaderboardConfig, fetchLeaderboardConfig } = useRoobetStore();
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [previousStartDate, setPreviousStartDate] = useState("");
	const [previousEndDate, setPreviousEndDate] = useState("");
	const [archiveCurrent, setArchiveCurrent] = useState(true);
	const [prizeRows, setPrizeRows] = useState<PrizeRow[]>(emptyPrizeRows());
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!leaderboardConfig) {
			fetchLeaderboardConfig();
		}
	}, [fetchLeaderboardConfig, leaderboardConfig]);

	useEffect(() => {
		const current = leaderboardConfig?.current;
		if (!current) {
			return;
		}

		setStartDate(current.startDate);
		setEndDate(current.endDate);
		setPreviousStartDate(leaderboardConfig.previous?.startDate ?? "");
		setPreviousEndDate(leaderboardConfig.previous?.endDate ?? "");
		setPrizeRows(
			current.prizeSplit.length > 0
				? current.prizeSplit.map((entry, index) => ({
					rank: entry.rank || index + 1,
					amount: String(entry.amount ?? 0),
				}))
				: emptyPrizeRows()
		);
	}, [leaderboardConfig]);

	const isAdmin = user?.role === "admin";
	const totalPrize = useMemo(
		() =>
			getTotalPrize(
				prizeRows.map((entry) => ({ rank: entry.rank, amount: Number(entry.amount || 0) }))
			),
		[prizeRows]
	);

	if (!isAdmin) {
		return (
			<div className="relative flex min-h-screen flex-col overflow-hidden text-[#FFFBED]">
				<div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-black/95 to-black" />
				<div className="relative z-10">
					<Navbar />
					<main className="mx-auto flex max-w-4xl flex-grow items-center justify-center px-6 py-20 text-center">
						<Card className="w-full border border-[#F1A82F]/30 bg-[#0F0F0F]/90">
							<CardContent className="space-y-3 py-10">
								<Crown className="mx-auto h-12 w-12 text-[#F1A82F]" />
								<h1 className="text-3xl font-bold text-[#F1A82F]">Admin access required</h1>
								<p className="text-white/70">You need an admin account to manage the Roobet leaderboard.</p>
							</CardContent>
						</Card>
					</main>
				</div>
			</div>
		);
	}

	const updatePrizeAmount = (rank: number, amount: string) => {
		setPrizeRows((rows) => rows.map((row) => (row.rank === rank ? { ...row, amount } : row)));
	};

	const handleSave = async () => {
		if (!token) {
			setError("Missing admin token. Please log in again.");
			return;
		}

		setSaving(true);
		setError(null);
		setMessage(null);

		try {
			await axios.put(
				buildApiUrl("/api/leaderboard/config"),
				{
					archiveCurrent,
					current: {
						startDate,
						endDate,
						prizeSplit: prizeRows.map((entry) => ({
							rank: entry.rank,
							amount: Number(entry.amount || 0),
						})),
					},
					previous: {
						startDate: previousStartDate,
						endDate: previousEndDate,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setMessage(archiveCurrent ? "Leaderboard published and archived." : "Leaderboard config updated.");
			await fetchLeaderboardConfig();
		} catch (saveError) {
			setError(
				axios.isAxiosError(saveError)
					? saveError.response?.data?.error || saveError.message
					: saveError instanceof Error
					? saveError.message
					: "Failed to save leaderboard config"
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden text-[#FFFBED]">
			<div className="fixed inset-0 z-0 bg-center bg-no-repeat bg-contain opacity-35" style={{ backgroundImage: "url('https://i.ibb.co/2YNrPKrD/3dgifmaker96052.gif')", backgroundColor: "#000" }} />
			<div className="fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />

			<div className="relative z-10">
				<Navbar />

				<main className="mx-auto w-full max-w-7xl px-6 py-10">
					<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
						<div>
							<h1 className="text-4xl font-extrabold text-[#F1A82F]">Roobet Leaderboard Admin</h1>
							<p className="mt-2 text-[#F1A82F]/70">Publish the current period, choose the previous period, and edit prize splits.</p>
						</div>
						<Badge className="bg-[#F1A82F]/15 px-4 py-2 text-[#F1A82F]">{formatMoney(totalPrize)} total prize</Badge>
					</div>

					{message ? <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-200">{message}</div> : null}
					{error ? <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">{error}</div> : null}

					<div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
						<Card className="border border-[#F1A82F]/20 bg-[#0F0F0F]/90">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-[#F1A82F]"><Save className="h-5 w-5" /> Active period</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-sm text-white/70">Start date</label>
									<Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="border-[#F1A82F]/30 bg-black/50 text-white" />
								</div>
								<div className="space-y-2">
									<label className="text-sm text-white/70">End date</label>
									<Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="border-[#F1A82F]/30 bg-black/50 text-white" />
								</div>

								<label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-[#F1A82F]/20 bg-[#F1A82F]/5 px-4 py-3 text-sm text-white/80">
									<input type="checkbox" checked={archiveCurrent} onChange={(event) => setArchiveCurrent(event.target.checked)} />
									Archive the current leaderboard into previous when saving this period.
								</label>

								<div className="md:col-span-2 flex flex-wrap gap-3">
									<Button onClick={handleSave} disabled={saving} className="bg-[#F1A82F] text-black hover:bg-[#F9B97C]">
										{saving ? "Saving…" : "Save leaderboard"}
									</Button>
									<Button
										type="button"
										variant="outline"
										className="border-[#F1A82F]/30 text-[#F1A82F] hover:bg-[#F1A82F]/10"
										onClick={() => fetchLeaderboardConfig()}
									>
										Reload current config
									</Button>
								</div>
							</CardContent>
						</Card>

							<Card className="border border-[#F1A82F]/20 bg-[#0F0F0F]/90">
								<CardHeader>
									<CardTitle className="text-[#F1A82F]">Previous period</CardTitle>
								</CardHeader>
								<CardContent className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<label className="text-sm text-white/70">Previous start date</label>
										<Input type="date" value={previousStartDate} onChange={(event) => setPreviousStartDate(event.target.value)} className="border-[#F1A82F]/30 bg-black/50 text-white" />
									</div>
									<div className="space-y-2">
										<label className="text-sm text-white/70">Previous end date</label>
										<Input type="date" value={previousEndDate} onChange={(event) => setPreviousEndDate(event.target.value)} className="border-[#F1A82F]/30 bg-black/50 text-white" />
									</div>
									<div className="md:col-span-2 rounded-xl border border-[#F1A82F]/20 bg-[#F1A82F]/5 px-4 py-3 text-sm text-white/75">
										The previous prize split is preserved unless you save with archive enabled.
									</div>
								</CardContent>
							</Card>

						<Card className="border border-[#F1A82F]/20 bg-[#0F0F0F]/90">
							<CardHeader>
								<CardTitle className="text-[#F1A82F]">Prize preview</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="rounded-xl border border-[#F1A82F]/20 bg-[#F1A82F]/5 p-4 text-sm text-white/80">
									<p className="mb-2 font-semibold text-[#F1A82F]">Current total prize</p>
									<p className="text-3xl font-extrabold text-white">${formatMoney(totalPrize)}</p>
								</div>
								<div className="space-y-2">
									{prizeRows.map((row) => (
										<div key={row.rank} className="flex items-center gap-3">
											<div className="w-12 text-sm font-semibold text-[#F1A82F]">#{row.rank}</div>
											<Input
												type="number"
												min="0"
												step="1"
												value={row.amount}
												onChange={(event) => updatePrizeAmount(row.rank, event.target.value)}
												className="border-[#F1A82F]/30 bg-black/50 text-white"
											/>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="mt-6 grid gap-6 lg:grid-cols-2">
						<Card className="border border-[#F1A82F]/20 bg-[#0F0F0F]/90">
							<CardHeader>
								<CardTitle className="text-[#F1A82F]">Current snapshot</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm text-white/75">
								<p>{leaderboardConfig?.current ? `${leaderboardConfig.current.startDate} → ${leaderboardConfig.current.endDate}` : "No current config loaded yet."}</p>
								<p>Top prize: ${formatMoney(Number(prizeRows[0]?.amount || 0))}</p>
							</CardContent>
						</Card>

						<Card className="border border-[#F1A82F]/20 bg-[#0F0F0F]/90">
							<CardHeader>
								<CardTitle className="text-[#F1A82F]">Previous snapshot</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm text-white/75">
								<p>{leaderboardConfig?.previous ? `${leaderboardConfig.previous.startDate} → ${leaderboardConfig.previous.endDate}` : "Previous leaderboard will appear after saving."}</p>
								<p>This is the date range used for the previous leaderboard page.</p>
							</CardContent>
						</Card>
					</div>
				</main>

				<Footer />
			</div>
		</div>
	);
};

export default AdminLeaderboardPage;