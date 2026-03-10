import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

function SignupPage() {
	const [username, setUsername] = useState("");
	const [rainbetUsername, setRainbetUsername] = useState("");
	const [discordUsername, setDiscordUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const { signup, isLoading } = useAuthStore();
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!username || !rainbetUsername || !discordUsername || !password || !confirmPassword) return;

		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return;
		}

		if (!agreedToTerms) return;

		try {
			const success = await signup(
				username,
				rainbetUsername,
				discordUsername,
				password,
				confirmPassword
			);
			if (success) {
				toast({
					title: "Account Created",
					description: "Your account has been created successfully!",
				});
				navigate("/login");
			}
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unexpected error occurred.";
			toast({
				title: "Signup Failed",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	return (
		<div className='relative flex flex-col min-h-screen'>
			<div
				className='fixed inset-0 z-0 bg-center bg-no-repeat bg-contain opacity-44'
				style={{
					backgroundImage: "url('https://i.ibb.co/2YNrPKrD/3dgifmaker96052.gif)",
					backgroundColor: "#000",
				}}
			/>
			<div className='fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-black/90 to-black' />

			<div className='relative z-10 flex flex-col min-h-screen'>
				<Navbar />

				<main className='container flex items-center justify-center flex-grow py-12'>
				<Card className='w-full max-w-md bg-white/90 border border-[#E0E0E0] text-[#000000] shadow-md rounded-xl backdrop-blur-md'>
					<CardHeader className='space-y-1'>
						<div className='flex items-center justify-center gap-2 mb-2'>
							<UserPlus className='w-6 h-6 text-[#000000]' />
							<CardTitle className='text-2xl text-[#000000]'>
								Create an Account
							</CardTitle>
						</div>
						<CardDescription className='text-center text-[#000000]'>
							Enter your Kick and Rainbet usernames to register and join the
							community
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className='space-y-4'>
							{/* Kick Username */}
							<div className='space-y-2'>
								<Label htmlFor='username' className='text-[#000000]'>
									Kick Username
								</Label>
								<Input
									id='username'
									placeholder='Enter your Kick username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
							</div>

							{/* Rainbet Username */}
							<div className='space-y-2'>
								<Label htmlFor='rainbetUsername' className='text-[#000000]'>
									Roobet Username
								</Label>
								<Input
									id='rainbetUsername'
									placeholder='Enter your Roobet username'
									value={rainbetUsername}
									onChange={(e) => setRainbetUsername(e.target.value)}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='discordUsername' className='text-[#000000]'>
									Discord Username
								</Label>
								<Input
									id='discordUsername'
									placeholder='Enter your Discord username'
									value={discordUsername}
									onChange={(e) => setDiscordUsername(e.target.value)}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
							</div>

							{/* Password */}
							<div className='space-y-2'>
								<Label htmlFor='password' className='text-[#000000]'>
									Password
								</Label>
								<Input
									id='password'
									type='password'
									placeholder='Create a password'
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										setPasswordError("");
									}}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
							</div>

							{/* Confirm Password */}
							<div className='space-y-2'>
								<Label htmlFor='confirmPassword' className='text-[#000000]'>
									Confirm Password
								</Label>
								<Input
									id='confirmPassword'
									type='password'
									placeholder='Confirm your password'
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										setPasswordError("");
									}}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
								{passwordError && (
									<p className='mt-1 text-xs text-[#AF2D03]'>{passwordError}</p>
								)}
							</div>

							{/* Terms Agreement */}
							<div className='flex items-center space-x-2'>
								<Checkbox
									id='terms'
									checked={agreedToTerms}
									onCheckedChange={(checked) =>
										setAgreedToTerms(checked as boolean)
									}
									className='border-[#E0E0E0]'
								/>
								<label
									htmlFor='terms'
									className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
								>
									I agree to the{" "}
									<Link to='/terms' className='text-[#000000] hover:underline'>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										to='/privacy'
										className='text-[#000000] hover:underline'
									>
										Privacy Policy
									</Link>
								</label>
							</div>
						</CardContent>

						<CardFooter className='flex flex-col space-y-4'>
							<Button
								type='submit'
								className='w-full bg-[#000000] hover:bg-[#222222] text-white'
								disabled={isLoading || !agreedToTerms}
							>
								{isLoading ? "Creating Account..." : "Create Account"}
							</Button>

							<div className='text-sm text-center text-[#222222]'>
								Already have an account?{" "}
								<Link
									to='/login'
									className='text-[#000000] hover:underline font-semibold'
								>
									Sign In
								</Link>
							</div>
						</CardFooter>
					</form>
				</Card>
				</main>

				<Footer />
			</div>
		</div>
	);
}

export default SignupPage;
