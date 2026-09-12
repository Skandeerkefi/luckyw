import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { useRoobetStore } from "@/store/RoobetStore";

function toDateOnlyUtc(d: Date) {
  return d.toISOString().split("T")[0];
}

function getCurrentRange() {
  const now = new Date();
  const nowMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const cycleStart = new Date(Date.UTC(2026, 8, 8)); // 09/08/2026
  const cycleLength = 15 * 86400000;
  const diff = nowMs - cycleStart.getTime();
  const cycleNum = Math.floor(diff / cycleLength);
  const start = new Date(cycleStart.getTime() + cycleNum * cycleLength);
  const end = new Date(start.getTime() + (15 - 1) * 86400000);
  return {
    startDate: toDateOnlyUtc(start),
    endDate: toDateOnlyUtc(end),
  };
}

function getPreviousRange() {
  const current = getCurrentRange();
  const currentStart = new Date(`${current.startDate}T00:00:00.000Z`);
  const previousEnd = new Date(currentStart);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setUTCDate(previousStart.getUTCDate() - 15 + 1);
  return {
    startDate: toDateOnlyUtc(previousStart),
    endDate: toDateOnlyUtc(previousEnd),
  };
}

const prizeByRank: Record<number, string> = {
  1: "$600",
  2: "$450",
  3: "$350",
  4: "$275",
  5: "$225",
  6: "$200",
  7: "$175",
  8: "$150",
  9: "$125",
  10: "$100",
  11: "$90",
  12: "$80",
  13: "$70",
  14: "$60",
  15: "$50",
};

const formatRangeLabel = () => {
  const { startDate, endDate } = getPreviousRange();
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);

  return `${String(start.getUTCMonth() + 1).padStart(2, '0')}/${String(start.getUTCDate()).padStart(2, '0')}/${start.getUTCFullYear()} - ${String(end.getUTCMonth() + 1).padStart(2, '0')}/${String(end.getUTCDate()).padStart(2, '0')}/${end.getUTCFullYear()}`;
};

const PreviousLeaderboardPage: React.FC = () => {
  const { previousLeaderboard, previousLoading, previousError, fetchPreviousLeaderboard } = useRoobetStore();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const label = useMemo(() => formatRangeLabel(), []);

  useEffect(() => {
    const { startDate, endDate } = getPreviousRange();
    fetchPreviousLeaderboard(startDate, endDate);
  }, [fetchPreviousLeaderboard]);

  const players = previousLeaderboard?.data?.slice(0, 15) || [];

  return (
    <div className="relative flex flex-col min-h-screen text-[#FFFBED] overflow-hidden">
      <div
        className="fixed inset-0 z-0 bg-center bg-no-repeat bg-contain opacity-40"
        style={{
          backgroundImage: "url('https://i.ibb.co/2YNrPKrD/3dgifmaker96052.gif')",
          backgroundColor: "#000",
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />

      <div className="relative z-10">
        <Navbar />
        <main className="flex-grow w-full px-6 py-12 mx-auto text-center max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#F1A82F] mb-2">
            Previous Leaderboard
          </h1>
          <p className="text-[#F1A82F]/80 mb-8 text-lg">{label}</p>

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

          {previousLoading && <p className="text-[#F1A82F]">Loading leaderboard...</p>}
          {previousError && <p className="text-[#F9B97C]">{previousError}</p>}

          {players.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto bg-[#0F0F0F]/80 backdrop-blur-md rounded-2xl shadow-lg">
                <thead className="bg-[#F1A82F] text-[#0F0F0F] uppercase text-sm">
                  <tr>
                    <th className="p-4 w-[10%]">Rank</th>
                    <th className="p-4 w-[40%]">Player</th>
                    <th className="p-4 w-[25%] text-right">Wagered</th>
                    <th className="p-4 w-[25%] text-right">Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, idx) => {
                    const rank = idx + 1;
                    return (
                      <tr key={player.uid} className="border-t border-[#F9B97C]/20 hover:bg-[#F9B97C]/10 transition">
                        <td className="p-4 text-center">#{rank}</td>
                        <td className="p-4 font-semibold text-center">{player.username}</td>
                        <td className="p-4 text-right text-[#F1A82F]/80">
                          {Number(player.wagered).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-4 text-right font-semibold text-[#F9B97C]">
                          {prizeByRank[rank] ?? "$0"}
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

      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="bg-[#0F0F0F] border border-[#F1A82F]/30 text-[#FFFBED] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#F1A82F] text-2xl font-bold text-center">
              How the Leaderboard Works
            </DialogTitle>
            <DialogDescription className="text-[#F1A82F]/80 text-center">
              Your raw wagers on Roobet count toward the leaderboard with RTP-based weighting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>RTP ≤ 97% → <strong>100%</strong> of wager counts</p>
            <p>RTP 97.01%–98.99% → <strong>50%</strong> of wager counts</p>
            <p>RTP ≥ 99% → <strong>10%</strong> of wager counts</p>
            <p className="border-t border-[#F1A82F]/30 pt-3">
              This is a <strong>Bi-Weekly Leaderboard</strong> with fresh rankings every 15 days.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviousLeaderboardPage;
