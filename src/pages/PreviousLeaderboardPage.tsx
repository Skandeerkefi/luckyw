import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { getCurrentBiweekly } from "@/store/RoobetStore";
import { getCurrentMonthlyPeriod } from "@/store/RoobetStore";
// Prize mapping by rank
const prizeByRank: Record<number, string> = {
  1: "$500",
  2: "$300",
  3: "$150",
  4: "$100",
  5: "$75",
  6: "$25",
  7: "$25",
  8: "$25",
  9: "$25",
  10: "$25",
};


// Format previous biweekly range
function formatPreviousMonthlyRange() {
  const { start } = getCurrentMonthlyPeriod();

  const currentStart = new Date(start);
  const prevEnd = new Date(currentStart);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);

  const prevStart = new Date(prevEnd);
  prevStart.setUTCMonth(prevStart.getUTCMonth() - 1);

  const startStr = `${prevStart.getUTCMonth() + 1}/${prevStart.getUTCDate()}`;
  const endStr = `${prevEnd.getUTCMonth() + 1}/${prevEnd.getUTCDate()}`;

  return `${startStr}-${endStr} Edition 🏆`;
}


const PreviousLeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

 const prizes = [500, 300, 150]; // Top 3 prizes
  const medals = ["🥇", "🥈", "🥉"]; // Top 3 medals

  useEffect(() => {
  const fetchPreviousLeaderboard = async () => {
    try {
      const { start: currentStart } = getCurrentMonthlyPeriod();

      const prevEnd = new Date(currentStart);
      prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);

      const prevStart = new Date(prevEnd);
      prevStart.setUTCMonth(prevStart.getUTCMonth() - 1);

      const format = (d: Date) => d.toISOString().split("T")[0];

      const url = `https://luckywdata-production.up.railway.app/api/leaderboard/${format(prevStart)}/${format(prevEnd)}`;

      const res = await axios.get(url, { timeout: 8000 });
      if (!res.data || !res.data.data) throw new Error("Invalid API response");

      const sorted = res.data.data.sort(
        (a: any, b: any) => b.weightedWagered - a.weightedWagered
      );

      setLeaderboard(sorted.slice(0, 10));
    } catch (err) {
      setError("Failed to fetch previous leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  fetchPreviousLeaderboard();
}, []);


  // Podium top 3 for visual effect
  const podiumOrder =
    leaderboard.length >= 3 ? [leaderboard[1], leaderboard[0], leaderboard[2]] : leaderboard;

  return (
    <div className="relative flex flex-col min-h-screen text-[#FFFBED] overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-center bg-no-repeat bg-contain opacity-40"
        style={{
          backgroundImage: `url('https://i.ibb.co/2YNrPKrD/3dgifmaker96052.gif')`,
          backgroundColor: "#000",
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />

      <div className="relative z-10">
        <Navbar />
        <main className="flex-grow w-full px-6 py-12 mx-auto text-center max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#F1A82F] mb-2">
            🏆 PREVIOUS LEADERBOARD 🏆
          </h1>
          <p className="text-[#F1A82F]/80 mb-8 text-lg">
  {formatPreviousMonthlyRange()}
</p>


          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <Button
              className="bg-[#F1A82F] hover:bg-[#F9B97C] text-[#0F0F0F] px-6 py-3 rounded-full font-semibold shadow-lg"
              onClick={() =>
                window.open("https://roobet.com/?ref=luckyw", "_blank", "noopener noreferrer")
              }
            >
              Join Now
            </Button>
            <Button
              className="bg-transparent border border-[#F1A82F] hover:bg-[#F1A82F]/10 text-[#F1A82F] px-6 py-3 rounded-full font-semibold flex items-center gap-2"
              onClick={() => setShowHowItWorks(true)}
            >
              <Info className="w-4 h-4" /> How It Works
            </Button>
          </div>

          {/* Podium Top 3 */}
          {leaderboard.length > 0 && (
            <div className="grid items-end grid-cols-3 gap-6 mb-12">
              {podiumOrder.slice(0, 3).map((player, idx) => {
                const isTop1 = player.uid === leaderboard[0].uid;
                const medalIdx = leaderboard.indexOf(player);
                return (
                  <div
                    key={player.uid}
                    className={`bg-black/50 backdrop-blur-xl border border-[#F1A82F]/30 rounded-2xl p-6 flex flex-col items-center shadow-lg transition-transform duration-300 ${
                      isTop1 ? "scale-110" : "scale-100"
                    }`}
                  >
                    <div className="mb-2 text-4xl">{medals[medalIdx]}</div>
                    <div className="text-2xl md:text-3xl font-bold text-[#F1A82F] mb-2">
                      {player.username}
                    </div>
                    <div className="mb-4 text-white/80">
                      {player.weightedWagered.toLocaleString()} Wagered
                    </div>
                    <div className="text-xl font-bold text-white/90 bg-[#F1A82F]/20 px-4 py-2 rounded-full">
                      Prize: ${prizes[medalIdx]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Table */}
          {loading && <p className="text-[#F1A82F]">Loading leaderboard...</p>}
          {error && <p className="text-[#F9B97C]">{error}</p>}

          {leaderboard.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse bg-[#0F0F0F]/80 backdrop-blur-md rounded-2xl shadow-lg">
                <thead className="bg-[#F1A82F] text-[#0F0F0F] uppercase text-sm md:text-base">
                  <tr>
                    <th className="p-4 text-center w-[10%] whitespace-nowrap">Rank</th>
                    <th className="p-4 text-center w-[40%] whitespace-nowrap">Player</th>
                    <th className="p-4 text-right w-[25%] whitespace-nowrap">Wagered</th>
                    <th className="p-4 text-right w-[25%] whitespace-nowrap">Prize</th>
                  </tr>
                </thead>

                <tbody>
                  {leaderboard.map((p, idx) => {
                    const r = idx + 1; // Rank based on wagered
                    const rankColor =
                      r === 1
                        ? "bg-yellow-400 text-black"
                        : r === 2
                        ? "bg-gray-400 text-black"
                        : r === 3
                        ? "bg-yellow-700 text-white"
                        : "bg-[#F1A82F]/20 text-[#F1A82F]";

                    return (
                      <tr
                        key={p.uid}
                        className="border-t border-[#F9B97C]/20 hover:bg-[#F9B97C]/10 transition-all duration-200"
                      >
                        <td className="p-4 font-bold text-center">
                          <span
                            className={`inline-flex justify-center items-center w-10 h-10 rounded-full font-semibold ${rankColor}`}
                          >
                            #{r}
                          </span>
                        </td>

                        <td className="p-4 font-semibold text-center truncate max-w-[200px]">
                          {p.username}
                        </td>

                        <td className="p-4 text-right text-[#F1A82F]/80">
                          {p.weightedWagered.toFixed(2)}
                        </td>

                        <td className="p-4 text-right font-semibold text-[#f9b97c]">
                          {prizeByRank[r] || "$0"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
        <Footer />
      </div>

      {/* How It Works Dialog */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="bg-[#0F0F0F] border border-[#F1A82F]/30 text-[#FFFBED] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#F1A82F] text-2xl font-bold text-center">
              How the Leaderboard Works
            </DialogTitle>
            <DialogDescription className="text-[#F1A82F]/80 text-center mb-4">
              Weighted wagers based on RTP determine your leaderboard score.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-[#FFFBED]/90">
            <p>🎯 RTP ≤ <strong>97%</strong> → <strong className="text-[#F1A82F]">100%</strong> weight</p>
            <p>🎯 RTP &gt; 97% → <strong className="text-[#F1A82F]">50%</strong></p>
            <p>🎯 RTP ≥ <strong>98%</strong> → <strong className="text-[#F1A82F]">10%</strong></p>
            <p className="text-sm border-t border-[#F1A82F]/30 pt-3">
              ⚠️ Only <strong>Slots</strong> & <strong>Housegames</strong> count (Dice excluded).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviousLeaderboardPage;
