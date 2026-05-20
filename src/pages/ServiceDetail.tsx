import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import {
  getPublicServiceBySlug,
  listPublicSlotsForService,
} from "@/shared/api/services";
import { createBooking } from "@/shared/api/bookings";
import { createBookingCheckout } from "@/shared/api/payments";
import { getStoredAccessToken } from "@/shared/lib/auth";
import { useAuthMe } from "@/features/auth/hooks/useAuthMe";

const formatPrice = (amountMinor: number, currency: string) => {
  const major = amountMinor / 100;
  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(major);
  } catch {
    return `${major} ${currency}`;
  }
};

const formatSlotDate = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const ServiceDetail = () => {
  const { t } = useTranslation();
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const me = useAuthMe();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const serviceQuery = useQuery({
    queryKey: ["service", slug],
    queryFn: () => getPublicServiceBySlug(slug),
    enabled: Boolean(slug),
  });

  const slotsQuery = useQuery({
    queryKey: ["service-slots", serviceQuery.data?.id],
    queryFn: () => listPublicSlotsForService(serviceQuery.data!.id),
    enabled: Boolean(serviceQuery.data?.id),
  });

  const checkoutMutation = useMutation({
    mutationFn: async (slotId: string) => {
      const created = await createBooking({ slotId });
      const checkout = await createBookingCheckout(created.booking.id, "STRIPE");
      return checkout;
    },
    onSuccess: ({ checkoutUrl }) => {
      window.location.href = checkoutUrl;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : t("serviceDetail.bookingFailed")
      );
    },
  });

  const sortedSlots = useMemo(
    () =>
      (slotsQuery.data ?? [])
        .filter((s) => s.availableCount > 0)
        .slice()
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [slotsQuery.data]
  );

  const handleBook = () => {
    if (!selectedSlotId) {
      toast.error(t("serviceDetail.selectTime"));
      return;
    }

    if (!getStoredAccessToken() || !me.data) {
      navigate("/login", { state: { from: `/services/${slug}` } });
      return;
    }

    checkoutMutation.mutate(selectedSlotId);
  };

  const service = serviceQuery.data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        {serviceQuery.isLoading ? (
          <p className="text-muted-foreground">{t("serviceDetail.loadingService")}</p>
        ) : serviceQuery.isError || !service ? (
          <div className="space-y-3">
            <p className="text-rose-600">{t("serviceDetail.notFound")}</p>
            <Link
              to="/explore"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {t("serviceDetail.backToCatalog")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl bg-muted">
                {service.coverImageUrl ? (
                  <img
                    src={service.coverImageUrl}
                    alt={service.title}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center text-muted-foreground">
                    {t("serviceDetail.imageComingSoon")}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.2em] text-violet-500">
                  {service.category.name} · {service.city.name}
                </p>
                <h1 className="text-4xl font-bold text-foreground">
                  {service.title}
                </h1>
                <p className="text-base text-muted-foreground">
                  {t("serviceDetail.providerPrefix")}{service.provider.brandName} ·{" "}
                  {service.provider.averageRating.toFixed(1)} ★ (
                  {service.provider.totalReviews} {t("serviceDetail.reviewsSuffix")}
                </p>
              </div>

              {service.description ? (
                <p className="text-base leading-7 text-foreground">
                  {service.description}
                </p>
              ) : null}

              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-muted/40 p-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {t("serviceDetail.duration")}
                  </p>
                  <p className="text-lg font-semibold">
                    {service.durationMinutes} {t("serviceDetail.min")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {t("serviceDetail.price")}
                  </p>
                  <p className="text-lg font-semibold">
                    {formatPrice(service.priceAmount, service.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {t("serviceDetail.emotion")}
                  </p>
                  <p className="text-lg font-semibold">{service.emotionTag}</p>
                </div>
              </div>
            </div>

            <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">{t("serviceDetail.chooseTime")}</h2>

              {slotsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">{t("serviceDetail.loadingSlots")}</p>
              ) : sortedSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("serviceDetail.noSlots")}
                </p>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {sortedSlots.map((slot) => {
                    const active = selectedSlotId === slot.id;
                    return (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-sm font-medium">
                            {formatSlotDate(slot.startsAt)}
                          </span>
                          <span
                            className={`text-sm ${
                              active ? "text-white/80" : "text-muted-foreground"
                            }`}
                          >
                            {formatPrice(slot.priceAmount, slot.currency)}
                          </span>
                        </div>
                        <div
                          className={`mt-1 text-xs ${
                            active ? "text-white/70" : "text-muted-foreground"
                          }`}
                        >
                          {slot.availableCount} {t("serviceDetail.seatsLeft")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={handleBook}
                disabled={!selectedSlotId || checkoutMutation.isPending}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutMutation.isPending
                  ? t("serviceDetail.redirectingPayment")
                  : t("serviceDetail.bookAndPay")}
              </button>

              <p className="text-xs text-muted-foreground">
                {t("serviceDetail.stripeNote")}
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
