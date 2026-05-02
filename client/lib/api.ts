// Set EXPO_PUBLIC_API_URL in .env.local to your server's Tailscale IP, e.g.:
// EXPO_PUBLIC_API_URL=http://100.x.x.x:8000
const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Entry {
  id: number;
  title: string;
  category: string;
  tags: string;
  body: string;
  created_at: string;
}

export interface EntryCreate {
  title: string;
  category: string;
  tags: string;
  body: string;
}

export interface OracleResult {
  title: string;
  category: string;
  tags: string;
  body: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const getEntries = (): Promise<Entry[]> => request("/entries/");

export const createEntry = (data: EntryCreate): Promise<Entry> =>
  request("/entries/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteEntry = (id: number): Promise<void> =>
  request(`/entries/${id}`, { method: "DELETE" });

export const oracleLookup = (subject: string): Promise<OracleResult> =>
  request("/oracle/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject }),
  });
