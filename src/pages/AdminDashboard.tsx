import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import {
  approveProvider,
  getManagerDashboard,
  listAdminProviders,
  rejectProvider,
} from "@/shared/api/manager";

const KpiCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs uppercase tracking-[0.18em] text-violet-500">{label}</p>
    <p className="mt-2 text-3xl font-bold">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");

  const kpisQuery = useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: getManagerDashboard,
  });

  const providersQuery = useQuery({
    queryKey: ["admin-providers", statusFilter],
    queryFn: () => listAdminProviders(statusFilter || undefined),
  });

  const approve = useMutation({
    mutationFn: approveProvider,
    onSuccess: () => {
      toast.success(t("admin.providerApproved"));
      void queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
      void queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : t("admin.approveFailed")),
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectProvider(id, reason),
    onSuccess: () => {
      toast.success(t("admin.rejected"));
      void queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : t("admin.rejectFailed")),
  });

  const providers = providersQuery.data ?? [];
  const k = kpisQuery.data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-violet-500">
            Manager workspace
          </p>
          <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <KpiCard label="Pending" value={k?.providersPendingApproval ?? t("common.noneDash")} />
          <KpiCard label="Approved" value={k?.approvedProviders ?? t("common.noneDash")} />
          <KpiCard label="Services" value={k?.activeServices ?? t("common.noneDash")} />
          <KpiCard label="Subs" value={k?.activeSubscriptions ?? t("common.noneDash")} />
          <KpiCard label="Bookings" value={k?.upcomingBookings ?? t("common.noneDash")} />
          <KpiCard label="Reviews" value={k?.completedReviews ?? t("common.noneDash")} />
        </div>

        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{t("admin.moderation")}</h2>
            <select
              className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t("admin.filterAll")}</option>
              <option value="PENDING">{t("admin.filterPending")}</option>
              <option value="APPROVED">{t("admin.filterApproved")}</option>
              <option value="REJECTED">{t("admin.filterRejected")}</option>
              <option value="DRAFT">{t("admin.filterDraft")}</option>
              <option value="SUSPENDED">{t("admin.filterBlocked")}</option>
            </select>
          </div>

          {providersQuery.isLoading ? (
            <p className="text-muted-foreground">{t("common.loadingShort")}</p>
          ) : providers.length === 0 ? (
            <p className="text-muted-foreground">{t("admin.noProviders")}</p>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-4 py-3">{t("admin.brand")}</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">{t("admin.city")}</th>
                    <th className="px-4 py-3">{t("admin.status")}</th>
                    <th className="px-4 py-3 text-right">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p) => (
                    <tr key={p.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium">{p.brandName}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p.user?.email ?? t("common.noneDash")}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p.city?.name ?? t("common.noneDash")}
                      </td>
                      <td className="px-4 py-3">{p.approvalStatus}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={approve.isPending}
                            onClick={() => approve.mutate(p.id)}
                            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {t("admin.approve")}
                          </button>
                          <button
                            type="button"
                            disabled={reject.isPending}
                            onClick={() => {
                              const reason = window.prompt(t("admin.rejectReasonPrompt")) || "";
                              if (!reason) return;
                              reject.mutate({ id: p.id, reason });
                            }}
                            className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                          >
                            {t("admin.reject")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
