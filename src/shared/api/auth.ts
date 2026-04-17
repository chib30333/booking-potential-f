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

export async function logout() {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}
