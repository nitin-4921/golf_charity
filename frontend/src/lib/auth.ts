// Simple client-side auth helpers

export interface StoredUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  subscriptionStatus: string;
  subscriptionPlan: string | null;
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = (): boolean => !!getToken();

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
