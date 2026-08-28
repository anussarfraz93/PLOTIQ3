import { Platform } from "react-native";
import { Answers, Match } from "../data/types";
import { insightsLocally, recommendLocally } from "./scoring";

// Web preview (npx expo start --web) runs in the same browser as the
// backend, so localhost works as-is. On a real device, "localhost" means
// the phone itself, not the computer running the backend — so native
// builds default to this machine's LAN IP instead. That IP can change
// (DHCP, a different network) — if the app can't reach the backend, update
// it below (find the current one with `ipconfig`, look for IPv4 Address)
// and make sure the phone is on the same Wi-Fi as the backend. Either way
// the app still works without it: it falls back to computing on-device.
const LAN_BACKEND = "http://192.168.0.200:4000";
export const API_BASE = Platform.OS === "web" ? "http://localhost:4000" : LAN_BACKEND;

export type RecommendResponse = {
  typeLabel: string;
  scaleRange: [number, number];
  matches: Match[];
};

export async function fetchRecommendation(answers: Required<Answers>): Promise<{ data: RecommendResponse; fromBackend: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });
    if (!res.ok) throw new Error(`backend responded ${res.status}`);
    const data = (await res.json()) as RecommendResponse;
    return { data, fromBackend: true };
  } catch {
    // backend unreachable — fall back to the same logic running on-device,
    // so the app keeps working exactly like the standalone artifact did
    return { data: recommendLocally(answers), fromBackend: false };
  }
}

export type InsightsResponse = {
  totalSectors: number;
  byType: ReturnType<typeof insightsLocally>;
};

export async function fetchInsights(): Promise<{ data: InsightsResponse; fromBackend: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/insights`);
    if (!res.ok) throw new Error(`backend responded ${res.status}`);
    const data = (await res.json()) as InsightsResponse;
    return { data, fromBackend: true };
  } catch {
    const byType = insightsLocally();
    return { data: { totalSectors: byType.reduce((s, t) => s + t.count, 0), byType }, fromBackend: false };
  }
}
