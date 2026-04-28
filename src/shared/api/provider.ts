import { request } from "../lib/http";
import type { BookingResponseDto, PaginatedResponse } from "../types/api";

export interface ProviderServiceDto {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  emotionTag: string;
  priceAmount: number;
  currency: string;
  durationMinutes: number;
  capacityDefault: number;
  coverImageUrl: string | null;
  isFeatured: boolean;
  category: { id: string; name: string; slug: string };
  city: { id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSlotDto {
  id: string;
  serviceId: string;
  serviceTitle: string;
  startsAt: string;
  endsAt: string;
  status: "ACTIVE" | "CANCELLED" | "COMPLETED";
  emotionTag: string;
  capacity: number;
  bookedCount: number;
  availableCount: number;
  priceAmount: number;
  currency: string;
  notes: string | null;
}

export interface CreateServicePayload {
  title: string;
  description?: string | null;
  categoryId: string;
  cityId: string;
  emotionTag: string;
  priceAmount: number;
  durationMinutes: number;
  capacityDefault: number;
  status?: "DRAFT" | "ACTIVE";
  coverImageUrl?: string | null;
}

export interface CreateSlotPayload {
  serviceId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  priceAmount: number;
  emotionTag?: string;
  notes?: string;
}

export function listProviderServices() {
  return request<PaginatedResponse<ProviderServiceDto>>("/provider/services", {
    auth: true,
  });
}

export function createProviderService(payload: CreateServicePayload) {
  return request<{ data: ProviderServiceDto }>("/provider/services", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function listProviderSlots() {
  return request<{ success: boolean; data: ProviderSlotDto[] }>("/provider/slots", {
    auth: true,
  }).then((r) => r.data);
}

export function createProviderSlot(payload: CreateSlotPayload) {
  return request<{ success: boolean; data: ProviderSlotDto }>("/provider/slots", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  }).then((r) => r.data);
}

export function listProviderBookingsApi() {
  return request<{ bookings: BookingResponseDto[] }>("/provider/bookings", {
    auth: true,
  });
}
