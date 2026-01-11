import { create } from "zustand";
import axios from "axios";

interface Player {
  uid: string;
  username: string;
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
  fetchLeaderboard: (type?: "monthly" | "biweekly") => Promise<void>;
}

/* ────────────────────────────────────────────────
   MONTHLY PERIOD  (fixed: Dec 8 → Jan 8)
   ──────────────────────────────────────────────── */
export function getCurrentMonthlyPeriod() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0 = Jan

  let start: Date;
  let end: Date;

  if (now.getUTCDate() >= 9) {
    // Current cycle: 9 this month → 9 next month
    start = new Date(Date.UTC(year, month, 9));
    end = new Date(Date.UTC(year, month + 1, 9));
  } else {
    // Previous cycle: 9 last month → 9 this month
    start = new Date(Date.UTC(year, month - 1, 9));
    end = new Date(Date.UTC(year, month, 9));
  }

  const format = (d: Date) => d.toISOString().split("T")[0];

  return {
    start: format(start),
    end: format(end),
  };
}


/* ────────────────────────────────────────────────
   BIWEEKLY PERIOD (rotating every 14 days starting Dec 8)
   ──────────────────────────────────────────────── */
export function getCurrentBiweekly() {
  const startBase = new Date("2024-12-09T00:00:00Z"); // Fixed start

  const now = new Date();

  // Days passed since base period
  const diffDays = Math.floor((now.getTime() - startBase.getTime()) / (1000 * 60 * 60 * 24));

  // Determine which 14-day block we're in
  const periodIndex = Math.floor(diffDays / 14);

  const start = new Date(startBase);
  start.setDate(start.getDate() + periodIndex * 14);

  const end = new Date(start);
  end.setDate(start.getDate() + 13);

  const format = (d: Date) => d.toISOString().split("T")[0];
  return { start: format(start), end: format(end) };
}

/* ────────────────────────────────────────────────
   API COOLDOWN
   ──────────────────────────────────────────────── */
let lastFetch = 0;
const COOLDOWN = 60 * 1000;

/* ────────────────────────────────────────────────
   ZUSTAND STORE
   ──────────────────────────────────────────────── */
export const useRoobetStore = create<RoobetStore>((set) => ({
  leaderboard: null,
  loading: false,
  error: null,

  fetchLeaderboard: async (type = "biweekly") => {
    const now = Date.now();
    if (now - lastFetch < COOLDOWN) return;
    lastFetch = now;

    set({ loading: true, error: null });

    try {
      // Select period type
      const period =
        type === "monthly" ? getCurrentMonthlyPeriod() : getCurrentBiweekly();

      const url = `https://luckywdata-production.up.railway.app/api/leaderboard/${period.start}/${period.end}`;

      const response = await axios.get(url, { timeout: 8000 });

      if (!response.data || !response.data.data)
        throw new Error("Invalid API response");

      const updated: LeaderboardData = {
        disclosure: response.data.disclosure,
        data: response.data.data.map((p: any, i: number) => ({
          uid: p.uid,
          username: p.username,
          weightedWagered: p.weightedWagered,
          favoriteGameId: p.favoriteGameId,
          favoriteGameTitle: p.favoriteGameTitle,
          rankLevel: i + 1,
        })),
      };

      set({ leaderboard: updated, loading: false });
    } catch (err: any) {
      let msg = "Failed to fetch leaderboard";
      if (err.response?.status === 429) msg = "Too many requests — wait a bit.";
      if (err.response?.status === 500) msg = "Server error — try again later.";
      if (err.code === "ECONNABORTED") msg = "Request timed out.";

      set({ error: msg, loading: false });
    }
  },
}));
