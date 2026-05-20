import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard, Download, ReceiptText, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/shared/PageHeader";
import {
  cancelMySubscription,
  getMyActiveSubscription,
  listMySubscriptions,
  listSubscriptionPlans,
} from "@/shared/api/subscriptions";
import {
  createSubscriptionCheckout,
  listMyPayments,
  type PaymentHistoryItem,
  type PaymentProvider,
} from "@/shared/api/payments";

const formatMoney = (minor: number, currency = "RUB") => {
  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(minor / 100);
  } catch {
    return `${minor / 100} ${currency}`;
  }
};

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("ru-RU") : "—";

const paymentStatusBadge = (status: PaymentHistoryItem["status"]) => {
  const map: Record<string, string> = {
    SUCCEEDED: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    FAILED: "bg-rose-100 text-rose-700",
    CANCELLED: "bg-slate-200 text-slate-700",
    REFUNDED: "bg-violet-100 text-violet-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
};

const paymentTitle = (p: PaymentHistoryItem) => {
  if (p.type === "BOOKING") {
    return p.booking?.slot?.service?.title ?? "Бронирование";
  }
  return p.subscription?.plan?.name ?? "Подписка";
};

const Billing = () => {
  const queryClient = useQueryClient();

  const activeSubQuery = useQuery({
    queryKey: ["my-subscription"],
    queryFn: getMyActiveSubscription,
  });
  const allSubsQuery = useQuery({
    queryKey: ["my-subscriptions-history"],
    queryFn: listMySubscriptions,
  });
  const plansQuery = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: listSubscriptionPlans,
  });
  const paymentsQuery = useQuery({
    queryKey: ["my-payments"],
    queryFn: listMyPayments,
  });

  const cancelSub = useMutation({
    mutationFn: (immediate: boolean) => cancelMySubscription(immediate),
    onSuccess: (_, immediate) => {
      toast.success(
        immediate
          ? "Подписка отменена немедленно"
          : "Подписка будет отменена в конце оплаченного периода"
      );
      void queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      void queryClient.invalidateQueries({ queryKey: ["my-subscriptions-history"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Не удалось отменить подписку"),
  });

  const subscribe = useMutation({
    mutationFn: ({ planCode, provider }: { planCode: string; provider: PaymentProvider }) =>
      createSubscriptionCheckout(planCode, provider),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("Не получили checkout URL от провайдера");
      }
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Не удалось начать оформление"),
  });

  const sub = activeSubQuery.data;
  const subscriptionActive =
    sub?.status === "ACTIVE" || sub?.status === "PAST_DUE";
  const plans = plansQuery.data ?? [];
  const payments = paymentsQuery.data ?? [];
  const subsHistory = allSubsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12 max-w-5xl">
        <PageHeader
          className="mb-8"
          title={<>Биллинг и подписка</>}
          description="Управление подпиской Joy Map и история платежей"
        />

        {/* Current subscription */}
        <section className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Подписка Joy Map
              </h2>
              {activeSubQuery.isLoading ? (
                <p className="text-sm text-muted-foreground mt-1">Загрузка...</p>
              ) : subscriptionActive ? (
                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                  <p>
                    Статус: <span className="font-medium text-foreground">{sub?.status}</span>
                    {sub?.plan ? (
                      <> · {formatMoney(sub.plan.priceAmount, sub.plan.currency)} / мес</>
                    ) : null}
                  </p>
                  {sub?.currentPeriodEnd ? (
                    <p>
                      Активна до {formatDate(sub.currentPeriodEnd)}
                      {sub.cancelAtPeriodEnd ? " · отменяется по окончании" : ""}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  У вас нет активной подписки. Выберите план ниже.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {subscriptionActive ? (
                <>
                  {!sub?.cancelAtPeriodEnd ? (
                    <button
                      onClick={() => cancelSub.mutate(false)}
                      disabled={cancelSub.isPending}
                      className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
                    >
                      Отменить в конце периода
                    </button>
                  ) : null}
                  <button
                    onClick={() => {
                      if (confirm("Отменить подписку немедленно? Доступ к Карте радости пропадёт сразу.")) {
                        cancelSub.mutate(true);
                      }
                    }}
                    disabled={cancelSub.isPending}
                    className="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                  >
                    Отменить сейчас
                  </button>
                </>
              ) : null}
              <Link
                to="/joy-map"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Открыть карту
              </Link>
            </div>
          </div>
        </section>

        {/* Plans */}
        {!subscriptionActive ? (
          <section className="glass-card p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Доступные планы</h2>
            {plansQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Загрузка планов...</p>
            ) : plans.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Планы пока не настроены. Свяжитесь с поддержкой.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5"
                  >
                    <p className="text-sm uppercase tracking-widest text-violet-500">
                      {plan.code}
                    </p>
                    <h3 className="mt-1 text-xl font-bold">{plan.name}</h3>
                    {plan.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                    ) : null}
                    <p className="mt-3 text-2xl font-bold">
                      {formatMoney(plan.priceAmount, plan.currency)}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / {plan.intervalMonths === 1 ? "мес" : `${plan.intervalMonths} мес`}
                      </span>
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          subscribe.mutate({ planCode: plan.code, provider: "STRIPE" })
                        }
                        disabled={subscribe.isPending}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                      >
                        <CreditCard className="w-4 h-4" /> Оплатить картой (Stripe)
                      </button>
                      <button
                        onClick={() =>
                          subscribe.mutate({ planCode: plan.code, provider: "YOOKASSA" })
                        }
                        disabled={subscribe.isPending}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
                      >
                        ЮKassa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {/* Payment history */}
        <section className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-primary" /> История платежей
            </h2>
          </div>
          {paymentsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Загрузка...</p>
          ) : payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Платежей ещё не было.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-3">Дата</th>
                    <th className="py-2 pr-3">Описание</th>
                    <th className="py-2 pr-3">Тип</th>
                    <th className="py-2 pr-3">Способ</th>
                    <th className="py-2 pr-3">Сумма</th>
                    <th className="py-2 pr-3">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 pr-3 text-muted-foreground">
                        {formatDate(p.paidAt ?? p.createdAt)}
                      </td>
                      <td className="py-3 pr-3 font-medium">{paymentTitle(p)}</td>
                      <td className="py-3 pr-3 text-muted-foreground">
                        {p.type === "BOOKING" ? "Бронирование" : "Подписка"}
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground">{p.provider}</td>
                      <td className="py-3 pr-3 font-medium">
                        {formatMoney(p.amount, p.currency)}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusBadge(p.status)}`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Subscription history */}
        {subsHistory.length > 0 ? (
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" /> История подписок
            </h2>
            <div className="space-y-2 text-sm">
              {subsHistory.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{s.plan?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.currentPeriodStart)} → {formatDate(s.currentPeriodEnd)}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default Billing;
