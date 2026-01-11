import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const OffersPage = () => {
  const offers = [
    {
      title: "Sunday Spins",
      icon: "🎰",
      description: "Weekly free spins every Sunday",
      statsMain: "100",
      statsSub: "FREE SPINS",
      extraInfo: ["Minimum $1000 weekly wager", "Available every Sunday"],
      button: { text: "Claim Free Spins", link: "https://discord.com/invite/pEHw9xyerw" },
    },
    {
      title: "Monthly Leaderboard",
      icon: "🏆",
      description: "Compete against the community every 2 weeks",
      statsMain: "$2000",
      statsSub: "Total Prize Pool",
      extraInfo: ["paid out at the end of the each leaderboard"],
      badge: "POPULAR",
      button: { text: "Join Leaderboard", link: "https://roobet.com/?ref=luckyw" },
    },
    {
      title: "Affiliate Revenue",
      icon: "💰",
      description: "Earn commissions from referrals",
      statsMain: "100%",
      statsSub: "Instant Payouts",
      extraInfo: ["Instant Payouts • Monthly"],
      button: { text: "Start Earning", link: "https://discord.com/invite/pEHw9xyerw" },
    },
  ];

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

        <section className="max-w-5xl px-6 py-24 mx-auto">
          <h2 className="text-5xl font-extrabold text-[#F1A82F] text-center mb-16">
            Exclusive Offers
          </h2>

          <div className="flex flex-col gap-12">
            {offers.map((offer, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="relative bg-black/70 border border-[#F1A82F]/30 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                {/* Badge */}
                {offer.badge && (
                  <span className="absolute top-4 right-4 bg-[#F1A82F] text-black px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                    {offer.badge}
                  </span>
                )}

                {/* Icon */}
                <div className="text-6xl md:text-7xl">{offer.icon}</div>

                {/* Details */}
                <div className="flex flex-col items-center flex-1 gap-2 md:items-start">
                  <h3 className="text-3xl md:text-4xl font-bold text-[#F1A82F]">{offer.title}</h3>
                  {offer.description && <p className="text-center text-white/70 md:text-left">{offer.description}</p>}

                  <div className="text-xl font-bold text-white/90 bg-[#F1A82F]/20 px-4 py-2 rounded-full mt-2">
                    {offer.statsMain} {offer.statsSub}
                  </div>

                  {offer.extraInfo.map((info, i) => (
                    <p key={i} className="mt-1 text-sm text-white/60">{info}</p>
                  ))}

                  <button
                    onClick={() => window.open(offer.button.link, "_blank")}
                    className="bg-[#F1A82F] hover:bg-white text-black font-bold px-6 py-3 rounded-xl mt-4 transition-colors duration-300"
                  >
                    {offer.button.text}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default OffersPage;
