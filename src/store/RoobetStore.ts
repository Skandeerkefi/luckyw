import { create } from "zustand";
import axios from "axios";
import { buildApiUrl } from "@/lib/api";

interface Player {
  uid: string;
  username: string;
  wagered: number;
  weightedWagered: number;
  favoriteGameId: string;
  favoriteGameTitle: string;
  rankLevel: number;
}

interface LeaderboardData {
  disclosure: string;
  data: Player[];
}

interface LeaderboardApiPlayer {
  uid: string;
  username: string;
  wagered: number;
  weightedWagered: number;
  favoriteGameId: string;
  favoriteGameTitle: string;
}

interface LeaderboardApiResponse {
  disclosure: string;
  data: LeaderboardApiPlayer[];
}

interface PrizeSplitEntry {
  rank: number;
  amount: number;
}

interface LeaderboardWindowConfig {
  startDate: string;
  endDate: string;
  prizeSplit: PrizeSplitEntry[];
}

interface LeaderboardConfigResponse {
  current: LeaderboardWindowConfig;
  previous: LeaderboardWindowConfig;
  updatedAt?: string | null;
}

interface RoobetStore {
  currentLeaderboard: LeaderboardData | null;
  previousLeaderboard: LeaderboardData | null;
  leaderboardConfig: LeaderboardConfigResponse | null;
  currentLoading: boolean;
  previousLoading: boolean;
  currentError: string | null;
  previousError: string | null;
  fetchLeaderboard: (startDate: string, endDate: string) => Promise<void>;
  fetchPreviousLeaderboard: (startDate: string, endDate: string) => Promise<void>;
  fetchLeaderboardConfig: () => Promise<LeaderboardConfigResponse | null>;
}

function mapLeaderboardData(response: LeaderboardApiResponse): LeaderboardData {
  return {
    disclosure: response.disclosure,
    data: response.data.map((player, index) => ({
      uid: player.uid,
      username: player.username,
      wagered: player.wagered,
      weightedWagered: player.weightedWagered,
      favoriteGameId: player.favoriteGameId,
      favoriteGameTitle: player.favoriteGameTitle,
      rankLevel: index + 1,
    })),
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export const useRoobetStore = create<RoobetStore>((set) => ({
  currentLeaderboard: null,
  previousLeaderboard: null,
  leaderboardConfig: null,
  currentLoading: false,
  previousLoading: false,
  currentError: null,
  previousError: null,

  fetchLeaderboardConfig: async () => {
    try {
      const response = await axios.get(buildApiUrl("/api/leaderboard/config"));

      const config = response.data as LeaderboardConfigResponse;
      set({ leaderboardConfig: config });
      return config;
    } catch (err: unknown) {
      set({ currentError: getErrorMessage(err, "Failed to fetch leaderboard config") });
      return null;
    }
  },

  fetchLeaderboard: async (startDate: string, endDate: string) => {
    set({ currentLoading: true, currentError: null });

    try {
      const response = await axios.get(
        buildApiUrl(`/api/leaderboard/${startDate}/${endDate}`)
      );

      const updatedData = mapLeaderboardData(
        response.data as LeaderboardApiResponse
      );

      set({ currentLeaderboard: updatedData, currentLoading: false });
    } catch (err: unknown) {
      set({
        currentError: getErrorMessage(err, "Failed to fetch leaderboard"),
        currentLoading: false,
      });
    }
  },

  fetchPreviousLeaderboard: async (startDate: string, endDate: string) => {
    set({ previousLoading: true, previousError: null });

    try {
      const response = await axios.get(buildApiUrl("/api/leaderboard/previous"), { params: { startDate, endDate } });

      const updatedData = mapLeaderboardData(
        response.data as LeaderboardApiResponse
      );

      set({ previousLeaderboard: updatedData, previousLoading: false });
    } catch (err: unknown) {
      set({
        previousError: getErrorMessage(err, "Failed to fetch previous leaderboard"),
        previousLoading: false,
      });
    }
  },
}));
