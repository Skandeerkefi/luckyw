import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const SocialsPage = () => {
  const socials = [
    { href: "https://kick.com/luckyw", title: "Kick", icon: "https://cdn.simpleicons.org/kick/FFFFFF", from: "#53FC18", to: "#0FF000" },
    { href: "https://x.com/luckyy_w", title: "Twitter", icon: "https://cdn.simpleicons.org/x/FFFFFF", from: "#1DA1F2", to: "#0ABCF2" },
    { href: "https://discord.com/invite/pEHw9xyerw", title: "Discord", icon: "https://cdn.simpleicons.org/discord/FFFFFF", from: "#5865F2", to: "#7289DA" },
    { href: "https://www.tiktok.com/@kickluckyw", title: "TikTok", icon: "https://cdn.simpleicons.org/tiktok/FFFFFF", from: "#FE2C55", to: "#FF6B81" },
    { href: "https://www.instagram.com/kickluckyw", title: "Instagram", icon: "https://cdn.simpleicons.org/instagram/FFFFFF", from: "#E1306C", to: "#F56040" },
  ];

  return (
    <div className="text-[#FFFBED] min-h-screen bg-black/90 relative">
      <Navbar />

      <section className="py-24 px-6 text-center">
        <h2 className="text-5xl font-extrabold text-[#F1A82F] mb-12">Socials 🌐</h2>
        <div className="flex justify-center gap-8 flex-wrap">
          {socials.map((social, idx) => (
            <motion.a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="relative rounded-full p-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg"
                   style={{ background: `radial-gradient(circle at 50% 50%, ${social.from}, ${social.to})` }}>
                <img src={social.icon} alt={social.title} className="w-10 h-10" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SocialsPage;
