/**
 * Central API client.
 * Base URL is read from NEXT_PUBLIC_API_URL env var so it works
 * in both local dev (http://localhost:5000) and production.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

interface RequestOptions extends RequestInit {
  auth?: boolean; // attach JWT if true (default: true for non-GET)
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, headers = {}, ...rest } = options;

  const token = getToken();
  const authHeader: Record<string, string> =
    auth && token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(headers as Record<string, string>),
    },
    ...rest,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ success: boolean; data: { token: string; user: any } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }), auth: false }
    ),

  register: (payload: {
    name: string;
    email: string;
    password: string;
    charityId?: string | null;
    charityContributionPercentage?: number;
  }) =>
    request<{ success: boolean; data: { token: string; user: any } }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(payload), auth: false }
    ),

  getMe: () =>
    request<{ success: boolean; data: { user: any } }>("/api/auth/me"),
};

// ── User / Dashboard ──────────────────────────────────────────────────────────
export const userApi = {
  getDashboard: () =>
    request<{ success: boolean; data: any }>("/api/users/dashboard"),

  updateProfile: (name: string) =>
    request<{ success: boolean; data: any }>("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),
};

// ── Scores ────────────────────────────────────────────────────────────────────
export const scoresApi = {
  getScores: () =>
    request<{ success: boolean; data: { scores: any[] } }>("/api/scores"),

  addScore: (value: number, date: string) =>
    request<{ success: boolean; data: { scores: any[] } }>("/api/scores", {
      method: "POST",
      body: JSON.stringify({ value, date }),
    }),

  editScore: (scoreId: string, value: number, date: string) =>
    request<{ success: boolean; data: { scores: any[] } }>(
      `/api/scores/${scoreId}`,
      { method: "PUT", body: JSON.stringify({ value, date }) }
    ),

  deleteScore: (scoreId: string) =>
    request<{ success: boolean }>(`/api/scores/${scoreId}`, {
      method: "DELETE",
    }),
};

// ── Charities ─────────────────────────────────────────────────────────────────
export const charitiesApi = {
  getAll: (search?: string, featured?: boolean) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (featured) params.set("featured", "true");
    const qs = params.toString();
    return request<{ success: boolean; data: { charities: any[] } }>(
      `/api/charities${qs ? `?${qs}` : ""}`,
      { auth: false }
    );
  },

  getById: (id: string) =>
    request<{ success: boolean; data: { charity: any } }>(
      `/api/charities/${id}`,
      { auth: false }
    ),

  select: (charityId: string, contributionPercentage: number) =>
    request<{ success: boolean }>("/api/charities/select", {
      method: "PUT",
      body: JSON.stringify({ charityId, contributionPercentage }),
    }),
};

// ── Draws ─────────────────────────────────────────────────────────────────────
export const drawsApi = {
  getPublished: (page = 1) =>
    request<{ success: boolean; data: { draws: any[]; total: number } }>(
      `/api/draws?page=${page}`,
      { auth: false }
    ),

  getMyResults: () =>
    request<{ success: boolean; data: { results: any[] } }>(
      "/api/draws/my-results"
    ),

  submitProof: (drawId: string, proofUrl: string) =>
    request<{ success: boolean }>(`/api/draws/${drawId}/verify`, {
      method: "POST",
      body: JSON.stringify({ proofUrl }),
    }),
};

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const subscriptionApi = {
  getStatus: () =>
    request<{ success: boolean; data: any }>("/api/subscriptions/status"),

  createCheckout: (plan: "monthly" | "yearly") =>
    request<{ success: boolean; data: { url: string } }>(
      "/api/subscriptions/checkout",
      { method: "POST", body: JSON.stringify({ plan }) }
    ),

  cancel: () =>
    request<{ success: boolean }>("/api/subscriptions/cancel", {
      method: "POST",
    }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getAnalytics: () =>
    request<{ success: boolean; data: any }>("/api/admin/analytics"),

  getUsers: (page = 1, status?: string) => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set("status", status);
    return request<{ success: boolean; data: any }>(
      `/api/admin/users?${params}`
    );
  },

  getWinners: () =>
    request<{ success: boolean; data: { winners: any[] } }>(
      "/api/admin/winners"
    ),

  verifyWinner: (
    drawId: string,
    winnerId: string,
    status: "approved" | "rejected",
    adminNote?: string
  ) =>
    request<{ success: boolean }>(
      `/api/admin/draws/${drawId}/winners/${winnerId}/verify`,
      { method: "PUT", body: JSON.stringify({ status, adminNote }) }
    ),

  markPaid: (drawId: string, winnerId: string) =>
    request<{ success: boolean }>(
      `/api/admin/draws/${drawId}/winners/${winnerId}/paid`,
      { method: "PUT" }
    ),

  runDraw: (drawType: "random" | "algorithm", isSimulation = false) =>
    request<{ success: boolean; data: { draw: any } }>("/api/draws/run", {
      method: "POST",
      body: JSON.stringify({ drawType, isSimulation }),
    }),

  publishDraw: (drawId: string) =>
    request<{ success: boolean }>(`/api/draws/${drawId}/publish`, {
      method: "POST",
    }),

  createCharity: (payload: any) =>
    request<{ success: boolean; data: { charity: any } }>("/api/charities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateCharity: (id: string, payload: any) =>
    request<{ success: boolean; data: { charity: any } }>(
      `/api/charities/${id}`,
      { method: "PUT", body: JSON.stringify(payload) }
    ),

  deleteCharity: (id: string) =>
    request<{ success: boolean }>(`/api/charities/${id}`, {
      method: "DELETE",
    }),
};
