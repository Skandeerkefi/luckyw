import { create } from "zustand";
import axios from "axios";

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

interface RoobetStore {
  leaderboard: LeaderboardData | null;
  loading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
}

// Prevent spamming API
let lastFetchTime = 0;
const FETCH_COOLDOWN = 60 * 1000; // 1 minute

// Current biweekly period (hardcoded for now)
const CURRENT_BIWEEKLY = {
  start: "2025-11-24",
  end: "2025-12-07",
};

export const useRoobetStore = create<RoobetStore>((set) => ({
  leaderboard: null,
  loading: false,
  error: null,

  fetchLeaderboard: async () => {
    const now = Date.now();
    if (now - lastFetchTime < FETCH_COOLDOWN) return;
    lastFetchTime = now;

    set({ loading: true, error: null });

    try {
      const url = `https://tacodata-production.up.railway.app/api/leaderboard/${CURRENT_BIWEEKLY.start}/${CURRENT_BIWEEKLY.end}`;
      const response = await axios.get(url, { timeout: 8000 });

      if (!response.data || !response.data.data) {
        throw new Error("Invalid API response format");
      }

      const updatedData: LeaderboardData = {
        disclosure: response.data.disclosure,
        data: response.data.data.map((player: any, index: number) => ({
          uid: player.uid,
          username: player.username,
          wagered: player.wagered,
          weightedWagered: player.weightedWagered,
          favoriteGameId: player.favoriteGameId,
          favoriteGameTitle: player.favoriteGameTitle,
          rankLevel: index + 1,
        })),
      };

      set({ leaderboard: updatedData, loading: false });
    } catch (err: any) {
      let message = "Failed to fetch leaderboard";

      if (err.response?.status === 429) message = "Too many requests — please wait a minute.";
      else if (err.response?.status === 500) message = "Server error — try again later.";
      else if (err.code === "ECONNABORTED") message = "Request timed out — server slow.";

      set({ error: message, loading: false });
    }
  },
}));

export function getCurrentBiweekly() {
  return CURRENT_BIWEEKLY;
}
