import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dices, Crown, MessageSquare } from "lucide-react";

// Media Query Hook
const useMediaQuery = (query) => {
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

// Mock Auth Store
const useAuthStore = () => ({
    user: null,
    logout: () => console.log("Logout mock called"),
});

export function Navbar() {
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuthStore();

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname, isMobile]);

    const menuItems = [
        { path: "/", name: "Home", icon: <Dices className='w-5 h-5' /> },
        {
            path: "/Leaderboard",
            name: "Leaderboard",
            icon: <Crown className='w-5 h-5' />,
        },
    ];

    return (
        <>
            {/* NAVBAR */}
            <nav className='fixed top-0 w-full z-50 backdrop-blur-sm bg-[#0F0F0F]/95 border-b border-[#F1A82F]/20 shadow-xl h-20 font-sans'>
                <div className='container flex items-center justify-between h-full px-6 mx-auto'>

                    {/* LOGO */}
                    <Link to='/' className='flex items-center space-x-3 select-none'>
                        <img
                            src='https://i.ibb.co/dsrs5vkv/06f018fd-f3c5-4d7f-ad66-54f03458fcb7-fullsize.webp'
                            alt='LuckyW Logo'
                            className='w-12 h-12 rounded-full border-2 border-[#F1A82F] shadow-[0_0_15px_rgba(241,168,47,0.5)] object-cover'
                        />
                        <span className='text-3xl font-bold tracking-wider text-[#FFFBED]'>
                            Lucky<span className="text-[#F1A82F]">W</span>
                        </span>
                    </Link>

                    {/* DESKTOP MENU */}
                    {!isMobile && (
                        <ul className='flex items-center space-x-8 text-[#FFFBED] font-semibold'>
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path} className='relative'>
                                        <Link
                                            to={item.path}
                                            className={`
                                                flex items-center transition-all duration-300 rounded-xl
                                                ${isActive
                                                    ? 'bg-[#4E2F1A] text-[#FFFBED] px-5 py-2 shadow-lg'
                                                    : 'text-[#F9B97C] hover:text-[#F1A82F] px-5 py-2'
                                                }
                                            `}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* CTA + MOBILE BUTTON */}
                    <div className='flex items-center space-x-4'>

                        {/* DISCORD BUTTON */}
                        <a
                            href="https://discord.com/invite/pEHw9xyerw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className='hidden md:flex items-center space-x-2 
                                bg-[#F1A82F] text-[#0F0F0F]
                                hover:bg-[#F9B97C] transition 
                                px-6 py-3 rounded-xl 
                                font-bold text-lg 
                                shadow-lg shadow-[#F1A82F]/40
                                transform hover:scale-105 active:scale-95'
                        >
                            <MessageSquare className='w-5 h-5' />
                            <span>Join Discord</span>
                        </a>

                        {/* MOBILE MENU BUTTON */}
                        {isMobile && (
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className='relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5'
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
                    className={`fixed inset-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md flex flex-col items-center justify-start pt-24 space-y-6 text-xl font-semibold text-[#FFFBED] transform transition-transform duration-300 ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {menuItems.map((item) => (
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

                    {/* MOBILE CTA */}
                    <a
                        href="https://discord.com/invite/pEHw9xyerw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='flex items-center space-x-2 
                            bg-[#F1A82F] text-[#0F0F0F] 
                            hover:bg-[#F9B97C] transition 
                            px-8 py-3 rounded-xl 
                            font-bold text-lg 
                            shadow-xl shadow-[#F1A82F]/30 mt-8'
                    >
                        <MessageSquare className='w-5 h-5' />
                        <span>Join Discord</span>
                    </a>
                </div>
            )}

            {/* SPACER */}
            <div className='h-20'></div>
        </>
    );
}
