import { create } from "zustand";
import api from "@/lib/api";
import { useAuthStore } from "./useAuthStore";

export type GiveawayStatus = "active" | "completed" | "upcoming";
export type GiveawayEntryRequirement =
	| "leaderboard_wager"
	| "no_wager_requirement";

type ToastPayload = {
	title: string;
	description?: string;
	variant?: "default" | "destructive";
};

type ToastFn = (payload: ToastPayload) => void;

type GiveawayParticipant = string | { _id: string; kickUsername?: string };

type GiveawayWinner = {
	_id?: string;
	kickUsername?: string;
	rainbetUsername?: string;
	discordUsername?: string;
} | null;

export type GiveawayPlayerDetails = {
	_id: string;
	kickUsername?: string;
	rainbetUsername?: string;
	discordUsername?: string;
};

type WagerDebugEntry = {
	uid: string;
	rawUsername: string;
	username: string;
	wagered: number;
	weightedWagered: number;
	effectiveWager: number;
};

const getErrorMessage = (error: unknown, fallback: string) => {
	if (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as { response?: unknown }).response === "object"
	) {
		const response = (error as { response?: { data?: { message?: string } } }).response;
		const msg = response?.data?.message;
		if (msg) return msg;
	}
	if (error instanceof Error && error.message) return error.message;
	return fallback;
};

export interface Giveaway {
	_id: string;
	title: string;
	endTime: string;
	requiredWagerAmount?: number;
	participants: GiveawayParticipant[];
	totalParticipants: number;
	totalEntries: number;
	state: "active" | "complete";
	status: GiveawayStatus;
	entryRequirement?: GiveawayEntryRequirement;
	winner?: GiveawayWinner;
	isEntered: boolean;
}

interface GiveawayState {
	giveaways: Giveaway[];
	wagerDebugList: WagerDebugEntry[];
	fetchGiveawayPlayers: (id: string) => Promise<GiveawayPlayerDetails[]>;
	fetchGiveaways: () => Promise<void>;
	enterGiveaway: (id: string, toast: ToastFn) => Promise<void>;
	createGiveaway: (
		title: string,
		endTime: string,
		entryRequirement: GiveawayEntryRequirement,
		requiredWagerAmount: number,
		toast: ToastFn
	) => Promise<void>;
	drawWinner: (id: string, toast: ToastFn) => Promise<void>;
}

export const useGiveawayStore = create<GiveawayState>((set, get) => ({
	giveaways: [],
	wagerDebugList: [],

	fetchGiveawayPlayers: async (id) => {
		const token = useAuthStore.getState().token;
		const res = await api.get(`/api/gws/${id}/players`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return (res.data?.players || []) as GiveawayPlayerDetails[];
	},

	fetchGiveaways: async () => {
		const token = useAuthStore.getState().token;
		try {
			const res = await api.get(`/api/gws`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const userId = useAuthStore.getState().user?.id;
			const enriched: Giveaway[] = (res.data as Giveaway[]).map((gws) => ({
				...gws,
				isEntered: gws.participants.some(
					(p) =>
						(typeof p === "string" ? p === userId : p._id === userId)
				),
				status: gws.state === "complete" ? "completed" : gws.state,
			}));
			set({ giveaways: enriched });

			try {
				const wagerRes = await api.get(`/api/gws/wager-debug`);
				set({ wagerDebugList: wagerRes.data?.data || [] });
			} catch (wagerErr) {
				console.error("Failed to fetch wager debug list", wagerErr);
			}
		} catch (err) {
			console.error("Failed to fetch giveaways", err);
		}
	},

	enterGiveaway: async (id, toast) => {
		const token = useAuthStore.getState().token;
		try {
			await api.post(
				`/api/gws/${id}/join`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await get().fetchGiveaways();
			toast({ title: "Entered successfully" });
		} catch (error: unknown) {
			let message = getErrorMessage(error, "Unable to enter giveaway.");
			const status =
				typeof error === "object" &&
				error !== null &&
				"response" in error &&
				typeof (error as { response?: { status?: number } }).response === "object"
					? (error as { response?: { status?: number } }).response?.status
					: undefined;

			if (status === 500) {
				message = "Wager requirement not met for this giveaway period.";
			}

			toast({
				title: "Error",
				description: message,
				variant: "destructive",
			});
		}
	},

	createGiveaway: async (
		title,
		endTime,
		entryRequirement,
		requiredWagerAmount,
		toast
	) => {
		const token = useAuthStore.getState().token;
		try {
			await api.post(
				`/api/gws`,
				{ title, endTime, entryRequirement, requiredWagerAmount },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await get().fetchGiveaways();
			toast({ title: "Giveaway created successfully" });
		} catch (error: unknown) {
			const message = getErrorMessage(error, "Failed to create giveaway");
			toast({
				title: "Error",
				description: message,
				variant: "destructive",
			});
		}
	},

	drawWinner: async (id, toast) => {
		const token = useAuthStore.getState().token;
		try {
			const res = await api.post(
				`/api/gws/${id}/draw`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const winner = res.data?.winner;
			if (winner) {
				set((state) => ({
					giveaways: state.giveaways.map((g) =>
						g._id === id
							? {
									...g,
									state: "complete",
									status: "completed",
									winner: {
										_id: winner.id || winner._id,
										kickUsername: winner.kickUsername,
										rainbetUsername: winner.rainbetUsername,
										discordUsername: winner.discordUsername,
									},
							  }
							: g
					),
				}));
			} else {
				await get().fetchGiveaways();
			}
			toast({ title: "Winner drawn successfully" });
		} catch {
			toast({
				title: "Error",
				description: "Failed to draw winner",
				variant: "destructive",
			});
		}
	},
}));
