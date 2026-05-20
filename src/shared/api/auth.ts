import { request } from "../lib/http";
import type {
  AuthResponse,
  ForgotPasswordResponse,
  SafeUser,
  UserRole,
} from "../types/api";

export function getMe() {
  return request<{ user: SafeUser }>("/auth/me", { auth: true }).then((response) => response.user);
}

export async function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: Extract<UserRole, "CUSTOMER" | "PROVIDER">;
}) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function forgotPassword(email: string) {
  return request<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(input: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  return request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface UpdateMePayload {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
}

export async function updateMe(input: UpdateMePayload) {
  return request<{ user: SafeUser }>("/auth/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(input),
  }).then((r) => r.user);
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return request<{ message: string }>("/auth/change-password", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}

export async function logout() {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}
