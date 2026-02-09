import React, { useEffect, useMemo, useState } from "react";
import { useRoobetStore, getCurrentMonthlyPeriod } from "../store/RoobetStore";
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
   Monthly Label (12/8 → 1/8)
   ─────────────────────────────── */
function formatMonthlyRange() {
  const { start, end } = getCurrentMonthlyPeriod();

  const s = new Date(start);
  const e = new Date(end);

  return `${s.getUTCMonth() + 1}/${s.getUTCDate()}-${e.getUTCMonth() + 1}/${e.getUTCDate()} Monthly Edition 🏆`;
}

const RoobetPage: React.FC = () => {
  const { leaderboard, loading, error, fetchLeaderboard } = useRoobetStore();

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const monthlyLabel = formatMonthlyRange();

  /* ───────────────────────────────
     Fetch leaderboard
     ─────────────────────────────── */
  useEffect(() => {
    fetchLeaderboard("monthly");
  }, [fetchLeaderboard]);

  /* ───────────────────────────────
     Countdown to monthly end
     ─────────────────────────────── */
  useEffect(() => {
    const tick = () => {
      const { end } = getCurrentMonthlyPeriod();
      const endTime = new Date(`${end}T00:00:00Z`).getTime();
      const diff = Math.max(0, endTime - Date.now());
      const total = Math.floor(diff / 1000);

      setTimeLeft({
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

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
            💰 $2,000 MONTHLY LEADERBOARD 💰
          </h1>

          <p className="text-[#F1A82F]/80 mb-8 text-lg">{monthlyLabel}</p>

          {/* Timer */}
          <div className="mb-8">
            <h3 className="text-2xl text-[#F1A82F] font-bold mb-2">
              Leaderboard Ends In
            </h3>
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
                          {p.username}
                        </td>

                        <td className="p-4 text-right text-[#F1A82F]/80">
                          ${Number(p.weightedWagered).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}


                        </td>

                        <td className="p-4 text-right font-semibold text-[#F9B97C]">
                          {prizeByRank[r] ?? "$0"}
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
                No players yet this period.
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
              Weighted wagers based on RTP determine ranking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <p>🎯 RTP ≤ 97% → <strong>100%</strong> weight</p>
            <p>🎯 RTP &gt; 97% → <strong>50%</strong> weight</p>
            <p>🎯 RTP ≥ 98% → <strong>10%</strong> weight</p>
            <p className="border-t border-[#F1A82F]/30 pt-3">
              ⚠️ Slots & Housegames only (Dice excluded)
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ───────────────────────────────
   Timer Box
   ─────────────────────────────── */
const TimerBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center bg-[#F1A82F]/10 px-4 py-2 rounded-xl">
    <span className="text-3xl">{String(value).padStart(2, "0")}</span>
    <span className="text-xs uppercase text-[#F1A82F]/70">{label}</span>
  </div>
);

export default RoobetPage;
