import { create } from "zustand";
import { buildApiUrl } from "@/lib/api";
import { useAuthStore } from "./useAuthStore";

export type TournamentStatus = "upcoming" | "live" | "finished";
export type TournamentFormat = "1v1" | "3v3";

export interface SlotSearchItem {
	name: string;
	slotName: string;
	provider: string;
	image: string;
}

export interface Tournament {
	_id: string;
	name: string;
	format: TournamentFormat;
	slotGameName: string;
	prizeAmount: number;
	maxPlayers: number;
	teamSize?: number;
	teamCount?: number;
	teamNames?: string[];
	winningTeamName?: string | null;
	winningReason?: string | null;
	stealTriggered?: boolean;
	teamResults?: TeamResult[];
	status: TournamentStatus;
	startDate: string;
	joinedPlayers?: number;
	champion?: { kickUsername?: string } | null;
}

export interface TeamResult {
	teamKey: string;
	teamName: string;
	totalMultiplier: number;
	highestMultiplier: number;
	highestMultiplierPlayerId?: string | null;
}

export interface TournamentPlayer {
	_id: string;
	position: number;
	teamKey?: string | null;
	slotName: string;
	slotDisplayName: string;
	provider: string;
	slotImage: string;
	multiplier?: number | null;
	isEliminated?: boolean;
	userId?: { _id?: string; kickUsername?: string } | string;
}

export interface TournamentMatch {
	_id: string;
	roundNumber: number;
	matchNumber: number;
	player1?: TournamentPlayer | null;
	player2?: TournamentPlayer | null;
	winner?: TournamentPlayer | null;
	multiplier1?: number | null;
	multiplier2?: number | null;
	status: "pending" | "completed";
}

export interface TournamentHistoryItem {
	_id: string;
	tournamentId?: string;
	name: string;
	format?: TournamentFormat;
	slotGameName?: string;
	prizeAmount: number;
	maxPlayers: number;
	teamSize?: number;
	teamCount?: number;
	teamNames?: string[];
	winningTeamName?: string | null;
	winningReason?: string | null;
	stealTriggered?: boolean;
	teamResults?: TeamResult[];
	startDate?: string;
	finishedAt: string;
	championKickUsername?: string | null;
	championUserId?: { kickUsername?: string } | null;
	players?: Array<{
		id?: string;
		userId?: string;
		kickUsername?: string | null;
		position: number;
		teamKey?: string | null;
		slotName: string;
		slotDisplayName: string;
		provider: string;
		slotImage: string;
		multiplier?: number | null;
		isEliminated?: boolean;
		eliminatedInRound?: number | null;
	}>;
	historyMatchPlayerRef?: never;
	matches?: Array<{
		id?: string;
		roundNumber: number;
		matchNumber: number;
		player1?:
			| string
			| {
					_id?: string;
					id?: string;
					position?: number;
					slotName?: string;
					slotDisplayName?: string;
					slotImage?: string;
					kickUsername?: string;
					userId?: { kickUsername?: string };
			  }
			| null;
		player2?:
			| string
			| {
					_id?: string;
					id?: string;
					position?: number;
					slotName?: string;
					slotDisplayName?: string;
					slotImage?: string;
					kickUsername?: string;
					userId?: { kickUsername?: string };
			  }
			| null;
		winner?:
			| string
			| {
					_id?: string;
					id?: string;
					position?: number;
					slotName?: string;
					slotDisplayName?: string;
					slotImage?: string;
					kickUsername?: string;
					userId?: { kickUsername?: string };
			  }
			| null;
		multiplier1?: number | null;
		multiplier2?: number | null;
		status?: "pending" | "completed";
	}>;
}

interface TournamentDetailsPayload {
	tournament: Tournament;
	players: TournamentPlayer[];
	matches: TournamentMatch[];
}

interface CreateTournamentPayload {
	name: string;
	slotGameName: string;
	prizeAmount: number;
	maxPlayers: number;
	format: TournamentFormat;
	teamCount?: number;
	startDate: string;
}

interface JoinTournamentPayload {
	position: number;
	slotName: string;
	slotDisplayName: string;
	provider: string;
	slotImage: string;
}

interface SubmitResultPayload {
	multiplier1: number;
	multiplier2: number;
}

