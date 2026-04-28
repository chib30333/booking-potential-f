import { request } from "../lib/http";

export interface ManagerDashboardKpis {
  providersPendingApproval: number;
  approvedProviders: number;
  activeServices: number;
  activeSubscriptions: number;
  upcomingBookings: number;
  completedReviews: number;
}

export interface AdminProviderRow {
  id: string;
  brandName: string;
  approvalStatus: string;
  approvalSubmittedAt: string | null;
  city?: { name: string } | null;
  user?: { email: string } | null;
  totalBookings?: number;
  totalReviews?: number;
}

export function getManagerDashboard() {
  return request<ManagerDashboardKpis>("/manager/dashboard", { auth: true });
}

export function listAdminProviders(status?: string) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  return request<{ items?: AdminProviderRow[]; data?: AdminProviderRow[] } | AdminProviderRow[]>(
    `/manager/admin/providers${q}`,
    { auth: true }
  ).then((r) => {
    if (Array.isArray(r)) return r;
    return r.items ?? r.data ?? [];
  });
}

export function approveProvider(providerId: string) {
  return request<unknown>(`/manager/admin/providers/${providerId}/approve`, {
    method: "POST",
    auth: true,
  });
}

export function rejectProvider(providerId: string, reason?: string) {
  return request<unknown>(`/manager/admin/providers/${providerId}/reject`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({ reason }),
  });
}
