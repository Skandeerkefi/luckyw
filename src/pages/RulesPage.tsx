import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const RulesPage = () => {
  return (
    <div className="text-[#FFFBED] min-h-screen relative">
      {/* Animated Home Page Background */}
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

        <section className="px-6 py-24 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#F1A82F] mb-16 tracking-wide">
            Leaderboard Rules 📜
          </h2>

          <div className="max-w-4xl mx-auto space-y-10 leading-relaxed text-left text-white/80">
            {/* Wagering Rules Card */}
            <div className="bg-black/70 p-10 rounded-3xl border border-[#F1A82F]/30 shadow-2xl space-y-6">
              <h3 className="text-3xl font-bold text-[#F1A82F] mb-4">Wagering Rules</h3>
              <p>All games except Dice are eligible.</p>
              <p>The leaderboard is based on raw wagered amounts (pre-weighted by RTP).</p>
            </div>

            {/* Wager Contribution Card */}
            <div className="bg-black/70 p-10 rounded-3xl border border-[#F1A82F]/30 shadow-2xl space-y-6">
              <h3 className="text-3xl font-bold text-[#F1A82F] mb-4">Wager Contribution by RTP</h3>
              <p>🎰 RTP ≤ 97% → <strong>100%</strong> of wager counts</p>
              <p>🎲 RTP 97.01%–98.99% → <strong>50%</strong> of wager counts</p>
              <p>💎 RTP ≥ 99% → <strong>10%</strong> of wager counts</p>
            </div>

            {/* Important Notes Card */}
            <div className="bg-black/70 p-10 rounded-3xl border border-[#F1A82F]/30 shadow-2xl space-y-6">
              <h3 className="text-3xl font-bold text-[#F1A82F] mb-4">Important Notes</h3>
              <p>📌 You must be wagering under the correct referral to qualify.</p>
              <p>💰 Prizes are paid directly to your Roobet account.</p>
            </div>

            {/* Abuse Policy Card */}
            <div className="bg-black/70 p-10 rounded-3xl border border-red-500/30 shadow-2xl space-y-6">
              <h3 className="text-3xl font-bold text-red-400 mb-4">⚠️ Abuse Policy</h3>
              <p className="text-white/80">Any abuse detected by Luckyw or Roobet may result in your prize being forfeited.</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default RulesPage;
