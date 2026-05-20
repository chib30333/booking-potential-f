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

export type UpdateServicePayload = Partial<CreateServicePayload>;

export function updateProviderService(id: string, payload: UpdateServicePayload) {
  return request<{ data: ProviderServiceDto }>(
    `/provider/services/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    }
  );
}

export function updateProviderServiceStatus(
  id: string,
  status: ProviderServiceDto["status"]
) {
  return request<{ data: ProviderServiceDto }>(
    `/provider/services/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ status }),
    }
  );
}

export function archiveProviderService(id: string) {
  return request<{ data: ProviderServiceDto }>(
    `/provider/services/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      auth: true,
    }
  );
}

export interface UpdateSlotPayload {
  startsAt?: string;
  endsAt?: string;
  capacity?: number;
  priceAmount?: number;
  emotionTag?: string;
  notes?: string | null;
}

export function updateProviderSlot(slotId: string, payload: UpdateSlotPayload) {
  return request<{ success: boolean; data: ProviderSlotDto }>(
    `/provider/slots/${encodeURIComponent(slotId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    }
  ).then((r) => r.data);
}

export function cancelProviderSlot(slotId: string) {
  return request<{ success: boolean; data: ProviderSlotDto }>(
    `/provider/slots/${encodeURIComponent(slotId)}/cancel`,
    {
      method: "POST",
      auth: true,
    }
  ).then((r) => r.data);
}

export interface ProviderAnalyticsOverview {
  kpis: {
    bookingsCount: number;
    confirmedBookingsCount: number;
    completedBookingsCount: number;
    cancelledBookingsCount: number;
    revenueMinor: number;
    refundsMinor: number;
    netRevenueMinor: number;
    averageRating: number;
    fillRatePercent: number;
  };
  revenueSeries: Array<{ date: string; revenueMinor: number }>;
  bookingStatusBreakdown: Array<{ status: string; count: number }>;
  topServices: Array<{
    serviceId: string;
    title: string;
    bookingsCount: number;
    revenueMinor: number;
    averageRating: number;
  }>;
  projection: { next30DaysRevenueMinor: number; method: string };
}

export function getProviderAnalyticsOverview(params?: {
  dateFrom?: string;
  dateTo?: string;
}) {
  const query = new URLSearchParams();
  if (params?.dateFrom) query.set("dateFrom", params.dateFrom);
  if (params?.dateTo) query.set("dateTo", params.dateTo);
  const qs = query.toString();
  return request<{ success: boolean; data: ProviderAnalyticsOverview }>(
    `/providers/me/analytics/overview${qs ? `?${qs}` : ""}`,
    { auth: true }
  ).then((r) => r.data);
}
