import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentBiweekly } from "@/store/RoobetStore";

export const PreviousLeaderboard = () => {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prizes = [300, 150, 75]; // Top 3 prizes
  const medals = ["🥇", "🥈", "🥉"]; // Medals

  useEffect(() => {
    (async () => {
      try {
        const { start: currentStart } = getCurrentBiweekly();

        // Previous period: 14 days before currentStart
        const prevEnd = new Date(currentStart);
        prevEnd.setDate(prevEnd.getDate() - 1); // End day = day before current period starts

        const prevStart = new Date(prevEnd);
        prevStart.setDate(prevEnd.getDate() - 13); // 14-day period including prevEnd

        const format = (d: Date) => d.toISOString().split("T")[0];
        const url = `https://luckywdata-production.up.railway.app/api/leaderboard/${format(prevStart)}/${format(prevEnd)}`;

        const res = await axios.get(url, { timeout: 8000 });

        if (!res.data || !res.data.data) throw new Error("Invalid API response");

        setData(res.data.data.slice(0, 3)); // Only top 3
      } catch (err: any) {
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

  const { start: currentStart } = getCurrentBiweekly();
  const prevEnd = new Date(currentStart);
  prevEnd.setDate(prevEnd.getDate() - 1);

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevEnd.getDate() - 13);

  const format = (d: Date) => d.toISOString().split("T")[0];

  // Podium order: [2nd, 1st, 3rd]
  const podiumOrder = data.length === 3 ? [data[1], data[0], data[2]] : data;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Period Display */}
      <p className="text-white/50 text-center mb-6">
        Period: <span className="text-[#F1A82F]">{format(prevStart)}</span> →{" "}
        <span className="text-[#F1A82F]">{format(prevEnd)}</span>
      </p>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-3 gap-6 items-end">
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
              <div className="text-4xl mb-2">{medals[medalIdx]}</div>

              <div className="text-2xl md:text-3xl font-bold text-[#F1A82F] mb-2">{player.username}</div>
              <div className="text-white/80 mb-4">{(Math.floor(player.weightedWagered * 100) / 100).toLocaleString()}Wagered</div>
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
