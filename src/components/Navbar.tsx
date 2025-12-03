import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dices, Crown, MessageSquare } from "lucide-react";

// --- Mock Dependencies for Runnability in a Single File ---
// NOTE: These mock versions are included to make the file runnable in a single-file environment.
// In your actual project, you would use the imported dependencies directly.

// Mock for useMediaQuery hook (Adjusted to be a simple implementation)
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(window.matchMedia(query).matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [query, matches]);

    return matches;
};

// Mock for useAuthStore and user
const useAuthStore = () => ({
    user: null, // Set to null to simplify the output, as auth logic was commented out
    logout: () => console.log("Logout mock called"),
});

// Mock for react-router-dom's useLocation
const MockUseLocation = () => ({
    pathname: "/Leaderboard", // Mocking the Leaderboard link as active initially to show the style
});
// -----------------------------------------------------------

// Color Palette Used:
// Background: #040704
// Primary Accent: #EFA813
// Secondary Accent: #547E25
// CTA/Highlight: #E84D06
// Active Link Container (Custom Dark Indigo to match screenshot): #1E1A33

export function Navbar() {
    // Replace useLocation() with MockUseLocation() for standalone use, keep for project use
    const location = useLocation(); 
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [isOpen, setIsOpen] = useState(false);
    // Removed isLive and viewerCount state/effects as they are not needed for the UI design change
    const { user, logout } = useAuthStore(); 

    useEffect(() => {
        // Close menu on navigation or mobile/desktop change
        setIsOpen(false);
    }, [location.pathname, isMobile]);

    // Simplified menu items based on user's original array
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
            {/* Fixed Navbar - Deep Dark Background (#040704) */}
            <nav className='fixed top-0 w-full z-50 backdrop-blur-sm bg-[#040704]/95 border-b border-[#547E25]/30 shadow-2xl shadow-black/70 h-20 font-sans'>
                <div className='container relative flex items-center justify-between h-full px-6 mx-auto'>
                    
                    {/* Logo/Brand Section - Styled to match dark background */}
                    <Link to='/' className='flex items-center space-x-3 select-none'>
                        {/* Placeholder image that uses the primary accent color */}
                        <img
                            src='https://i.ibb.co/XrDRLV7S/acloseupof-subject-1-smokingacigarettewiththesmokemoving-ezgif-com-gif-maker.gif'
                            alt='Rafaeli Logo'
                            className='w-12 h-12 rounded-full border-2 border-[#EFA813] shadow-[0_0_15px_rgba(239,168,19,0.5)] object-cover'
                        />
                        <span className='text-3xl font-bold tracking-wider text-white'>
                            <span className="text-white font-semibold">TACOPOJU</span>
                        </span>
                    </Link>

                    {/* Desktop Menu - Centered and Styled with Active Box */}
                    {!isMobile && (
                        <ul className='flex items-center space-x-8 text-white font-semibold'>
                            {menuItems.map((item) => {
                                // Check location for active state
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path} className='relative'>
                                        <Link
                                            to={item.path}
                                            className={`
                                                flex items-center transition-all duration-300 rounded-xl
                                                ${isActive
                                                    ? 'bg-[#1E1A33] text-white px-5 py-2 shadow-lg shadow-[#547E25]/20' // Active: Dark box
                                                    : 'text-gray-300 hover:text-[#EFA813] px-5 py-2' // Inactive: Subtle hover accent
                                                }
                                            `}
                                        >
                                            {/* Only showing text for desktop navigation as per screenshot */}
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* Right side controls: CTA Button & Mobile Menu Button */}
                    <div className='flex items-center space-x-4'>

                        {/* CTA Button: Join Discord - Vibrant Highlight Color (#E84D06) */}
                        <a 
                            href="https://discord.gg/GTZK29pBAZ" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className='hidden md:flex items-center space-x-2 
                                bg-[#E84D06] text-[#040704] 
                                hover:bg-[#EFA813] transition 
                                px-6 py-3 rounded-xl 
                                font-bold text-lg 
                                shadow-2xl shadow-[#E84D06]/40
                                transform hover:scale-105 active:scale-95'
                        >
                            <MessageSquare className='w-5 h-5' /> 
                            <span>Join Discord</span>
                        </a>

                        {/* Mobile Hamburger */}
                        {isMobile && (
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className='relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5'
                            >
                                <span
                                    className={`block w-8 h-1 bg-white rounded transition-transform duration-300 ${
                                        isOpen ? "rotate-45 translate-y-2.5 bg-[#E84D06]" : ""
                                    }`}
                                />
                                <span
                                    className={`block w-8 h-1 bg-white rounded transition-opacity duration-300 ${
                                        isOpen ? "opacity-0" : "opacity-100"
                                    }`}
                                />
                                <span
                                    className={`block w-8 h-1 bg-white rounded transition-transform duration-300 ${
                                        isOpen ? "-rotate-45 -translate-y-2.5 bg-[#E84D06]" : ""
                                    }`}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu - Full-screen overlay */}
            {isMobile && (
                <div
                    className={`fixed inset-0 z-40 bg-[#040704]/95 backdrop-blur-md flex flex-col items-center justify-start pt-24 space-y-6 text-xl font-semibold text-white transform transition-transform duration-300 ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-6 py-3 rounded-lg w-full max-w-xs justify-center transition ${
                                location.pathname === item.path
                                    ? "bg-[#1E1A33] text-[#EFA813]"
                                    : "text-gray-300 hover:text-[#EFA813] hover:bg-[#040704]/50"
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                     {/* Mobile CTA Button */}
                     <a 
                        href="https://discord.gg/yourserver" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className='flex items-center space-x-2 
                            bg-[#E84D06] text-[#040704] 
                            hover:bg-opacity-90 transition 
                            px-8 py-3 rounded-xl 
                            font-bold text-lg 
                            shadow-xl shadow-[#E84D06]/40 mt-8'
                    >
                        <MessageSquare className='w-5 h-5' /> 
                        <span>Join Discord</span>
                    </a>
                </div>
            )}

            {/* Spacer to prevent content overlap */}
            <div className='h-20'></div>
        </>
    );
}
