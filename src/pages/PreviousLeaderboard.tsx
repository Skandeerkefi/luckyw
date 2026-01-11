import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentMonthlyPeriod } from "@/store/RoobetStore";

export const PreviousLeaderboard = () => {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prizes = [500, 300, 150]; // Top 3 prizes
  const medals = ["🥇", "🥈", "🥉"]; // Medals

  useEffect(() => {
    (async () => {
      try {
        // Current monthly period (9 → 9)
        const { start: currentStart } = getCurrentMonthlyPeriod();

        // Previous monthly period
        const prevEnd = new Date(currentStart);
        prevEnd.setUTCDate(prevEnd.getUTCDate() - 1); // Day before current starts

        const prevStart = new Date(prevEnd);
        prevStart.setUTCMonth(prevStart.getUTCMonth() - 1);

        const format = (d: Date) => d.toISOString().split("T")[0];
        const url = `https://luckywdata-production.up.railway.app/api/leaderboard/${format(prevStart)}/${format(prevEnd)}`;

        const res = await axios.get(url, { timeout: 8000 });
        if (!res.data || !res.data.data) throw new Error("Invalid API response");

        setData(res.data.data.slice(0, 3)); // Top 3 only
      } catch (err) {
        console.error(err);
        setError("Failed to fetch previous leaderboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center text-white/70">Loading...</p>;
  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (!data || data.length === 0)
    return <p className="text-center text-white/60">No previous leaderboard data available.</p>;

  // Recalculate period for display
  const { start: currentStart } = getCurrentMonthlyPeriod();

  const prevEnd = new Date(currentStart);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);

  const prevStart = new Date(prevEnd);
  prevStart.setUTCMonth(prevStart.getUTCMonth() - 1);

  const format = (d: Date) => d.toISOString().split("T")[0];

  // Podium order: [2nd, 1st, 3rd]
  const podiumOrder = data.length === 3 ? [data[1], data[0], data[2]] : data;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Period Display */}
      <p className="mb-6 text-center text-white/50">
        Period:{" "}
        <span className="text-[#F1A82F]">{format(prevStart)}</span> →{" "}
        <span className="text-[#F1A82F]">{format(prevEnd)}</span>
      </p>

      {/* Top 3 Cards */}
      <div className="grid items-end grid-cols-3 gap-6">
        {podiumOrder.map((player, idx) => {
          const isTop1 = player.uid === data[0].uid;
          const medalIdx = data.indexOf(player);

          return (
            <div
              key={player.uid}
              className={`bg-black/50 backdrop-blur-xl border border-[#F1A82F]/30 rounded-2xl p-6 flex flex-col items-center shadow-lg transition-transform duration-300 ${
                isTop1 ? "scale-110" : "scale-100"
              }`}
            >
              {/* Medal */}
              <div className="mb-2 text-4xl">{medals[medalIdx]}</div>

              <div className="text-2xl md:text-3xl font-bold text-[#F1A82F] mb-2">
                {player.username}
              </div>

              <div className="mb-4 text-white/80">
                {(Math.floor(player.weightedWagered * 100) / 100).toLocaleString()} Wagered
              </div>

              <div className="text-xl font-bold text-white/90 bg-[#F1A82F]/20 px-4 py-2 rounded-full">
                Prize: ${prizes[medalIdx]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
