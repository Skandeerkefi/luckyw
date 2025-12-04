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

// ───────────────────────────────
// AUTO BIWEEKLY PERIOD GENERATOR
// ───────────────────────────────
function getBiweeklyPeriod() {
  const MS_IN_DAY = 24 * 60 * 60 * 1000;

  // Your fixed reference biweekly start date
  const referenceStart = new Date("2025-11-24T00:00:00Z");
  const now = new Date();

  const diffDays = Math.floor((now.getTime() - referenceStart.getTime()) / MS_IN_DAY);

  // How many complete 14-day cycles passed since reference date
  const periodsPassed = Math.floor(diffDays / 14);

  // Current cycle start = reference + (periodsPassed * 14 days)
  const currentStart = new Date(referenceStart.getTime() + periodsPassed * 14 * MS_IN_DAY);

  // End = start + 14 days
  const currentEnd = new Date(currentStart.getTime() + 14 * MS_IN_DAY);

  const format = (d: Date) => d.toISOString().split("T")[0];

  return {
    start: format(currentStart),
    end: format(currentEnd),
  };
}

// Cooldown (to prevent hammering your backend)
let lastFetchTime = 0;
const FETCH_COOLDOWN = 60 * 1000; // 1 minute

// ───────────────────────────────
// ZUSTAND STORE
// ───────────────────────────────
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
      const period = getBiweeklyPeriod();

      const url = `https://luckywdata-production.up.railway.app/api/leaderboard/${period.start}/${period.end}`;

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

// Optional export so you can show period on the UI
export function getCurrentBiweekly() {
  return getBiweeklyPeriod();
}
