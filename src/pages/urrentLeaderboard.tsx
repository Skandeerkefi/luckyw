import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface Player {
  uid: string;
  username: string;
  wagered: number;
  weightedWagered: number;
  favoriteGameId: string;
  favoriteGameTitle: string;
  rankLevel: number;
}

interface LeaderboardData {
  disclosure: string;
  data: Player[];
}

function maskUsername(username: string): string {
  if (!username || username.length <= 2) return "***";
  const first = username.charAt(0);
  const last = username.charAt(username.length - 1);
  const asterisks = "*".repeat(Math.max(1, username.length - 2));
  return first + asterisks + last;
}

function toDateOnlyUtc(d: Date) {
  return d.toISOString().split("T")[0];
}

function getCurrentMonthlyPeriod() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  const start =
    day >= 10
      ? new Date(Date.UTC(year, month, 10, 0, 0, 0, 0))
      : new Date(Date.UTC(year, month - 1, 10, 0, 0, 0, 0));

  const endExclusive = new Date(start);
  endExclusive.setUTCMonth(endExclusive.getUTCMonth() + 1);

  return {
    start: toDateOnlyUtc(start),
    end: toDateOnlyUtc(endExclusive),
  };
}

export const CurrentLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch using local state
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { start, end } = getCurrentMonthlyPeriod();
        const response = await axios.get(
          `https://luckywdata-production.up.railway.app/api/leaderboard/${start}/${end}`
        );
        setLeaderboard(response.data);
      } catch (err: unknown) {
        let errorMessage = "Failed to fetch leaderboard";
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.error || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const period = useMemo(() => getCurrentMonthlyPeriod(), []);

  // Monthly prizes
  const prizes = [800, 550, 325];
  const medals = ["🥇", "🥈", "🥉"];

  if (loading)
    return (
      <p className="text-lg text-center text-white/70">
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
      <p className="mb-8 text-lg text-center text-white/50">
        Period:{" "}
        <span className="text-[#F1A82F]">{period.start}</span> →{" "}
        <span className="text-[#F1A82F]">{period.end}</span>
      </p>

      {/* Podium */}
      <div className="grid items-end grid-cols-3 gap-8 mb-8">
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
                {maskUsername(player.username)}
              </div>

              {/* Wagered */}
              <div className="mb-4 text-white/80">
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
      <div className="mt-6 text-center">
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
