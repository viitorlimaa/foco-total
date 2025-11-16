"use client";

import React, { createContext, useContext } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { login, register, fetchMe, logoutRequest, User } from "@/services/auth";
import { queryClient } from "@/utils/QueryClient";
import { AxiosResponse } from "axios";

const QueryKeys = {
    me: ["me"] as const,
}

type loginMutation = UseMutationResult<User, Error, { email: string; password: string; }, unknown>

type registerMutation = UseMutationResult<User, Error, { name: string; email: string; password: string; }, unknown>

type logoutMutation = UseMutationResult<AxiosResponse<unknown, any, {}>, Error, void, unknown>

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginMutation: loginMutation;
  registerMutation: registerMutation;
  logoutMutation: logoutMutation;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: QueryKeys.me,
    queryFn: async () => {
      const res = await fetchMe();
      return res.data.user;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await login(email, password);
      return res.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(QueryKeys.me, user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const res = await register(name, email, password);
      return res.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(QueryKeys.me, user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => logoutRequest(),
    onSuccess: () => {
      queryClient.setQueryData(QueryKeys.me, null);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        isLoading,
        loginMutation,
        registerMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
