import { request } from "../lib/http";
import type { CheckoutUrlResponse } from "../types/api";

export type PaymentProvider = "STRIPE" | "YOOKASSA";

export function createBookingCheckout(bookingId: string, provider: PaymentProvider) {
  return request<CheckoutUrlResponse>(
    `/payments/bookings/${encodeURIComponent(bookingId)}/checkout`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({ provider }),
    }
  );
}

export function createSubscriptionCheckout(planCode: string, provider: PaymentProvider) {
  return request<CheckoutUrlResponse>("/payments/subscriptions/checkout", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ planCode, provider }),
  });
}