interface SubmitTeamResultsPayload {
	results: Array<{
		playerId: string;
		multiplier: number;
	}>;
}

interface TournamentState {
	tournaments: Tournament[];
	history: TournamentHistoryItem[];
	tournamentDetails: TournamentDetailsPayload | null;
	slotSearchResults: SlotSearchItem[];
	isLoading: boolean;

	fetchTournaments: () => Promise<void>;
	fetchTournamentById: (id: string) => Promise<void>;
	fetchHistory: () => Promise<void>;
	searchSlots: (query: string) => Promise<void>;
	clearSlotSearch: () => void;
	createTournament: (payload: CreateTournamentPayload) => Promise<void>;
	joinTournament: (tournamentId: string, payload: JoinTournamentPayload) => Promise<void>;
	startTournament: (tournamentId: string) => Promise<void>;
	submitMatchResult: (matchId: string, payload: SubmitResultPayload) => Promise<void>;
	submitTeamResults: (tournamentId: string, payload: SubmitTeamResultsPayload) => Promise<void>;
	deleteTournament: (tournamentId: string) => Promise<void>;
}

const getAuthHeaders = () => {
	const token = useAuthStore.getState().token;
	return {
		"Content-Type": "application/json",
		Authorization: token ? `Bearer ${token}` : "",
	};
};

const request = async (path: string, options: RequestInit = {}) => {
	const res = await fetch(buildApiUrl(path), options);
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.message || `Request failed: ${res.status}`);
	}

	return res.json();
};

export const useTournamentStore = create<TournamentState>((set, get) => ({
	tournaments: [],
	history: [],
	tournamentDetails: null,
	slotSearchResults: [],
	isLoading: false,

	fetchTournaments: async () => {
		set({ isLoading: true });
		try {
			const data = await request(`/api/tournaments`);
			set({ tournaments: data.data || [] });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTournamentById: async (id) => {
		set({ isLoading: true });
		try {
			const data = await request(`/api/tournaments/${id}`);
			set({ tournamentDetails: data });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchHistory: async () => {
		set({ isLoading: true });
		try {
			const data = await request(`/api/tournaments/history`);
			set({ history: data.data || [] });
		} finally {
			set({ isLoading: false });
		}
	},

	searchSlots: async (query) => {
		const trimmed = query.trim();
		if (trimmed.length < 2) {
			set({ slotSearchResults: [] });
			return;
		}
		const data = await request(
			`/api/slots/search?q=${encodeURIComponent(trimmed)}`
		);
		set({ slotSearchResults: data.data || [] });
	},

	clearSlotSearch: () => set({ slotSearchResults: [] }),

	createTournament: async (payload) => {
		await request(`/api/tournaments`, {
			method: "POST",
			headers: getAuthHeaders(),
			body: JSON.stringify(payload),
		});
		await get().fetchTournaments();
	},

	joinTournament: async (tournamentId, payload) => {
		await request(`/api/tournaments/${tournamentId}/join`, {
			method: "POST",
			headers: getAuthHeaders(),
			body: JSON.stringify(payload),
		});
		await get().fetchTournamentById(tournamentId);
		await get().fetchTournaments();
	},

	startTournament: async (tournamentId) => {
		await request(`/api/tournaments/${tournamentId}/start`, {
			method: "PATCH",
			headers: getAuthHeaders(),
		});
		await get().fetchTournamentById(tournamentId);
		await get().fetchTournaments();
	},

	submitMatchResult: async (matchId, payload) => {
		await request(`/api/matches/${matchId}/result`, {
			method: "POST",
			headers: getAuthHeaders(),
			body: JSON.stringify(payload),
		});
		const details = get().tournamentDetails;
		if (details?.tournament?._id) {
			await get().fetchTournamentById(details.tournament._id);
			await get().fetchTournaments();
		}
	},

	submitTeamResults: async (tournamentId, payload) => {
		await request(`/api/tournaments/${tournamentId}/team-results`, {
			method: "POST",
			headers: getAuthHeaders(),
			body: JSON.stringify(payload),
		});
		await get().fetchTournamentById(tournamentId);
		await get().fetchTournaments();
	},

	deleteTournament: async (tournamentId) => {
		await request(`/api/tournaments/${tournamentId}`, {
			method: "DELETE",
			headers: getAuthHeaders(),
		});
		await get().fetchTournaments();
	},
}));
