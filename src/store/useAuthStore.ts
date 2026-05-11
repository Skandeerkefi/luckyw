import { create } from "zustand";
import { buildApiUrl } from "@/lib/api";

interface User {
	id: string;
	kickUsername: string;
	rainbetUsername: string; // add this
	discordUsername?: string;
	role: string; // "user" or "admin"
}

interface AuthState {
	user: User | null;
	token: string | null;
	isLoading: boolean;

	setUser: (user: User | null) => void;
	setToken: (token: string | null) => void;
	setIsLoading: (loading: boolean) => void;

	login: (
		kickUsername: string,
		password: string
	) => Promise<{ success: boolean; error?: string }>;

	signup: (
		kickUsername: string,
		rainbetUsername: string,
		discordUsername: string,
		password: string,
		confirmPassword: string
	) => Promise<boolean>;

	logout: () => void;
	loadFromStorage: () => void;
}

const fetchWithApi = (path: string, options: RequestInit) =>
	fetch(buildApiUrl(path), options);

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	token: null,
	isLoading: false,

	setUser: (user) => set({ user }),
	setToken: (token) => set({ token }),
	setIsLoading: (loading) => set({ isLoading: loading }),

	login: async (kickUsername, password) => {
		try {
			const res = await fetchWithApi("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ kickUsername, password }),
			});

			if (!res.ok) {
				const data = await res.json();
				return {
					success: false,
					error: data.message || "Login failed",
				};
			}

			const data = await res.json();

			console.log("🔐 Login success, saving user:", data.user);

			set({ user: data.user, token: data.token });
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));

			return { success: true };
		} catch (error: unknown) {
			console.error("❌ Login error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Login failed",
			};
		}
	},

	signup: async (
		kickUsername,
		rainbetUsername,
		discordUsername,
		password,
		confirmPassword
	) => {
		set({ isLoading: true });
		try {
			const res = await fetchWithApi("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					kickUsername,
					rainbetUsername,
					discordUsername,
					password,
					confirmPassword,
				}),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || "Signup failed");
			}

			set({ isLoading: false });
			return true;
		} catch (error: unknown) {
			set({ isLoading: false });
			throw error instanceof Error ? error : new Error("Signup failed");
		}
	},

	logout: () => {
		console.log("🚪 Logging out...");
		set({ user: null, token: null });
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},

	loadFromStorage: () => {
		const token = localStorage.getItem("token");
		const userStr = localStorage.getItem("user");

		console.log("🧠 Auth Load -> localStorage:", { token, userStr });

		if (token && userStr) {
			try {
				const user = JSON.parse(userStr);

				if (!user.role || typeof user.role !== "string") {
					console.warn(
						"⚠️ User role missing or invalid, setting default role 'user'"
					);
					user.role = "user";
				}

				console.log("✅ Parsed user from storage:", user);

				set({ token, user });
			} catch (err) {
				console.error("❌ Failed to parse user from localStorage", err);
				set({ token: null, user: null });
			}
		} else {
			console.warn("ℹ️ No user or token found in storage.");
			set({ token: null, user: null });
		}
	},
}));
