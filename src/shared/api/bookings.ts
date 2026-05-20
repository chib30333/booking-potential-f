import { request } from "../lib/http";
import type { BookingResponseDto, CreateBookingResponse } from "../types/api";

export function listMyBookings() {
  return request<{ bookings: BookingResponseDto[] }>("/bookings/me", { auth: true });
}

export function getMyBookingById(bookingId: string) {
  return request<{ booking: BookingResponseDto }>(
    `/bookings/${encodeURIComponent(bookingId)}`,
    { auth: true }
  );
}

export function listProviderBookings() {
  return request<{ bookings: BookingResponseDto[] }>("/provider/bookings", { auth: true });
}

export function createBooking(input: { slotId: string; notes?: string }) {
  return request<CreateBookingResponse>("/bookings", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}

export function cancelBooking(bookingId: string, reason?: string) {
  return request<{ booking: BookingResponseDto; refundEligible: boolean }>(
    `/bookings/${encodeURIComponent(bookingId)}/cancel`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({ reason }),
    }
  );
}
