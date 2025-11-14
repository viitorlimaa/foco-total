// context/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "@/lib/api";

type User = { id: string; email: string; name: string } | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, fetch /api/auth/me to restore session (cookie-based)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (!mounted) return;
        setUser(data.user ?? null);
      } catch (err) {
        console.error("Erro ao restaurar sessão:", err);
        setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data.user ?? null);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        email,
        password,
        name,
      });
      setUser(data.user ?? null);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // For logout, expire the cookie. We can do this by calling an endpoint or by setting cookie client-side.
    // Simples approach: chamar endpoint que remove cookie (a seguir você pode criar /api/auth/logout)
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // fallback: still clear user state
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
