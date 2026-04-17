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
