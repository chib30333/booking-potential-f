import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Activity, BarChart3, CheckCircle2, MapPin, Settings2, Star, Trash2, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  archiveProviderService,
  cancelProviderSlot,
  createProviderService,
  createProviderSlot,
  getProviderAnalyticsOverview,
  listProviderBookingsApi,
  listProviderServices,
  listProviderSlots,
  updateProviderServiceStatus,
  type CreateServicePayload,
  type CreateSlotPayload,
  type ProviderServiceDto,
} from "@/shared/api/provider";
import { getProviderProfile, updateProviderProfile } from "@/shared/api/profiles";
import { getReferenceData } from "@/shared/api/reference-data";

const formatDateTimeLocal = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatPrice = (amountMinor: number, currency: string) => {
  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amountMinor / 100);
  } catch {
    return `${amountMinor / 100} ${currency}`;
  }
};

const statusBadge = (status: ProviderServiceDto["status"]) => {
  const map: Record<string, string> = {
    DRAFT: "bg-amber-100 text-amber-700",
    ACTIVE: "bg-emerald-100 text-emerald-700",
    INACTIVE: "bg-slate-200 text-slate-700",
    ARCHIVED: "bg-rose-100 text-rose-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
};

const ServiceForm = ({
  cities,
  categories,
}: {
  cities: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateServicePayload>({
    title: "",
    description: "",
    categoryId: categories[0]?.id ?? "",
    cityId: cities[0]?.id ?? "",
    emotionTag: "CALM",
    priceAmount: 5000,
    durationMinutes: 60,
    capacityDefault: 8,
    status: "DRAFT",
  });

  const create = useMutation({
    mutationFn: createProviderService,
    onSuccess: () => {
      toast.success(t("providerDashboard.serviceCreated"));
      void queryClient.invalidateQueries({ queryKey: ["provider-services"] });
      setForm((f) => ({ ...f, title: "", description: "" }));
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : t("providerDashboard.serviceCreateFailed")),
  });

  return (
    <form
      className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.title || !form.cityId || !form.categoryId) {
          toast.error(t("providerDashboard.fillRequired"));
          return;
        }
        create.mutate({ ...form, priceAmount: Number(form.priceAmount) * 100 });
      }}
    >
      <h3 className="text-lg font-semibold">{t("providerDashboard.createService")}</h3>

      <input
        className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        placeholder={t("providerDashboard.titlePlaceholder")}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        placeholder={t("providerDashboard.description")}
        rows={3}
        value={form.description ?? ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="grid gap-3 md:grid-cols-2">
        <select
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          value={form.cityId}
          onChange={(e) => setForm({ ...form, cityId: e.target.value })}
        >
          <option value="">{t("common.city")}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">{t("providerDashboard.category")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          value={form.emotionTag}
          onChange={(e) => setForm({ ...form, emotionTag: e.target.value })}
        >
          {[
            "CALM",
            "JOY",
            "ENERGY",
            "RECOVERY",
            "FOCUS",
            "BALANCE",
            "CONFIDENCE",
            "RELAX",
            "SOCIAL",
            "MINDFULNESS",
          ].map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder={t("providerDashboard.priceRub")}
          value={form.priceAmount}
          onChange={(e) =>
            setForm({ ...form, priceAmount: Number(e.target.value) || 0 })
          }
        />
        <input
          type="number"
          min={15}
          step={15}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder={t("providerDashboard.durationMin")}
          value={form.durationMinutes}
          onChange={(e) =>
            setForm({ ...form, durationMinutes: Number(e.target.value) || 60 })
          }
        />
        <input
          type="number"
          min={1}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder={t("providerDashboard.seats")}
          value={form.capacityDefault}
          onChange={(e) =>
            setForm({ ...form, capacityDefault: Number(e.target.value) || 1 })
          }
        />
      </div>

      <button
        type="submit"
        disabled={create.isPending}
        className="w-full rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {create.isPending ? t("common.creating") : t("providerDashboard.createService")}
      </button>
    </form>
  );
};

const SlotForm = ({
  services,
}: {
  services: Array<{ id: string; title: string; capacityDefault: number; priceAmount: number }>;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d;
  }, []);
  const [form, setForm] = useState<CreateSlotPayload>({
    serviceId: services[0]?.id ?? "",
    startsAt: tomorrow.toISOString(),
    endsAt: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(),
    capacity: services[0]?.capacityDefault ?? 8,
    priceAmount: services[0]?.priceAmount ?? 5000,
  });

  const create = useMutation({
    mutationFn: createProviderSlot,
    onSuccess: () => {
      toast.success(t("providerDashboard.slotCreated"));
      void queryClient.invalidateQueries({ queryKey: ["provider-slots"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : t("providerDashboard.slotCreateFailed")),
  });

  if (services.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-muted-foreground">
        {t("providerDashboard.createServiceFirst")}
      </div>
    );
  }

  return (
    <form
      className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate(form);
      }}
    >
      <h3 className="text-lg font-semibold">{t("providerDashboard.addSlot")}</h3>

      <select
        className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        value={form.serviceId}
        onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
      >
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          {t("providerDashboard.startTime")}
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
            value={formatDateTimeLocal(new Date(form.startsAt))}
            onChange={(e) =>
              setForm({
                ...form,
                startsAt: new Date(e.target.value).toISOString(),
              })
            }
          />
        </label>
        <label className="text-sm">
          {t("providerDashboard.endTime")}
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
            value={formatDateTimeLocal(new Date(form.endsAt))}
            onChange={(e) =>
              setForm({
                ...form,
                endsAt: new Date(e.target.value).toISOString(),
              })
            }
          />
        </label>
        <input
          type="number"
          min={1}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder={t("providerDashboard.seatsShort")}
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: Number(e.target.value) || 1 })
          }
        />
        <input
          type="number"
          min={1}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          placeholder={t("providerDashboard.priceKopecks")}
          value={form.priceAmount}
          onChange={(e) =>
            setForm({ ...form, priceAmount: Number(e.target.value) || 1 })
          }
        />
      </div>

      <button
        type="submit"
        disabled={create.isPending}
        className="w-full rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {create.isPending ? t("common.creating") : t("providerDashboard.addSlot")}
      </button>
    </form>
  );
};

