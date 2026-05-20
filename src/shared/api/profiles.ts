import { request } from "../lib/http";
import type { CustomerProfileDto, ProviderProfileDto } from "../types/api";

export function getCustomerProfile() {
  return request<{ success: true; data: CustomerProfileDto }>("/customer-profile/me", {
    auth: true,
  }).then((response) => response.data);
}

export function getProviderProfile() {
  return request<{ success: true; data: ProviderProfileDto }>("/providers/me", {
    auth: true,
  }).then((response) => response.data);
}

export interface UpdateProviderProfilePayload {
  brandName?: string;
  bio?: string;
  cityId?: string;
  addressLine?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  includeInJoyMap?: boolean;
}

export function updateProviderProfile(payload: UpdateProviderProfilePayload) {
  return request<{ success: true; data: ProviderProfileDto }>("/providers/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  }).then((response) => response.data);
}

export interface OnboardingPayload {
  age: number;
  cityId: string;
  moodNotes?: string;
  preferredRadiusKm?: number;
  emotionPreferences: Array<{ emotion: string; score: number }>;
}

export function submitCustomerOnboarding(input: OnboardingPayload) {
  return request<{ success: true; data: CustomerProfileDto }>(
    "/customer-profile/onboarding",
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(input),
    }
  ).then((response) => response.data);
}

