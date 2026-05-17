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
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  const start =
    day >= 11
      ? new Date(Date.UTC(year, month, 11, 0, 0, 0, 0))
      : new Date(Date.UTC(year, month - 1, 11, 0, 0, 0, 0));

  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);

  return {
    startDate: toDateOnlyUtc(start),
    endDate: toDateOnlyUtc(end),
  };
}

function getPreviousRange() {
  const { startDate } = getCurrentRange();
  const currentStart = new Date(`${startDate}T00:00:00.000Z`);

  const previousEnd = new Date(currentStart);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);

  const previousStart = new Date(previousEnd);
  previousStart.setUTCMonth(previousStart.getUTCMonth() - 1);

  return {
    startDate: toDateOnlyUtc(previousStart),
    endDate: toDateOnlyUtc(previousEnd),
  };
}

const prizeByRank: Record<number, string> = {
  1: "$600",
  2: "$350",
  3: "$250",
  4: "$200",
  5: "$150",
  6: "$120",
  7: "$100",
  8: "$90",
  9: "$80",
  10: "$60",
};

const formatRangeLabel = () => {
  const { startDate, endDate } = getPreviousRange();
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);

  return `${start.getUTCMonth() + 1}/${start.getUTCDate()}-${end.getUTCMonth() + 1}/${end.getUTCDate()} Edition`;
};

const PreviousLeaderboardPage: React.FC = () => {
  const { previousLeaderboard, previousLoading, previousError, fetchPreviousLeaderboard } = useRoobetStore();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const label = useMemo(() => formatRangeLabel(), []);

  useEffect(() => {
    const { startDate, endDate } = getPreviousRange();
    fetchPreviousLeaderboard(startDate, endDate);
  }, [fetchPreviousLeaderboard]);

  const players = previousLeaderboard?.data?.slice(0, 10) || [];

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
                          {Number(player.weightedWagered).toLocaleString(undefined, {
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
              Weighted wagers based on RTP determine ranking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>RTP &lt;= 97% -&gt; <strong>100%</strong> weight</p>
            <p>RTP &gt; 97% -&gt; <strong>50%</strong> weight</p>
            <p>RTP &gt;= 98% -&gt; <strong>10%</strong> weight</p>
            <p className="border-t border-[#F1A82F]/30 pt-3">
              Slots and Provably Fair count, Dice excluded.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviousLeaderboardPage;
