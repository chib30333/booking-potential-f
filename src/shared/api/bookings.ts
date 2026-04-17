import { request } from "../lib/http";
import type { BookingResponseDto } from "../types/api";

export function listMyBookings() {
  return request<{ bookings: BookingResponseDto[] }>("/bookings/me", { auth: true });
}

export function listProviderBookings() {
  return request<{ bookings: BookingResponseDto[] }>("/provider/bookings", { auth: true });
}
