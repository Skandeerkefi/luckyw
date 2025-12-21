import { useEffect, useMemo } from "react";
import { useRoobetStore, getCurrentMonthlyPeriod } from "@/store/RoobetStore";

export const CurrentLeaderboard = () => {
  const { leaderboard, loading, error, fetchLeaderboard } = useRoobetStore();

  // Fetch once (safe for strict mode)
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const period = useMemo(() => getCurrentMonthlyPeriod(), []);

  // Monthly prizes
  const prizes = [500, 300, 150];
  const medals = ["🥇", "🥈", "🥉"];

  if (loading)
    return (
      <p className="text-center text-white/70 text-lg">
        Loading leaderboard…
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-400">
        {error}
      </p>
    );

  if (!leaderboard?.data?.length)
    return (
      <p className="text-center text-white/60">
        No leaderboard data available.
      </p>
    );

  // Always work with top 3 safely
  const topPlayers = leaderboard.data.slice(0, 3);

  // Podium visual order: 🥈 🥇 🥉
  const podiumOrder =
    topPlayers.length === 3
      ? [topPlayers[1], topPlayers[0], topPlayers[2]]
      : topPlayers;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Period */}
      <p className="text-white/50 text-center mb-8 text-lg">
        Period:{" "}
        <span className="text-[#F1A82F]">{period.start}</span> →{" "}
        <span className="text-[#F1A82F]">{period.end}</span>
      </p>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-8 items-end mb-8">
        {podiumOrder.map((player) => {
          // Determine real rank (0 = 🥇)
          const rankIndex = topPlayers.findIndex(p => p.uid === player.uid);
          const isTop1 = rankIndex === 0;

          return (
            <div
              key={player.uid}
              className={`relative bg-gradient-to-br from-[#1F0A0A] to-[#3A1F0F]
              border border-[#F1A82F]/40 rounded-3xl p-6 flex flex-col items-center
              shadow-[0_0_25px_rgba(241,168,47,0.4)]
              transition-transform duration-300 hover:scale-105
              hover:shadow-[0_0_35px_rgba(241,168,47,0.7)]
              ${isTop1 ? "scale-110" : ""}`}
            >
              {/* Medal */}
              <div
                className={`text-5xl mb-3 ${
                  isTop1
                    ? "text-yellow-400 drop-shadow-[0_0_25px_rgba(255,223,0,0.8)] animate-pulse"
                    : "text-white/80"
                }`}
              >
                {medals[rankIndex] ?? ""}
              </div>

              {/* Username */}
              <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text
                bg-gradient-to-r from-[#F1A82F] to-[#FFD700] mb-2
                drop-shadow-[0_0_10px_rgba(241,168,47,0.6)]">
                {player.username}
              </div>

              {/* Wagered */}
              <div className="text-white/80 mb-4">
                {Number(player.weightedWagered).toLocaleString()} Wagered
              </div>

              {/* Prize */}
              {prizes[rankIndex] && (
                <div className="text-lg font-bold text-black bg-gradient-to-r
                  from-[#F1A82F] to-[#FFD700] px-4 py-2 rounded-full
                  shadow-[0_0_15px_rgba(241,168,47,0.7)]">
                  Prize: ${prizes[rankIndex]}
                </div>
              )}

              {/* Glow for 1st */}
              {isTop1 && (
                <div className="absolute inset-0 rounded-3xl bg-yellow-400/10 blur-2xl animate-pulse -z-10" />
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center mt-6">
        <button
          onClick={() => (window.location.href = "/Leaderboard")}
          className="relative px-8 py-3 rounded-xl font-bold text-black
          bg-gradient-to-r from-[#F1A82F] to-[#FFD700]
          shadow-[0_0_15px_rgba(241,168,47,0.7)]
          hover:shadow-[0_0_25px_rgba(241,168,47,1)]
          transition-all duration-300"
        >
          <span className="relative z-10">See Full Leaderboard</span>
          <span className="absolute inset-0 rounded-xl bg-yellow-400/20 blur-xl animate-pulse -z-10" />
        </button>
      </div>
    </div>
  );
};
