import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Instagram, Twitch, Twitter } from "lucide-react";

const HomePage = () => {
  return (
    <div className="text-white min-h-screen flex flex-col relative">
      {/* Full Page GIF Background */}
      <div
  className="fixed inset-0 bg-contain bg-center bg-no-repeat opacity-70 z-0"
  style={{
    backgroundImage: `url('https://i.ibb.co/XrDRLV7S/acloseupof-subject-1-smokingacigarettewiththesmokemoving-ezgif-com-gif-maker.gif')`,
    backgroundColor: "#000" // optional: fills empty space
  }}
></div>

      
      {/* Gradient Overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#040704]/80 via-[#040704]/90 to-[#040704] z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* HERO SECTION */}
        <section className="relative flex flex-col items-center justify-center text-center py-28 px-6 overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-extrabold text-[#EFA813] drop-shadow-[0_0_20px_rgba(239,168,19,0.3)] tracking-widest"
          >
            TACOPOJU
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-5 text-xl md:text-2xl text-gray-300 max-w-2xl"
          >
            Wager under code <span className="text-[#EFA813]">'tacopoju'</span> for
            prizes, rewards, and leaderboard glory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-5 mt-10"
          >
            <Button
  className="bg-[#547E25] hover:bg-[#EFA813] hover:text-[#040704] text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-[#EFA813]/40 transition-all"
  onClick={() => window.open("https://roobet.com/?ref=tacopoju", "_blank")}
>
  Join Leaderboard
</Button>

<Button
  variant="outline"
  className="border-2 border-[#EFA813] text-[#EFA813] hover:bg-[#EFA813] hover:text-[#040704] px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
  onClick={() => window.open("https://discord.gg/GTZK29pBAZ", "_blank")}
>
  Claim Bonus
</Button>

          </motion.div>
        </section>

        {/* FEATURE CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-8 py-20 text-center">
          {[
            {
              title: "Leaderboard",
              desc: "Compete weekly and climb to the top of the ranks.",
            },
            {
              title: "Exclusive Rewards",
              desc: "Earn unique bonuses, prizes, and special giveaways.",
            },
            {
              title: "Join the Team",
              desc: "Become part of the ever-growing TACOPOJU community.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="rounded-2xl bg-gradient-to-b from-[#0F140E]/70 to-[#040704]/50 border border-[#547E25]/30 backdrop-blur-md p-8 shadow-md hover:shadow-[#EFA813]/20 hover:-translate-y-1.5 transition-all"
            >
              <h3 className="text-2xl font-bold text-[#EFA813] mb-3">
                {card.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* SOCIAL SECTION */}
        <section className="py-20 px-6 text-center">
          <h2 className="text-3xl font-bold text-[#EFA813] mb-10">
            Connect with Me 🌐
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                href: "https://www.instagram.com/tacopoju/",
                title: "Instagram",
                icon: <Instagram className="w-6 h-6" />,
                img: "https://i.ibb.co/rRJGQTY8/Screenshot-2025-10-29-045108-removebg-preview.png",
                desc: "Catch my latest stories, clips, and updates.",
              },
              {
                href: "https://kick.com/tacopoju",
                title: "Kick",
                icon: <Twitch className="w-6 h-6" />,
                img: "https://i.ibb.co/gb3JxCZq/Screenshot-2025-10-29-044933-removebg-preview.png",
                desc: "Watch my live streams and chat with the community.",
              },
              {
                href: "https://x.com/TACOPOJU",
                title: "X (Twitter)",
                icon: <Twitter className="w-6 h-6" />,
                img: "https://i.ibb.co/p6bxjD0j/Twitter-X-Icon-PNG-removebg-preview.png",
                desc: "Stay updated with quick thoughts and stream news.",
              },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-[#0F140E]/70 to-[#040704]/50 border border-[#547E25]/30 overflow-hidden shadow-md hover:shadow-[#EFA813]/20 transition-all"
              >
                <div className="w-full h-36 bg-[#0F140E] flex items-center justify-center">
                  <img
                    src={social.img}
                    alt={social.title}
                    className="h-16 object-contain opacity-80 hover:opacity-100 transition-all"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-[#EFA813] font-semibold text-lg">
                      {social.title}
                    </span>
                    {social.icon}
                  </div>
                  <p className="text-gray-400 text-sm">{social.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* STREAM SECTION */}
        <section className="py-20 px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-[#EFA813] mb-10"
          >
            Watch My Streams 🎮
          </motion.h2>
          <div className="flex justify-center">
            <motion.iframe
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              src="https://player.kick.com/tacopoju"
              frameBorder="0"
              allowFullScreen
              className="w-full max-w-5xl h-[420px] rounded-3xl border border-[#547E25]/40 shadow-[0_0_25px_rgba(84,126,37,0.2)] hover:shadow-[#EFA813]/30 transition-all"
            ></motion.iframe>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;