const AnalyticsPanel = () => {
  const { t } = useTranslation();
  const analyticsQuery = useQuery({
    queryKey: ["provider-analytics"],
    queryFn: () => getProviderAnalyticsOverview(),
  });

  if (analyticsQuery.isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-muted-foreground">
        {t("providerDashboard.loadingAnalytics")}
      </div>
    );
  }
  if (analyticsQuery.isError || !analyticsQuery.data) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        {t("providerDashboard.analyticsFailed")}
      </div>
    );
  }
  const a = analyticsQuery.data;
  const currency = "RUB";

  const tiles = [
    { label: t("providerDashboard.bookings"), value: a.kpis.bookingsCount, icon: Activity, color: "text-violet-600" },
    { label: t("providerDashboard.confirmed"), value: a.kpis.confirmedBookingsCount, icon: CheckCircle2, color: "text-emerald-600" },
    { label: t("providerDashboard.revenue"), value: formatPrice(a.kpis.netRevenueMinor, currency), icon: BarChart3, color: "text-blue-600" },
    { label: t("providerDashboard.rating"), value: a.kpis.averageRating ? a.kpis.averageRating.toFixed(1) : t("common.noneDash"), icon: Star, color: "text-amber-500" },
    { label: t("providerDashboard.occupancy"), value: `${a.kpis.fillRatePercent}%`, icon: MapPin, color: "text-rose-500" },
  ];

  const maxRevenue = Math.max(1, ...a.revenueSeries.map((p) => p.revenueMinor));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <tile.icon className={`w-5 h-5 ${tile.color}`} />
            <p className="mt-2 text-xl font-semibold">{tile.value}</p>
            <p className="text-xs text-muted-foreground">{tile.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">{t("providerDashboard.revenuePeriod")}</h3>
          <span className="text-xs text-muted-foreground">
            {t("providerDashboard.forecast30")}{formatPrice(a.projection.next30DaysRevenueMinor, currency)}
          </span>
        </div>
        {a.revenueSeries.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("providerDashboard.noPeriodData")}</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {a.revenueSeries.map((p) => (
              <div
                key={p.date}
                title={`${p.date}: ${formatPrice(p.revenueMinor, currency)}`}
                className="flex-1 rounded-t-md bg-gradient-to-t from-violet-500 to-violet-300"
                style={{ height: `${(p.revenueMinor / maxRevenue) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {a.topServices.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold">{t("providerDashboard.topServices")}</h3>
          <ul className="divide-y divide-slate-100 text-sm">
            {a.topServices.slice(0, 5).map((s) => (
              <li key={s.serviceId} className="flex items-center justify-between py-2">
                <span className="font-medium">{s.title}</span>
                <span className="text-xs text-muted-foreground">
                  {s.bookingsCount} {t("providerDashboard.bookingsShort")}{formatPrice(s.revenueMinor, currency)}
                  {s.averageRating ? ` · ★ ${s.averageRating.toFixed(1)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

const JoyMapToggle = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["provider-profile"],
    queryFn: getProviderProfile,
  });

  const toggle = useMutation({
    mutationFn: (next: boolean) => updateProviderProfile({ includeInJoyMap: next }),
    onSuccess: (data) => {
      toast.success(
        data.includeInJoyMap
          ? t("providerDashboard.willJoinJoyMap")
          : t("providerDashboard.excludedFromJoyMap")
      );
      void queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : t("providerDashboard.settingUpdateFailed")),
  });

  const enabled = profileQuery.data?.includeInJoyMap ?? false;

  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold">{t("providerDashboard.joinJoyMap")}</h3>
        <p className="text-xs text-muted-foreground">
          {t("providerDashboard.joinJoyMapHint")}
        </p>
      </div>
      <button
        onClick={() => toggle.mutate(!enabled)}
        disabled={toggle.isPending || profileQuery.isLoading}
        className={`relative h-7 w-14 rounded-full transition-colors disabled:opacity-60 ${enabled ? "bg-violet-500" : "bg-slate-300"}`}
        aria-pressed={enabled}
      >
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
          style={{ left: enabled ? "calc(100% - 24px)" : "4px", transition: "left 0.15s" }}
        />
      </button>
    </div>
  );
};

const ServicesGrid = ({ services }: { services: ProviderServiceDto[] }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProviderServiceDto["status"] }) =>
      updateProviderServiceStatus(id, status),
    onSuccess: () => {
      toast.success(t("providerDashboard.statusUpdated"));
      void queryClient.invalidateQueries({ queryKey: ["provider-services"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : t("common.error")),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveProviderService,
    onSuccess: () => {
      toast.success(t("providerDashboard.serviceArchived"));
      void queryClient.invalidateQueries({ queryKey: ["provider-services"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : t("common.error")),
  });

  if (services.length === 0) {
    return <p className="text-muted-foreground">{t("providerDashboard.noServices")}</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <div key={s.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusBadge(s.status)}`}>
              {s.status}
            </span>
            <span className="text-xs text-violet-500">{s.emotionTag}</span>
          </div>
          <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
          <p className="text-sm text-muted-foreground">
            {s.category.name} · {s.city.name}
          </p>
          <p className="mt-2 text-sm font-semibold">
            {formatPrice(s.priceAmount, s.currency)} · {s.durationMinutes} {t("providerDashboard.min")}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {s.status === "DRAFT" ? (
              <button
                onClick={() => statusMutation.mutate({ id: s.id, status: "ACTIVE" })}
                disabled={statusMutation.isPending}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
              >
                <CheckCircle2 className="w-3 h-3" /> {t("providerDashboard.publish")}
              </button>
            ) : null}
            {s.status === "ACTIVE" ? (
              <button
                onClick={() => statusMutation.mutate({ id: s.id, status: "INACTIVE" })}
                disabled={statusMutation.isPending}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-60"
              >
                <Settings2 className="w-3 h-3" /> {t("providerDashboard.hide")}
              </button>
            ) : null}
            {s.status === "INACTIVE" ? (
              <button
                onClick={() => statusMutation.mutate({ id: s.id, status: "ACTIVE" })}
                disabled={statusMutation.isPending}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
              >
                <CheckCircle2 className="w-3 h-3" /> {t("providerDashboard.activate")}
              </button>
            ) : null}
            {s.status !== "ARCHIVED" ? (
              <button
                onClick={() => {
                  if (confirm(`${t("providerDashboard.archive")} "${s.title}"?`)) archiveMutation.mutate(s.id);
                }}
                disabled={archiveMutation.isPending}
                className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
              >
                <Trash2 className="w-3 h-3" /> {t("providerDashboard.archived")}
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProviderDashboard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const referenceData = useQuery({
    queryKey: ["reference-data"],
    queryFn: getReferenceData,
  });

  const servicesQuery = useQuery({
    queryKey: ["provider-services"],
    queryFn: listProviderServices,
  });

  const slotsQuery = useQuery({
    queryKey: ["provider-slots"],
    queryFn: listProviderSlots,
  });

  const bookingsQuery = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: listProviderBookingsApi,
  });

  const cancelSlotMutation = useMutation({
    mutationFn: cancelProviderSlot,
    onSuccess: () => {
      toast.success(t("providerDashboard.slotCancelled"));
      void queryClient.invalidateQueries({ queryKey: ["provider-slots"] });
      void queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : t("common.error")),
  });

  const services = servicesQuery.data?.items ?? [];
  const slots = slotsQuery.data ?? [];
  const bookings = bookingsQuery.data?.bookings ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-violet-500">
              Provider workspace
            </p>
            <h1 className="text-3xl font-bold">{t("providerDashboard.manageServices")}</h1>
          </div>
          <a
            href="/profile"
            className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/70"
          >
            {t("providerDashboard.profile")}
          </a>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">{t("providerDashboard.analytics")}</h2>
          <AnalyticsPanel />
        </section>

        <section className="mb-10">
          <JoyMapToggle />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <ServiceForm
            cities={referenceData.data?.cities ?? []}
            categories={referenceData.data?.categories ?? []}
          />
          <SlotForm services={services} />
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">{t("providerDashboard.services")}</h2>
          {servicesQuery.isLoading ? (
            <p className="text-muted-foreground">{t("common.loadingShort")}</p>
          ) : (
            <ServicesGrid services={services} />
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">{t("providerDashboard.upcomingSlots")}</h2>
          {slotsQuery.isLoading ? (
            <p className="text-muted-foreground">{t("common.loadingShort")}</p>
          ) : slots.length === 0 ? (
            <p className="text-muted-foreground">{t("providerDashboard.noSlots")}</p>
          ) : (
            <div className="space-y-2">
              {slots.slice(0, 12).map((s) => (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{s.serviceTitle}</p>
                    <p className="text-muted-foreground">
                      {new Date(s.startsAt).toLocaleString("ru-RU")} — {new Date(s.endsAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{s.bookedCount}/{s.capacity} {t("providerDashboard.booked")}</p>
                      <p>{formatPrice(s.priceAmount, s.currency)}</p>
                    </div>
                    {s.status === "ACTIVE" ? (
                      <button
                        onClick={() => {
                          if (confirm(t("providerDashboard.cancelSlotConfirm"))) {
                            cancelSlotMutation.mutate(s.id);
                          }
                        }}
                        disabled={cancelSlotMutation.isPending}
                        className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                      >
                        <X className="w-3 h-3" /> {t("providerDashboard.cancel")}
                      </button>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">
                        {s.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">{t("providerDashboard.bookings")}</h2>
          {bookingsQuery.isLoading ? (
            <p className="text-muted-foreground">{t("common.loadingShort")}</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground">{t("providerDashboard.noBookings")}</p>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 10).map((b) => (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{b.slot.service.title}</p>
                    <p className="text-muted-foreground">
                      {new Date(b.slot.startsAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{b.status}</p>
                    <p>{formatPrice(b.totalAmount, b.currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProviderDashboard;
