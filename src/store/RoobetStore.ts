import { create } from "zustand";
import axios from "axios";

const API_BASES = [
  "http://localhost:3000",
  "https://luckywdata-production.up.railway.app",
];

interface Player {
  uid: string;
  username: string;
  weightedWagered: number;
  favoriteGameId: string;
  favoriteGameTitle: string;
  rankLevel: number;
}

interface LeaderboardApiPlayer {
  uid?: string;
  username?: string;
  weightedWagered?: number;
  favoriteGameId?: string;
  favoriteGameTitle?: string;
}

interface LeaderboardData {
  disclosure: string;
  data: Player[];
}

interface RoobetStore {
  leaderboard: LeaderboardData | null;
  loading: boolean;
  error: string | null;
  fetchLeaderboard: (type?: "monthly" | "biweekly") => Promise<void>;
}

/* ────────────────────────────────────────────────
   MONTHLY PERIOD  (fixed: Dec 8 → Jan 8)
   ──────────────────────────────────────────────── */
export function getCurrentMonthlyPeriod() {
  const now = new Date();

  const firstStart = new Date(Date.UTC(2025, 0, 9, 0, 0, 0));
  const firstEnd = new Date(Date.UTC(2025, 1, 9, 23, 59, 59));

  let start: Date;
  let endInclusive: Date;

  if (now <= firstEnd) {
    start = firstStart;
    endInclusive = new Date(Date.UTC(2025, 1, 9));
  } else {
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();

    if (day >= 10) {
      start = new Date(Date.UTC(year, month, 10));
      endInclusive = new Date(Date.UTC(year, month + 1, 9));
    } else {
      start = new Date(Date.UTC(year, month - 1, 9));
      endInclusive = new Date(Date.UTC(year, month, 9));
    }
  }

  const apiEnd = new Date(endInclusive);
  apiEnd.setUTCDate(apiEnd.getUTCDate() + 1);

  const format = (d: Date) => d.toISOString().split("T")[0];

  return {
    start: format(start),
    end: format(apiEnd),
  };
}

/* ────────────────────────────────────────────────
   BIWEEKLY PERIOD (rotating every 14 days starting Dec 8)
   ──────────────────────────────────────────────── */
export function getCurrentBiweekly() {
  const startBase = new Date("2024-12-09T00:00:00Z");
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - startBase.getTime()) / (1000 * 60 * 60 * 24));
  const periodIndex = Math.floor(diffDays / 14);

  const start = new Date(startBase);
  start.setDate(start.getDate() + periodIndex * 14);

  const end = new Date(start);
  end.setDate(start.getDate() + 13);

  const format = (d: Date) => d.toISOString().split("T")[0];
  return { start: format(start), end: format(end) };
}

/* ────────────────────────────────────────────────
   ZUSTAND STORE
   ──────────────────────────────────────────────── */
export const useRoobetStore = create<RoobetStore>((set) => ({
  leaderboard: null,
  loading: false,
  error: null,

  fetchLeaderboard: async (type = "biweekly") => {
    set({ loading: true, error: null });

    try {
      const period =
        type === "monthly" ? getCurrentMonthlyPeriod() : getCurrentBiweekly();

      let response = null;
      let lastError: unknown;
      for (const base of API_BASES) {
        try {
          response = await axios.get(
            `${base}/api/leaderboard/${period.start}/${period.end}`,
            { timeout: 8000 }
          );
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!response) {
        throw lastError instanceof Error
          ? lastError
          : new Error("Failed to fetch leaderboard from all API bases");
      }

      if (!response.data || !response.data.data)
        throw new Error("Invalid API response");

      const updated: LeaderboardData = {
        disclosure: response.data.disclosure,
        data: response.data.data.map((p: LeaderboardApiPlayer, i: number) => ({
          uid: p.uid || "",
          username: p.username || "",
          weightedWagered: Number(p.weightedWagered || 0),
          favoriteGameId: p.favoriteGameId || "",
          favoriteGameTitle: p.favoriteGameTitle || "",
          rankLevel: i + 1,
        })),
      };

      set({ leaderboard: updated, loading: false });
    } catch (err: unknown) {
      let msg = "Failed to fetch leaderboard";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) msg = "Too many requests — wait a bit.";
        if (err.response?.status === 500) msg = "Server error — try again later.";
        if (err.code === "ECONNABORTED") msg = "Request timed out.";
      }

      set({ error: msg, loading: false });
    }
  },
}));