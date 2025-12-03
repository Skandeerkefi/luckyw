import React, { useEffect, useState } from "react";
import { Trophy, Crown, Medal, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRoobetStore } from "../store/RoobetStore";
import GraphicalBackground from "@/components/GraphicalBackground";

const LeaderboardPage: React.FC = () => {
	const { leaderboard, loading, error, fetchLeaderboard } = useRoobetStore();

	useEffect(() => {
		fetchLeaderboard();
	}, []);
	// Timer state + logic
	const [timeLeft, setTimeLeft] = useState("");

	useEffect(() => {
		const updateTimer = () => {
			const now = new Date();
			const year = now.getFullYear();
			const month = now.getMonth();
			const endOfMonth = new Date(year, month + 1, 1, 0, 0, 0); // next month start
			const diff = endOfMonth.getTime() - now.getTime();

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			setTimeLeft(
				`${days}d ${hours.toString().padStart(2, "0")}h ${minutes
					.toString()
					.padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
			);
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, []);

	const top3 = leaderboard?.data?.slice(0, 3) || [];
	// Podium order: top2, top1, top3
	const podiumOrder = [top3[1], top3[0], top3[2]];

	const socialLinks = [
		{ name: "Roobet", url: "https://roobet.com/?ref=LouisKHz" },
		{ name: "Kick", url: "https://kick.com/louiskhz" },
		{ name: "YouTube", url: "https://www.youtube.com/@LouisKHz" },
		{ name: "Instagram", url: "https://www.instagram.com/louiskhz" },
		{ name: "Discord", url: "https://discord.com/invite/N48G6cZVwc" },
	];

	const iconMap = [Crown, Trophy, Medal];
	const colorMap = ["text-yellow-400", "text-gray-300", "text-orange-400"];
	const prizeMap = ["100$", "50$", "25$"];

	return (
		<div className='relative min-h-screen text-[#fffefe] p-6 md:p-10 flex flex-col items-center overflow-hidden'>
			{/* 🌌 Animated Background */}
			<GraphicalBackground />

			{/* 🏆 HERO SECTION */}
			<section className='relative z-10 max-w-4xl space-y-6 text-center'>
				<h1 className='text-5xl md:text-6xl font-extrabold text-[#efae0e]'>
					LouisKHz
				</h1>
			</section>

			{/* Divider */}
			<div className='w-24 h-[3px] bg-[#efae0e] my-12 rounded-full relative z-10'></div>

			{/* 🥇 LEADERBOARD SECTION */}
			<section className='relative z-10 w-full max-w-5xl space-y-10'>
				{/* Leaderboard Title */}
				<div className='space-y-2 text-center'>
					<h2 className='text-4xl font-bold text-[#efae0e]'>
						LouisKHz Leaderboard Roobet
					</h2>
					<p className='text-[#fffefe]/70 text-base'>
						Track your ranking and see the current top players!
					</p>
				</div>

				<Card className='relative overflow-hidden bg-[#181839]/90 border border-[#efae0e]/40 shadow-lg'>
					{/* Transparent Road Background */}
					<div
						className='absolute inset-0 bg-center bg-cover opacity-10'
						style={{
							backgroundImage:
								"url('https://i.ibb.co/5XF5zJgS/Capture-d-cran-2025-10-08-141143.png')",
						}}
					></div>

					{/* Chickens (fully visible, not transparent) */}
					<img
						src='https://i.ibb.co/CX3znrf/Capture-d-cran-2025-10-08-141941-removebg-preview.png'
						alt='chicken'
						className='absolute w-16 top-2 left-4 drop-shadow-lg animate-bounce'
					/>
					<img
						src='https://i.ibb.co/pBVS3cpp/Capture-d-cran-2025-10-08-141937-removebg-preview.png'
						alt='chicken'
						className='absolute w-16 delay-150 top-2 right-4 drop-shadow-lg animate-bounce'
					/>

					{/* Foreground Content */}
					<div className='relative z-10'>
						<CardHeader className='text-center'>
							<div className='w-24 h-24 mx-auto bg-[#efae0e]/20 rounded-full flex items-center justify-center mb-4'>
								<Crown className='w-12 h-12 text-[#efae0e]' />
							</div>
							<CardTitle className='text-3xl font-bold text-[#efae0e]'>
								JOIN US
							</CardTitle>
						</CardHeader>

						<CardContent>
							<div className='flex flex-wrap justify-center gap-3'>
								{socialLinks.map((link) => (
									<Button
										key={link.name}
										variant='outline'
										size='lg'
										className='border-[#efae0e]/40 text-[#fffefe] hover:text-[#efae0e] transition-colors font-semibold'
										asChild
									>
										<a
											href={link.url}
											target='_blank'
											rel='noopener noreferrer'
										>
											{link.name}
										</a>
									</Button>
								))}
							</div>
						</CardContent>
					</div>
				</Card>

				{/* Rules */}
				<Card className='bg-[#181839]/90 border border-[#efae0e]/30 shadow-md'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2 text-[#efae0e]'>
							<Info className='w-6 h-6' />
							Leaderboard Rules
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4 text-[#fffefe]/80'>
						<p className='text-[#fffefe] font-medium'>
							Your wagers on Roobet count towards the leaderboard based on game
							RTP (Return to Player):
						</p>
						<div className='space-y-3'>
							<div className='flex items-center gap-3 p-3 bg-[#efae0e]/10 rounded-lg'>
								<div className='w-3 h-3 bg-green-400 rounded-full' />
								<span>
									<strong>Games with RTP ≤ 97%</strong> →{" "}
									<strong className='text-[#efae0e]'>100%</strong> of wager
								</span>
							</div>
							<div className='flex items-center gap-3 p-3 bg-[#efae0e]/10 rounded-lg'>
								<div className='w-3 h-3 bg-yellow-400 rounded-full' />
								<span>
									<strong>Games with RTP &gt; 97%</strong> →{" "}
									<strong className='text-[#efae0e]'>50%</strong> of wager
								</span>
							</div>
							<div className='flex items-center gap-3 p-3 bg-[#efae0e]/10 rounded-lg'>
								<div className='w-3 h-3 bg-orange-400 rounded-full' />
								<span>
									<strong>Games with RTP ≥ 98%</strong> →{" "}
									<strong className='text-[#efae0e]'>10%</strong> of wager
								</span>
							</div>
						</div>
						<p className='text-sm bg-[#efae0e]/10 p-3 rounded-lg border-l-4 border-[#efae0e]'>
							<strong>Note:</strong> Only Slots and House games count (Dice is
							excluded)
						</p>
					</CardContent>
				</Card>

				{/* Top 3 Players Podium */}
				<div className='space-y-6'>
					<h3 className='text-2xl font-bold text-center text-[#efae0e]'>
						Current Top 3 Players
					</h3>
					<div className='mt-2 text-center'>
						<p className='text-[#fffefe]/60 text-sm italic'>
							Showing leaderboard for{" "}
							{new Date().toLocaleString("default", {
								month: "long",
								year: "numeric",
							})}
						</p>
						<p className='text-[#efae0e] text-sm font-semibold mt-1'>
							⏳ Resets in: {timeLeft}
						</p>
					</div>

					{loading && <p className='text-center'>Loading leaderboard...</p>}
					{error && <p className='text-center text-red-400'>{error}</p>}

					<div className='grid items-end gap-6 md:grid-cols-3'>
						{podiumOrder.map((player, index) => {
							if (!player) return null;
							const originalIndex = top3.indexOf(player);
							const IconComponent = iconMap[originalIndex] || Trophy;
							const color = colorMap[originalIndex] || "text-[#efae0e]";
							const prize = prizeMap[originalIndex] || "$500";

							return (
								<Card
									key={player.uid}
									className={`bg-[#181839]/90 border border-[#efae0e]/30 text-center transition-transform hover:scale-105 ${
										originalIndex === 0
											? "shadow-lg border-[#efae0e]/60 md:scale-110"
											: "md:mt-6"
									}`}
								>
									<CardHeader className='pb-3'>
										<div className='relative'>
											<div
												className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
													originalIndex === 0
														? "bg-gradient-to-tr from-[#efae0e] to-[#fffefe]"
														: "bg-[#efae0e]/20"
												}`}
											>
												<IconComponent className={`w-8 h-8 ${color}`} />
											</div>
											<Badge
												variant='secondary'
												className='absolute -top-2 -right-2 text-xs font-bold bg-[#efae0e]/20 text-[#efae0e]'
											>
												#{originalIndex + 1}
											</Badge>
										</div>
										<CardTitle className='text-xl text-[#fffefe]'>
											{player.username}
										</CardTitle>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div className='space-y-2'>
											<div className='space-y-2'>
												<div className='text-sm text-[#fffefe]/70'>
													Total Wagered
												</div>
												<div className='text-2xl font-bold text-[#fffefe]'>
													{player.wagered.toLocaleString()}$
												</div>

												<div className='text-sm text-[#fffefe]/70 pt-2 border-t border-[#efae0e]/20'>
													Weighted Wagered
												</div>
												<div className='text-xl font-semibold text-[#efae0e]'>
													{player.weightedWagered.toLocaleString()}$
												</div>
											</div>
										</div>
										<div className='pt-4 border-t border-[#efae0e]/30'>
											<div className='text-sm text-[#fffefe]/70 mb-1'>
												Prize Pool
											</div>
											<div
												className={`text-xl font-bold ${
													originalIndex === 0
														? "text-[#efae0e]"
														: "text-[#fffefe]"
												}`}
											>
												{prize}
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<br />

			{/* CTA */}
			<div className='relative z-10 space-y-4 text-center'>
				<a
					href='https://roobet.com/?ref=LouisKHz'
					target='_blank'
					rel='noopener noreferrer'
				>
					<Button
						size='lg'
						className='bg-[#efae0e] hover:bg-[#fffefe] text-[#181839] text-lg px-8 py-6 font-bold shadow-lg hover:shadow-xl transition-shadow'
					>
						Start Playing on Roobet
					</Button>
				</a>
				<p className='text-sm text-[#fffefe]/70'>
					Place your wagers and climb the leaderboard for amazing prizes!
				</p>
			</div>
		</div>
	);
};

export default LeaderboardPage;
