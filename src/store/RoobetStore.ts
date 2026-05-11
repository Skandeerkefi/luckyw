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
  leaderboard: LeaderboardData | null;
  leaderboardConfig: LeaderboardConfigResponse | null;
  loading: boolean;
  error: string | null;
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
  leaderboard: null,
  leaderboardConfig: null,
  loading: false,
  error: null,

  fetchLeaderboardConfig: async () => {
    try {
      const response = await axios.get(buildApiUrl("/api/leaderboard/config"));

      const config = response.data as LeaderboardConfigResponse;
      set({ leaderboardConfig: config });
      return config;
    } catch (err: unknown) {
      set({ error: getErrorMessage(err, "Failed to fetch leaderboard config") });
      return null;
    }
  },

  fetchLeaderboard: async (startDate: string, endDate: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        buildApiUrl(`/api/leaderboard/${startDate}/${endDate}`)
      );

      const updatedData = mapLeaderboardData(
        response.data as LeaderboardApiResponse
      );

      set({ leaderboard: updatedData, loading: false });
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err, "Failed to fetch leaderboard"),
        loading: false,
      });
    }
  },

  fetchPreviousLeaderboard: async (startDate: string, endDate: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(buildApiUrl("/api/leaderboard/previous"), { params: { startDate, endDate } });

      const updatedData = mapLeaderboardData(
        response.data as LeaderboardApiResponse
      );

      set({ leaderboard: updatedData, loading: false });
    } catch (err: unknown) {
      set({
        error: getErrorMessage(err, "Failed to fetch previous leaderboard"),
        loading: false,
      });
    }
  },
}));
