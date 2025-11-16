import request from "@/utils/request";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  user: User;
}

export const login = (email: string, password: string) =>
  request.post<LoginResponse>("/auth/login", { email, password });

export const register = (name: string, email: string, password: string) =>
  request.post<LoginResponse>("/auth/register", { name, email, password });

export const fetchMe = () =>
  request.get<{ user: User | null }>("/auth/me");

export const logoutRequest = () =>
  request.post("/auth/logout");
