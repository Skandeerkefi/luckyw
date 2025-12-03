import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Twitch, Twitter, Disc, Music2, Video } from "lucide-react";

const HomePage = () => {
  return (
    <div className="text-[#FFFBED] min-h-screen flex flex-col relative">
      
       {/* Full Page GIF Background */}
      <div
        className="fixed inset-0 bg-contain bg-center bg-no-repeat opacity-44 z-0"
        style={{
          backgroundImage: `url('https://i.ibb.co/2YNrPKrD/3dgifmaker96052.gif)`,
          backgroundColor: "#000"
        }}
      ></div>

      
      {/* Gradient Overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-0"></div>

      <div className="relative z-10">
        <Navbar />

        {/* HERO */}
        <section className="relative flex flex-col items-center justify-center text-center py-28 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-extrabold tracking-widest drop-shadow-[0_0_25px_rgba(241,168,47,0.4)]"
            style={{ color: "#F1A82F" }}
          >
            LUCKYW
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-5 text-xl md:text-2xl text-[#ffffff] max-w-2xl"
          >
            Wager under code{" "}
            <span className="text-[#F1A82F]">'luckyw'</span> to join the{" "}
            <span className="text-[#ffffff]">$750 BI-WEEKLY LEADERBOARD</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-5 mt-10"
          >
            <Button
              className="bg-[#F1A82F] hover:bg-[#F9B97C] text-[#0F0F0F] px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all"
              onClick={() =>
                window.open("https://roobet.com/?ref=luckyw", "_blank")
              }
            >
              Join Leaderboard
            </Button>

            <Button
              variant="outline"
              className="border-2 border-[#F1A82F] text-[#F1A82F] hover:bg-[#F1A82F] hover:text-[#0F0F0F] px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
              onClick={() =>
                window.open("https://discord.com/invite/pEHw9xyerw", "_blank")
              }
            >
              Join Discord
            </Button>
          </motion.div>
        </section>

        {/* FEATURE CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-8 py-20 text-center">
          {[
            {
              title: "Bi-Weekly Leaderboard",
              desc: "$750 prize pool every cycle.",
            },
            {
              title: "Exclusive Rewards",
              desc: "Bonuses, giveaways & special perks.",
            },
            {
              title: "Join LuckyW Community",
              desc: "Be part of the fastest growing squad.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="rounded-2xl bg-[#4E2F1A]/60 border border-[#F1A82F]/30 backdrop-blur-md p-8 shadow-md hover:shadow-[#F1A82F]/30 hover:-translate-y-1.5 transition-all"
            >
              <h3 className="text-2xl font-bold text-[#F1A82F] mb-3">
                {card.title}
              </h3>
              <p className="text-[#FFFBED]/70 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </section>
{/* STREAM */}
        <section className="py-20 px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-[#F1A82F] mb-10"
          >
            Live Stream 🎮
          </motion.h2>

          <div className="flex justify-center">
            <motion.iframe
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              src="https://player.kick.com/luckyw"
              frameBorder="0"
              allowFullScreen
              className="w-full max-w-5xl h-[420px] rounded-3xl border border-[#F1A82F]/40 shadow-[0_0_25px_rgba(241,168,47,0.3)] transition-all"
            ></motion.iframe>
          </div>
        </section>

{/* Social Section - Futuristic Neon Design */}
<section className="py-28 px-6 text-center bg-gradient-to-b from-black via-[#0d0d0d] to-black">
  <h2 className="text-5xl font-extrabold text-[#F1A82F] mb-20 tracking-wide drop-shadow-[0_0_30px_rgba(241,168,47,0.7)]">
    Connect with LuckyW 🌐
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
    {[
      {
        href: "https://kick.com/luckyw",
        title: "Kick",
        icon: "https://cdn.simpleicons.org/kick/FFFFFF",
        colorFrom: "#53FC18",
        colorTo: "#0FF000",
      },
      {
        href: "https://x.com/luckyy_w",
        title: "Twitter",
        icon: "https://cdn.simpleicons.org/x/FFFFFF",
        colorFrom: "#1DA1F2",
        colorTo: "#0ABCF2",
      },
      {
        href: "https://discord.com/invite/pEHw9xyerw",
        title: "Discord",
        icon: "https://cdn.simpleicons.org/discord/FFFFFF",
        colorFrom: "#5865F2",
        colorTo: "#7289DA",
      },
      {
        href: "https://www.tiktok.com/@kickluckyw",
        title: "TikTok",
        icon: "https://cdn.simpleicons.org/tiktok/FFFFFF",
        colorFrom: "#FE2C55",
        colorTo: "#FF6B81",
      },
    ].map((social, i) => (
      <motion.a
        key={i}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, rotate: 2 }}
        className="group relative rounded-3xl overflow-hidden border border-[#F1A82F]/30 transition-all duration-300"
      >
        {/* Neon Gradient Pulse */}
        <div
          className="absolute inset-0 opacity-25 blur-3xl group-hover:opacity-50 group-hover:blur-2xl transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${social.colorFrom}, ${social.colorTo})`,
          }}
        ></div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center p-12 bg-black/40 backdrop-blur-xl rounded-3xl">
          <img
            src={social.icon}
            alt={social.title}
            className="h-24 mb-6 opacity-90 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]"
          />
          <span className="text-[#F1A82F] text-2xl font-bold tracking-wide drop-shadow-[0_0_15px_rgba(241,168,47,0.7)]">
            {social.title}
          </span>
        </div>

        {/* Animated Neon Border */}
        <div className="absolute inset-0 border-2 rounded-3xl border-transparent group-hover:border-gradient-to-r group-hover:from-[#F1A82F] group-hover:via-[#FF5C00] group-hover:to-[#53FC18] animate-pulse"></div>
      </motion.a>
    ))}
  </div>
</section>



        
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
