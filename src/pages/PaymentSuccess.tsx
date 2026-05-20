import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/components/Navbar";
import { getMyBookingById } from "@/shared/api/bookings";

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
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId") ?? "";
  const queryClient = useQueryClient();

  const bookingQuery = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getMyBookingById(bookingId).then((r) => r.booking),
    enabled: Boolean(bookingId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "CONFIRMED" || status === "COMPLETED" ? false : 2000;
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["bookings", "me"] });
  }, [queryClient]);

  const booking = bookingQuery.data;
  const isPending = booking && booking.status !== "CONFIRMED" && booking.status !== "COMPLETED";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-6 pt-24 pb-12">
        {!bookingId ? (
          <div className="space-y-3 rounded-3xl border border-rose-200 bg-rose-50 p-8">
            <p className="text-rose-700">{t("paymentSuccess.noBookingId")}</p>
            <Link
              to="/calendar"
              className="inline-block rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {t("paymentSuccess.toBookings")}
            </Link>
          </div>
        ) : bookingQuery.isLoading ? (
          <p className="text-muted-foreground">{t("paymentSuccess.loadingBooking")}</p>
        ) : bookingQuery.isError || !booking ? (
          <div className="space-y-3 rounded-3xl border border-rose-200 bg-rose-50 p-8">
            <p className="text-rose-700">
              {t("paymentSuccess.loadFailed")}
            </p>
            <Link
              to="/calendar"
              className="inline-block rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {t("paymentSuccess.toBookings")}
            </Link>
          </div>
        ) : (
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                {isPending ? "⏳" : "✓"}
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {isPending ? t("paymentSuccess.processing") : t("paymentSuccess.confirmed")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isPending ? t("paymentSuccess.processingNote") : t("paymentSuccess.confirmedNote")}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {booking.slot.service.title}
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {booking.slot.provider.brandName}
              </p>
              <p className="mt-2 text-sm text-foreground">
                {formatSlotDate(booking.slot.startsAt)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatPrice(booking.totalAmount, booking.currency)} ·{" "}
                {booking.status === "CONFIRMED"
                  ? t("paymentSuccess.statusConfirmed")
                  : booking.status === "COMPLETED"
                  ? t("paymentSuccess.statusCompleted")
                  : booking.status === "PENDING_PAYMENT"
                  ? t("paymentSuccess.statusPending")
                  : booking.status}
              </p>
            </div>

            {booking.qrCodeValue ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
                <QRCodeSVG
                  value={booking.qrCodeValue}
                  size={208}
                  level="M"
                  includeMargin
                />
                <p className="text-xs text-muted-foreground">
                  {t("paymentSuccess.bookingCode")}{booking.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            ) : isPending ? (
              <p className="text-center text-sm text-muted-foreground">
                {t("paymentSuccess.qrPlaceholder")}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/calendar"
                className="flex-1 rounded-full bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
              >
                {t("paymentSuccess.myBookings")}
              </Link>
              <Link
                to="/explore"
                className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-foreground hover:bg-slate-50"
              >
                {t("paymentSuccess.findMore")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
