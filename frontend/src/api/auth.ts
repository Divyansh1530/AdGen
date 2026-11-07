import api from "./axios";
import type { User, RegisterInput, LoginInput, AuthResponse } from "@/types/user";

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/v1/auth/register", {
    name: input.name?.trim() || undefined,
    email: input.email.trim(),
    password: input.password,
  });
  return res.data;
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/v1/auth/login", {
    email: input.email.trim(),
    password: input.password,
  });
  return res.data;
}

export async function getCurrentUser(): Promise<{ success: boolean; data: User }> {
  const res = await api.get<{ success: boolean; data: User }>("/api/v1/auth/me");
  return res.data;
}

export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  const res = await api.post<{ success: boolean; message: string }>("/api/v1/auth/logout");
  return res.data;
}
