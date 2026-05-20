import { request } from "../lib/http";

export interface SubscriptionPlanDto {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceAmount: number;
  currency: string;
  intervalMonths: number;
  isActive: boolean;
}

export interface ActiveSubscriptionDto {
  id: string;
  planId: string;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  plan?: SubscriptionPlanDto;
}

export function listSubscriptionPlans() {
  return request<{ success: boolean; data: SubscriptionPlanDto[] }>(
    "/subscriptions/plans"
  ).then((r) => r.data);
}

export function getMyActiveSubscription() {
  return request<{ success: boolean; data: ActiveSubscriptionDto | null }>(
    "/subscriptions/me/active",
    { auth: true }
  ).then((r) => r.data);
}

export function listMySubscriptions() {
  return request<{ success: boolean; data: ActiveSubscriptionDto[] }>(
    "/subscriptions/me",
    { auth: true }
  ).then((r) => r.data);
}

export function cancelMySubscription(immediate = false) {
  return request<{ success: boolean; data: ActiveSubscriptionDto }>(
    "/subscriptions/me/cancel",
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({ immediate }),
    }
  ).then((r) => r.data);
}
