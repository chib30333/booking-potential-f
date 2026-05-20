import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { listSubscriptionPlans } from "@/shared/api/subscriptions";
import { createSubscriptionCheckout } from "@/shared/api/payments";

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

const JoyMapPaywall = () => {
  const { t } = useTranslation();
  const plansQuery = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: listSubscriptionPlans,
  });

  const checkout = useMutation({
    mutationFn: (planCode: string) => createSubscriptionCheckout(planCode, "STRIPE"),
    onSuccess: ({ checkoutUrl }) => {
      window.location.href = checkoutUrl;
    },
    onError: (e) =>
      toast.error(
        e instanceof Error ? e.message : t("joyMapPaywall.checkoutFailed")
      ),
  });

  const plans = plansQuery.data ?? [];
  const joyPlan = plans.find((p) => p.code.toLowerCase().includes("joy")) ?? plans[0];

  return (
    <div className="rounded-3xl border border-violet-200 bg-linear-to-br from-violet-50 via-pink-50 to-amber-50 p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">
        Joy Map · Premium
      </p>
      <h2 className="mt-2 text-2xl font-bold">
        {t("joyMapPaywall.title")}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        {t("joyMapPaywall.description1")}{" "}
        {t("joyMapPaywall.description2")}{" "}
        {t("joyMapPaywall.description3")}
      </p>

      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <p className="text-4xl font-bold">
          {joyPlan
            ? formatPrice(joyPlan.priceAmount, joyPlan.currency)
            : "499 ₽"}
        </p>
        <p className="text-sm text-muted-foreground">{t("joyMapPaywall.perMonth")}</p>
      </div>

      <button
        type="button"
        disabled={!joyPlan || checkout.isPending}
        onClick={() => joyPlan && checkout.mutate(joyPlan.code)}
        className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {checkout.isPending ? t("joyMapPaywall.redirecting") : t("joyMapPaywall.subscribe")}
      </button>

      <p className="mt-3 text-xs text-muted-foreground">
        {t("joyMapPaywall.stripeNote")}
      </p>
    </div>
  );
};

export default JoyMapPaywall;
