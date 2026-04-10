import { create } from "zustand";
import axios from "axios";

const ROOBET_API_BASE_URL = "https://luckywdata-production.up.railway.app";

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

interface RoobetStore {
  leaderboard: LeaderboardData | null;
  loading: boolean;
  error: string | null;
  fetchLeaderboard: (startDate: string, endDate: string) => Promise<void>;
  fetchPreviousLeaderboard: (startDate: string, endDate: string) => Promise<void>;
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
  loading: false,
  error: null,

  fetchLeaderboard: async (startDate: string, endDate: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `${ROOBET_API_BASE_URL}/api/leaderboard/${startDate}/${endDate}`
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
      const response = await axios.get(
        `${ROOBET_API_BASE_URL}/api/leaderboard/previous`,
        { params: { startDate, endDate } }
      );

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
