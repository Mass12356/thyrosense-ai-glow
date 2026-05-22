import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, registerUser } from "@/lib/api";
import type { AuthResponse, AuthUser, UserProfile } from "@/lib/types";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as { role?: string; userId?: string };
  } catch {
    return null;
  }
};

const mapProfileToAuthUser = (profile: UserProfile, fallbackRole: string | undefined): AuthUser => ({
  id: (profile as any)._id || "",
  name: profile.name || "",
  email: profile.email || "",
  role: profile.role || fallbackRole || "user"
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = parseToken(token);
      try {
        const profile = await getMe();
        setUser(mapProfileToAuthUser(profile, decoded?.role));
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [token]);

  const handleAuth = (payload: AuthResponse) => {
    localStorage.setItem("token", payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (email: string, password: string) => {
    const payload = await loginUser({ email, password });
    handleAuth(payload);
  };

  const register = async (name: string, email: string, password: string) => {
    const payload = await registerUser({ name, email, password });
    handleAuth(payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    loading,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}