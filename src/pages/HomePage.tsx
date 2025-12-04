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
<section className="relative flex flex-col items-center justify-center text-center pt-20 pb-1 px-6">

  <motion.h1
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-5xl md:text-7xl font-extrabold tracking-widest drop-shadow-[0_0_25px_rgba(241,168,47,0.4)]"
    style={{ color: "#F1A82F" }}
  >
    Welcome to LuckyW Hub
  </motion.h1>

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.8 }}
    className="mt-6 text-lg md:text-2xl text-[#ffffff] max-w-3xl leading-relaxed"
  >
    Premium bonuses, live leaderboards, and a community built around good vibes{" "}
    <span className="text-[#F1A82F]">(and better prizes)</span>.
  </motion.p>

  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.6, duration: 0.6 }}
    className="flex flex-wrap justify-center gap-5 mt-10"
  >
    {/* Empty container kept for spacing consistency */}
  </motion.div>

</section>


        {/* OFFERS SECTION - Symmetric Redesign */}
<section className="py-12 px-4 md:px-8 relative overflow-hidden ">
  {/* Background Elements */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2F1C12]/20 to-transparent"></div>
  <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#E39E2D]/5 rounded-full blur-3xl"></div>
  <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#FFFFFF]/5 rounded-full blur-3xl"></div>

  <div className="max-w-7xl mx-auto relative">
    {/* Section Header */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
        Exclusive Offers
      </h2>
      <p className="text-white/60 text-lg md:text-xl">
        Grab your rewards and join the excitement today!
      </p>
    </motion.div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* CARD TEMPLATE */}
      {[
        {
          title: "Sunday Spins",
          icon: "🎰",
          description: "Weekly free spins every Sunday",
          statsMain: "100",
          statsSub: "FREE SPINS",
          extraInfo: ["Minimum $1000 weekly wager", "Available every Sunday"],
          button: { text: "Claim Free Spins", link: "https://roobet.com/?ref=luckyw" }
        },
        {
          title: "Bi-Weekly Leaderboard",
          icon: "🏆",
          description: "Compete against the community every 2 weeks",
          statsMain: "$750",
          statsSub: "Total Prize Pool",
          extraInfo: ["$500 MIN. WAGER REQ TO BE ELIGIBLE FOR A PRIZE "],
          badge: "POPULAR",
          button: { text: "Join Leaderboard", link: "https://roobet.com/?ref=luckyw" }
        },
        {
          title: "Affiliate Revenue",
          icon: "💰",
          description: "",
          statsMain: "100%",
          statsSub: "",
          extraInfo: ["Instant Payouts • Bi-Weekly"],
          button: { text: "Start Earning", link: "https://discord.com/invite/pEHw9xyerw" }
        }
      ].map((offer, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.3, delay: idx * 0.1 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="relative group cursor-pointer flex flex-col h-full"
          onClick={() => window.open(offer.button.link, "_blank")}
        >
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E39E2D] via-[#FFFFFF] to-[#E39E2D] rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

          {/* Card Container */}
          <div className="relative bg-gradient-to-br from-[#3A2415] to-[#1F130C] border border-[#E39E2D]/20 rounded-2xl p-8 flex flex-col justify-between h-full backdrop-blur-sm">
            
            {/* Badge */}
            {offer.badge && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gradient-to-r from-[#E39E2D] to-[#F8C463] text-black text-xs font-bold rounded-full">
                  {offer.badge}
                </span>
              </div>
            )}

            {/* Icon & Header */}
            <div className="flex items-center gap-5 mb-6">
              <div className="p-4 bg-gradient-to-br from-[#E39E2D] via-[#F8C463] to-[#E39E2D] rounded-2xl shadow-lg text-2xl">
                {offer.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{offer.title}</h3>
                {offer.description && (
                  <p className="text-white/60 text-sm">{offer.description}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="text-center mb-6">
              <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#E39E2D] to-[#FFFFFF]">
                {offer.statsMain}
              </div>
              {offer.statsSub && (
                <div className="text-white font-bold text-xl mt-1">{offer.statsSub}</div>
              )}
              {offer.extraInfo.length > 0 && (
                <div className="mt-4 space-y-2 text-sm text-white/70">
                  {offer.extraInfo.map((info, i) => (
                    <div key={i}>{info}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Button */}
            <button className="relative w-full group/btn mt-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E39E2D] to-[#FFFFFF] rounded-xl blur-md opacity-0 group-hover/btn:opacity-70 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-[#E39E2D] to-[#F8C463] hover:from-[#FFFFFF] hover:to-[#E39E2D] text-black font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                <span>{offer.button.text}</span>
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"></path>
                </svg>
              </div>
            </button>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Bottom CTA */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-center mt-16"
    >
      <p className="text-white/50 text-sm">
        All offers require account verification. Terms and conditions apply.
      </p>
    </motion.div>
  </div>
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

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
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
      {
        href: "https://www.instagram.com/kickluckyw",
        title: "Instagram",
        icon: "https://cdn.simpleicons.org/instagram/FFFFFF",
        colorFrom: "#E1306C",
        colorTo: "#F56040",
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
