import React, { useEffect, useState } from "react";
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

// ---- UTC SAFE DATE FORMATTER ----
function toISODateUTC(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day)).toISOString().split("T")[0];
}

const RoobetPage: React.FC = () => {
  const { leaderboard, loading, error, fetchLeaderboard } = useRoobetStore();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });
  const currentYear = now.getFullYear();

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown effect
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
      ).getTime();

      const diff = end - now.getTime();
      const total = Math.max(0, Math.floor(diff / 1000));

      setTimeLeft({
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // ---- FETCH LEADERBOARD WITH UTC SAFE DATES ----
  useEffect(() => {
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();

    const startDate = toISODateUTC(year, month, 1);
    const endDate = toISODateUTC(year, month + 1, 0);

    fetchLeaderboard(startDate, endDate);
  }, []);

  const topTenPlayers = leaderboard?.data?.slice(0, 10) || [];

  return (
    <div className="relative flex flex-col min-h-screen text-white overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-contain bg-center bg-no-repeat opacity-70 z-0"
        style={{
          backgroundImage: `url('https://i.ibb.co/XrDRLV7S/acloseupof-subject-1-smokingacigarettewiththesmokemoving-ezgif-com-gif-maker.gif')`,
          backgroundColor: "#000",
        }}
      ></div>

      {/* Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#040704]/80 via-[#040704]/90 to-[#040704] z-0"></div>

      <div className="relative z-10">
        <Navbar />

        <main className="flex-grow w-full px-6 py-12 mx-auto max-w-7xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#EFA813] mb-2">
            $750 ROOBET MONTHLY LEADERBOARD
          </h1>
          <p className="text-[#EFA813]/80 mb-2 text-lg">
            {currentMonth} {currentYear} Edition 🗓️
          </p>
          <p className="text-[#EFA813]/80 mb-8 text-lg">
            Use code <span className="font-bold text-[#E84D06]">"tacopoju"</span> to compete!
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <Button
              className="bg-[#E84D06] hover:bg-[#EFA813] text-white px-6 py-3 rounded-full font-semibold shadow-lg"
              onClick={() =>
                window.open(
                  "https://roobet.com/?ref=tacopoju",
                  "_blank",
                  "noopener noreferrer"
                )
              }
            >
              Join Now
            </Button>

            <Button
              className="bg-transparent border border-[#EFA813] hover:bg-[#EFA813]/10 text-[#EFA813] px-6 py-3 rounded-full font-semibold flex items-center gap-2"
              onClick={() => setShowHowItWorks(true)}
            >
              <Info className="w-4 h-4" />
              How It Works
            </Button>
          </div>

          {loading && <p className="text-[#EFA813]">Loading leaderboard...</p>}
          {error && <p className="text-[#E84D06]">{error}</p>}

          {/* Leaderboard */}
          {topTenPlayers.length > 0 ? (
            <>
              <div className="overflow-x-auto bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-[#547E25] shadow-lg mb-6">
                <table className="w-full border-collapse text-sm md:text-base table-fixed">
                  <thead className="bg-[#EFA813] text-[#040704] uppercase">
                    <tr>
                      <th className="w-[10%] p-4 text-center">Rank</th>
                      <th className="w-[30%] p-4 text-left">Player</th>
                      <th className="w-[20%] p-4 text-right">Wagered</th>
                      <th className="w-[20%] p-4 text-right">Weighted</th>
                      <th className="w-[20%] p-4 text-right">Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTenPlayers.map((p) => {
                      const r = p.rankLevel;

                      let base = 0;
                      if (r === 1) base = 325;
                      else if (r === 2) base = 175;
                      else if (r === 3) base = 90;
                      else if (r === 4) base = 45;
                      else if (r === 5) base = 30;
                      else if (r === 6) base = 25;
                      else if (r === 7 || r === 8) base = 20;
                      else if (r === 9 || r === 10) base = 10;

                      const bonus = Math.floor(p.wagered / 10000) * 15;
                      const totalPrize = base + bonus;

                      return (
                        <tr
                          key={p.uid}
                          className="border-t border-[#E84D06]/20 hover:bg-[#E84D06]/10 transition-all"
                        >
                          <td className="p-4 text-center font-bold text-[#EFA813]">
                            #{r}
                          </td>
                          <td className="p-4 font-semibold text-left break-all">
                            {p.username}
                          </td>
                          <td className="p-4 text-right">
                            ${p.wagered.toLocaleString()}
                          </td>
                          <td className="p-4 text-right text-[#EFA813]/80">
                            {p.weightedWagered.toLocaleString()}
                          </td>
                          <td className="p-4 text-right text-[#547E25] font-semibold">
                            ${totalPrize}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="text-center bg-[#E84D06]/10 border border-[#EFA813]/40 rounded-xl py-3 px-4 mt-2 mb-12 text-[#EFA813] font-semibold shadow-lg">
                💰 Earn <span className="text-[#E84D06]">$15</span> every{" "}
                <span className="text-[#EFA813]">$10,000</span> wagered!
              </div>
            </>
          ) : (
            !loading &&
            !error && <p className="text-[#EFA813]/70 mb-12">No players yet this month.</p>
          )}

          {/* Countdown */}
          <div className="mb-12">
            <h3 className="text-2xl text-[#EFA813] font-bold mb-2">
              Leaderboard Ends In
            </h3>
            <div className="flex justify-center gap-4 text-2xl font-extrabold text-[#E84D06]">
              <TimerBox label="Days" value={timeLeft.days} />
              <TimerBox label="Hours" value={timeLeft.hours} />
              <TimerBox label="Minutes" value={timeLeft.minutes} />
              <TimerBox label="Seconds" value={timeLeft.seconds} />
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* How It Works Modal */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="bg-[#0a0a0a] border border-[#EFA813]/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#EFA813] text-2xl font-bold text-center">
              How the Leaderboard Works
            </DialogTitle>
            <DialogDescription className="text-[#EFA813]/80 text-center mb-4">
              Weighted wagers based on RTP determine your leaderboard score.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-[#fffefe]/90">
            <p>🎯 RTP ≤ <strong>97%</strong> → <strong className="text-[#EFA813]">100%</strong> weight</p>
            <p>🎯 RTP &gt; 97% → <strong className="text-[#EFA813]">50%</strong></p>
            <p>🎯 RTP ≥ <strong>98%</strong> → <strong className="text-[#EFA813]">10%</strong></p>

            <p className="text-sm border-t border-[#EFA813]/30 pt-3">
              ⚠️ Only <strong>Slots</strong> & <strong>Housegames</strong> count (Dice excluded).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Timer component
const TimerBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center bg-[#EFA813]/10 px-4 py-2 rounded-xl">
    <span className="text-3xl">{String(value).padStart(2, "0")}</span>
    <span className="text-xs uppercase text-[#EFA813]/70">{label}</span>
  </div>
);

export default RoobetPage;
