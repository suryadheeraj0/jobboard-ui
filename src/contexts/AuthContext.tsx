import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role } from "@/lib/api";

interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (u: AuthUser) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

const STORAGE_KEY = "talentbridge_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const login = (u: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    localStorage.setItem("userId", u.userId);
    localStorage.setItem("name", u.name);
    localStorage.setItem("email", u.email);
    localStorage.setItem("role", u.role);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    ["userId", "name", "email", "role"].forEach((k) => localStorage.removeItem(k));
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
