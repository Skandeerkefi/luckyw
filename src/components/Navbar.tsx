import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Dices, Crown } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

type MenuItem = {
  path: string;
  name: string;
  icon?: ReactNode;
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);

    const listener = () => setMatches(window.matchMedia(query).matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [query, matches]);

  return matches;
};

export function Navbar() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const connectedLabel = isAdmin ? "Admin" : user?.kickUsername;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, isMobile]);

  const menuItemsBeforeLeaderboards: MenuItem[] = [
    { path: "/", name: "Home", icon: <Dices className="w-5 h-5" /> },
    { path: "/Leaderboard", name: "Leaderboard" },
    { path: "/offers", name: "Offers" },
    { path: "/rules", name: "Rules" },
  ];

  const menuItemsAfterLeaderboards: MenuItem[] = [
    // { path: "/slot", name: "Slot Calls" },
    { path: "/giveaways", name: "Giveaways" },
    { path: "/tournaments", name: "Tournaments" },
    ...(!user
      ? [
          { path: "/login", name: "Login" },
          { path: "/signup", name: "Signup" },
        ]
      : []),
  ];

  // Socials in navbar (all images)
  const socialLinks = [
    { href: "https://discord.com/invite/pEHw9xyerw", icon: "https://cdn.simpleicons.org/discord/FFFFFF", alt: "Discord" },
    { href: "https://x.com/luckyy_w", icon: "https://cdn.simpleicons.org/x/FFFFFF", alt: "X" },
    { href: "https://www.tiktok.com/@kickluckyw", icon: "https://cdn.simpleicons.org/tiktok/FFFFFF", alt: "TikTok" },
    { href: "https://www.instagram.com/kickluckyw", icon: "https://cdn.simpleicons.org/instagram/FFFFFF", alt: "Instagram" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-sm bg-[#0F0F0F]/95 border-b border-[#F1A82F]/20 shadow-xl h-20 font-sans">
        <div className="container flex items-center justify-between h-full px-6 mx-auto">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 select-none">
            <img
              src="https://i.ibb.co/dsrs5vkv/06f018fd-f3c5-4d7f-ad66-54f03458fcb7-fullsize.webp"
              alt="LuckyW Logo"
              className="w-12 h-12 rounded-full border-2 border-[#F1A82F] shadow-[0_0_15px_rgba(241,168,47,0.5)] object-cover"
            />
            <span className="text-3xl font-bold tracking-wider text-[#FFFBED]">
              Lucky<span className="text-[#F1A82F]">W</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          {!isMobile && (
            <ul className="flex items-center gap-3 text-[#FFFBED] font-semibold">
              {menuItemsBeforeLeaderboards.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-[#4E2F1A] text-[#FFFBED] shadow-lg"
                          : "text-[#F9B97C] hover:text-[#F1A82F]"
                      } flex items-center space-x-1`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}

              {menuItemsAfterLeaderboards.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-[#4E2F1A] text-[#FFFBED] shadow-lg"
                          : "text-[#F9B97C] hover:text-[#F1A82F]"
                      } flex items-center space-x-1`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}

              {/* SOCIAL ICONS */}
              <div className="ml-3 h-7 w-px bg-[#F1A82F]/20" />
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-125"
                  >
                    <img src={social.icon} alt={social.alt} className="w-5 h-5" />
                  </a>
                ))}
              </div>

              {user && connectedLabel && (
                <div className="ml-4 flex items-center gap-2 rounded-xl border border-[#F1A82F]/40 bg-[#4E2F1A]/60 px-3 py-2 text-sm text-[#FFFBED]">
                  {isAdmin ? <Crown className="h-4 w-4 text-[#F1A82F]" /> : null}
                  <span>{connectedLabel}</span>
                  <button
                    onClick={logout}
                    className="ml-2 rounded-md border border-[#F1A82F]/30 px-2 py-0.5 text-xs text-[#F9B97C] transition hover:text-[#F1A82F]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </ul>
          )}

          {/* MOBILE BUTTON */}
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5"
              >
                <span
                  className={`block w-8 h-1 bg-[#FFFBED] rounded transition-transform duration-300 ${
                    isOpen ? "rotate-45 translate-y-2.5 bg-[#F1A82F]" : ""
                  }`}
                />
                <span
                  className={`block w-8 h-1 bg-[#FFFBED] rounded transition-opacity duration-300 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block w-8 h-1 bg-[#FFFBED] rounded transition-transform duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2.5 bg-[#F1A82F]" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md flex flex-col items-center justify-start pt-24 space-y-4 text-xl font-semibold text-[#FFFBED] transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {menuItemsBeforeLeaderboards.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg w-full max-w-xs justify-center transition ${
                location.pathname === item.path
                  ? "bg-[#4E2F1A] text-[#F1A82F]"
                  : "text-[#F9B97C] hover:text-[#F1A82F] hover:bg-[#4E2F1A]/40"
              }`}
            >
              <span>{item.name}</span>
            </Link>
          ))}

          {menuItemsAfterLeaderboards.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg w-full max-w-xs justify-center transition ${
                location.pathname === item.path
                  ? "bg-[#4E2F1A] text-[#F1A82F]"
                  : "text-[#F9B97C] hover:text-[#F1A82F] hover:bg-[#4E2F1A]/40"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          {/* MOBILE SOCIALS */}
          <div className="flex items-center mt-4 space-x-4">
            {socialLinks.map((social, idx) => (
              <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer">
                <img src={social.icon} alt={social.alt} className="w-6 h-6" />
              </a>
            ))}
          </div>

          {user && connectedLabel && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#F1A82F]/40 bg-[#4E2F1A]/60 px-4 py-2 text-base text-[#FFFBED]">
              {isAdmin ? <Crown className="h-4 w-4 text-[#F1A82F]" /> : null}
              <span>{connectedLabel}</span>
              <button
                onClick={logout}
                className="ml-2 rounded-md border border-[#F1A82F]/30 px-2 py-0.5 text-xs text-[#F9B97C] transition hover:text-[#F1A82F]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* SPACER */}
      <div className="h-20"></div>
    </>
  );
}
