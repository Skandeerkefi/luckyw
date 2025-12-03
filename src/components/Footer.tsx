import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { FaKickstarterK } from "react-icons/fa"; // Kick icon approximation
import { FaInstagram, FaDiscord, FaXTwitter } from "react-icons/fa6"; // Socials

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='bg-[#040704] border-t border-[#547E25]/30 text-[#fffcf5]'>
			<div className='container px-6 py-12 mx-auto'>
				<div className='grid grid-cols-1 gap-10 md:grid-cols-3'>
					{/* Gambling Warning */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-[#EFA813]'>BEWARE GAMBLING</h3>
						<div className='text-sm text-[#fffcf5]/80 space-y-2'>
							<p>We are not responsible for illegal gambling activities.</p>
							<p>Play responsibly. Gambling involves financial risks.</p>
							<p>Ensure compliance with your local laws before engaging in any activities.</p>
							<p>Seek help if you experience issues related to gambling.</p>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-[#EFA813]'>Quick Links</h3>
						<div className='grid grid-cols-1 gap-2'>
							{[
								{ to: "/", label: "Home" },
								{ to: "/bonuses", label: "Bonuses" },
								{ to: "/RoobetPage", label: "Leaderboards" },
							].map(({ to, label }) => (
								<Link
									key={label}
									to={to}
									className='text-sm text-[#fffcf5]/80 hover:text-[#EFA813] transition-colors duration-200'
								>
									{label}
								</Link>
							))}
						</div>
					</div>

					{/* Social Links */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-[#EFA813]'>Social Links</h3>
						<div className='flex gap-3'>
							{[
								{
									href: "https://discord.gg/GTZK29pBAZ",
									icon: <FaDiscord className='w-5 h-5' />,
									label: "Discord"
								},
								{
									href: "https://www.instagram.com/tacopoju/",
									icon: <FaInstagram className='w-5 h-5' />,
									label: "Instagram"
								},
								{
									href: "https://kick.com/tacopoju",
									icon: <FaKickstarterK className='w-5 h-5' />,
									label: "Kick"
								},
								{
									href: "https://x.com/TACOPOJU",
									icon: <FaXTwitter className='w-5 h-5' />,
									label: "Twitter"
								},
							].map(({ href, icon, label }, i) => (
								<a
									key={i}
									href={href}
									aria-label={label}
									target='_blank'
									rel='noreferrer'
									className='flex items-center justify-center w-9 h-9 rounded-full bg-[#547E25]/20 text-[#fffcf5] transition-all hover:bg-[#EFA813] hover:text-[#040704] hover:scale-110 duration-200'
								>
									{icon}
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='pt-6 mt-12 border-t border-[#547E25]/30 text-center text-sm text-[#fffcf5]/70'>
					<p className='flex flex-wrap items-center justify-center gap-1'>
						© {currentYear} TACOPOJU.Site. All rights reserved. Made with
						<Heart className='w-3 h-3 mx-1 text-[#EFA813]' />
						by{" "}
						<a
							href='https://www.linkedin.com/in/skander-kefi/'
							target='_blank'
							rel='noreferrer'
							className='font-medium text-[#fffcf5] hover:text-[#EFA813] transition-colors duration-200'
						>
							Skander
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}