"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { User, AuthContextType } from "./types";
import {
  getCurrentAuth,
  setCurrentAuth,
  createUser as storageCreateUser,
  verifyPassword,
  getUserByEmail,
  initializeStorage,
} from "./storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize storage and restore auth state
    initializeStorage();
    const currentUser = getCurrentAuth();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const isValid = verifyPassword(email, password);
      if (!isValid) {
        throw new Error("Email ou senha inválidos");
      }

      const foundUser = getUserByEmail(email);
      if (!foundUser) {
        throw new Error("Usuário não encontrado");
      }

      setCurrentAuth(foundUser);
      setUser(foundUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        throw new Error("Este email já está registrado");
      }

      const newUser = storageCreateUser(email, password, name);
      setCurrentAuth(newUser);
      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentAuth(null);
    setUser(null);
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
