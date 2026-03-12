import React, { useEffect, useMemo, useState } from "react";
import { useRoobetStore } from "../store/RoobetStore";
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

/* ───────────────────────────────
   MONTHLY PRIZE MAPPING ($2000)
   ─────────────────────────────── */
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

/* ───────────────────────────────
   Monthly Label
   ─────────────────────────────── */
function formatMonthlyRange(range: { startDate: string; endDate: string }) {
  const s = new Date(`${range.startDate}T12:00:00.000Z`);
  const e = new Date(`${range.endDate}T12:00:00.000Z`);

  return `${s.getUTCMonth() + 1}/${s.getUTCDate()}-${e.getUTCMonth() + 1}/${e.getUTCDate()} Monthly Edition 🏆`;
}

function toDateOnlyUtc(d: Date) {
  return d.toISOString().split("T")[0];
}

function maskUsername(username: string): string {
  if (!username || username.length <= 2) return "***";
  const first = username.charAt(0);
  const last = username.charAt(username.length - 1);
  const asterisks = "*".repeat(Math.max(1, username.length - 2));
  return first + asterisks + last;
}

function getPreviousRange() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  const currentStart =
    day >= 10
      ? new Date(Date.UTC(year, month, 10, 0, 0, 0, 0))
      : new Date(Date.UTC(year, month - 1, 10, 0, 0, 0, 0));

  const currentEnd = new Date(currentStart);
  currentEnd.setUTCMonth(currentEnd.getUTCMonth() + 1);

  const previousStart = new Date(currentStart);
  previousStart.setUTCMonth(previousStart.getUTCMonth() - 1);
  previousStart.setUTCDate(previousStart.getUTCDate() - 1);

  const previousEnd = new Date(currentStart);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);

  return {
    startDate: toDateOnlyUtc(previousStart),
    endDate: toDateOnlyUtc(previousEnd),
  };
}

const PreviousRoobetPage: React.FC = () => {
  const { leaderboard, loading, error, fetchPreviousLeaderboard } =
    useRoobetStore();

  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const previousRange = useMemo(() => getPreviousRange(), []);
  const monthlyLabel = formatMonthlyRange(previousRange);

  /* ───────────────────────────────
     Fetch leaderboard
     ─────────────────────────────── */
  useEffect(() => {
    fetchPreviousLeaderboard(previousRange.startDate, previousRange.endDate);
  }, [fetchPreviousLeaderboard, previousRange.startDate, previousRange.endDate]);

  const topPlayers = leaderboard?.data?.slice(0, 15) ?? [];

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
            💰 $2,000 PREVIOUS MONTHLY LEADERBOARD 💰
          </h1>

          <p className="text-[#F1A82F]/80 mb-8 text-lg">{monthlyLabel}</p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <Button
              className="bg-[#F1A82F] hover:bg-[#F9B97C] text-[#0F0F0F] px-6 py-3 rounded-full font-semibold shadow-lg"
              onClick={() =>
                window.open(
                  "https://roobet.com/?ref=luckyw",
                  "_blank",
                  "noopener noreferrer"
                )
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

          {/* Leaderboard */}
          {loading && <p className="text-[#F1A82F]">Loading leaderboard…</p>}
          {error && <p className="text-[#F9B97C]">{error}</p>}

          {topPlayers.length > 0 ? (
            <div className="mb-12 overflow-x-auto">
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
                  {topPlayers.map((p) => {
                    const r = p.rankLevel;

                    const rankColor =
                      r === 1
                        ? "bg-yellow-400 text-black"
                        : r === 2
                        ? "bg-gray-400 text-black"
                        : r === 3
                        ? "bg-yellow-700 text-white"
                        : r <= 10
                        ? "bg-[#F1A82F]/20 text-[#F1A82F]"
                        : "bg-white/10 text-white/60";

                    return (
                      <tr
                        key={p.uid}
                        className="border-t border-[#F9B97C]/20 hover:bg-[#F9B97C]/10 transition"
                      >
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex w-10 h-10 items-center justify-center rounded-full font-bold ${rankColor}`}
                          >
                            #{r}
                          </span>
                        </td>

                        <td className="p-4 font-semibold text-center truncate">
                          {maskUsername(p.username)}
                        </td>

                        <td className="p-4 text-right font-mono text-[#F9B97C]">
                          ${Number(p.weightedWagered).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td className="p-4 text-right font-bold text-[#F1A82F]">
                          {prizeByRank[r] || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            !loading &&
            !error && (
              <p className="text-[#F1A82F]/70 mb-12">
                No players in this period.
              </p>
            )
          )}
        </main>

        <Footer />
      </div>

      {/* How it works dialog */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="bg-[#0F0F0F] border border-[#F1A82F]/30 text-[#FFFBED] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#F1A82F] text-2xl font-bold text-center">
              How the Leaderboard Works
            </DialogTitle>
            <DialogDescription className="text-[#F1A82F]/80 text-center">
              Your wagers on Roobet count toward the leaderboard with RTP-based weighting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <p>
              Games with an RTP of <strong>97% or less</strong> contribute <strong>100%</strong> of the amount wagered.
            </p>
            <p>
              Games with an RTP <strong>above 97%</strong> contribute <strong>50%</strong> of the amount wagered.
            </p>
            <p>
              Games with an RTP of <strong>98% and above</strong> contribute <strong>10%</strong> of the amount wagered.
            </p>
            <p className="border-t border-[#F1A82F]/30 pt-3">
              Only <strong>Slots</strong> and <strong>Provably Fair</strong> count (house games with <strong>Dice excluded</strong>).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviousRoobetPage;
