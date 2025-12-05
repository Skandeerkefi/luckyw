import React, { useEffect, useState } from "react";
import { useRoobetStore, getCurrentBiweekly } from "../store/RoobetStore";
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

// Prize mapping by rank
const prizeByRank: Record<number, string> = {
  1: "$300",
  2: "$150",
  3: "$75",
  4: "$50",
  5: "$50",
  6: "$25",
  7: "$25",
  8: "$25",
  9: "$25",
  10: "$25",
};

// Format biweekly range
function formatBiweeklyRange() {
  const { start, end } = getCurrentBiweekly();
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startStr = `${startDate.getUTCMonth() + 1}/${startDate.getUTCDate()}`;
  const endStr = `${endDate.getUTCMonth() + 1}/${endDate.getUTCDate()}`;
  return `${startStr}-${endStr} Edition 🏆`;
}

const RoobetPage: React.FC = () => {
  const { leaderboard, loading, error, fetchLeaderboard } = useRoobetStore();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [biweeklyLabel, setBiweeklyLabel] = useState(formatBiweeklyRange());

  // Countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const end = new Date(getCurrentBiweekly().end + "T23:59:59Z").getTime();
      const diff = end - Date.now();
      const total = Math.max(0, Math.floor(diff / 1000));

      setTimeLeft({
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch leaderboard
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Auto-update biweekly label
  useEffect(() => {
    const interval = setInterval(() => {
      setBiweeklyLabel(formatBiweeklyRange());
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  const topTenPlayers = leaderboard?.data?.slice(0, 10) || [];

  return (
    <div className="relative flex flex-col min-h-screen text-[#FFFBED] overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-contain bg-center bg-no-repeat opacity-44 z-0"
        style={{
          backgroundImage: `url('https://i.ibb.co/2YNrPKrD/3dgifmaker96052.gif')`,
          backgroundColor: "#000",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-0" />

      <div className="relative z-10">
        <Navbar />
        <main className="flex-grow w-full px-6 py-12 mx-auto max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#F1A82F] mb-2">
            💰 $750 BI-WEEKLY LEADERBOARD 💰
          </h1>
          <p className="text-[#F1A82F]/80 mb-8 text-lg">{biweeklyLabel}</p>

          {/* Timer */}
          <div className="mb-8">
            <h3 className="text-2xl text-[#F1A82F] font-bold mb-2">Leaderboard Ends In</h3>
            <div className="flex justify-center gap-4 text-2xl font-extrabold text-[#F9B97C]">
              <TimerBox label="Days" value={timeLeft.days} />
              <TimerBox label="Hours" value={timeLeft.hours} />
              <TimerBox label="Minutes" value={timeLeft.minutes} />
              <TimerBox label="Seconds" value={timeLeft.seconds} />
            </div>
          </div>

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
{/* Prize Info */}
<p className="text-[#F1A82F]/80 mb-2 text-sm">
  🏆 Prize Breakdown: ($500 MIN. WAGER REQ TO BE ELIGIBLE FOR A PRIZE)
</p>
          {/* Leaderboard */}
          {loading && <p className="text-[#F1A82F]">Loading leaderboard...</p>}
          {error && <p className="text-[#F9B97C]">{error}</p>}

          {topTenPlayers.length > 0 ? (
            <div className="overflow-x-auto mb-12">
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
  {topTenPlayers.map((p) => {
    const r = p.rankLevel;

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
        <td className="p-4 text-center font-bold">
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
          {Number(p.weightedWagered.toFixed(2)).toLocaleString()}$

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
          ) : (
            !loading &&
            !error && <p className="text-[#F1A82F]/70 mb-12">No players yet this period.</p>
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

// Timer Box Component
const TimerBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center bg-[#F1A82F]/10 px-4 py-2 rounded-xl">
    <span className="text-3xl">{String(value).padStart(2, "0")}</span>
    <span className="text-xs uppercase text-[#F1A82F]/70">{label}</span>
  </div>
);

export default RoobetPage;
