import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import {
  generateJoyMap,
  getCurrentJoyMap,
  type JoyMapItemDto,
} from "@/shared/api/joy-map";
import { getCustomerProfile, submitCustomerOnboarding } from "@/shared/api/profiles";
import { getReferenceData } from "@/shared/api/reference-data";
import { getMyActiveSubscription } from "@/shared/api/subscriptions";
import JoyMapPaywall from "@/features/subscription/components/JoyMapPaywall";

const WEEKDAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

const EMOTIONS = [
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
] as const;

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

const ItemCard = ({ item }: { item: JoyMapItemDto }) => (
  <div className="min-w-[280px] max-w-[320px] flex-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">
      {item.dayLabel} · {item.emotionTag}
    </p>
    <h3 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h3>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.reason}</p>

    {item.suggestedService ? (
      <Link
        to={`/services/${item.suggestedService.slug}`}
        className="mt-4 block rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-slate-100"
      >
        <p className="text-sm font-semibold text-foreground">
          {item.suggestedService.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {item.suggestedService.providerName} · {item.suggestedService.cityName}
        </p>
        <p className="mt-1 text-sm font-semibold text-primary">
          {formatPrice(
            item.suggestedService.priceAmount,
            item.suggestedService.currency
          )}
        </p>
      </Link>
    ) : null}
  </div>
);

const OnboardingForm = ({
  cities,
  onSubmitted,
}: {
  cities: Array<{ id: string; name: string }>;
  onSubmitted: () => void;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [age, setAge] = useState("28");
  const [cityId, setCityId] = useState(cities[0]?.id ?? "");
  const [moodNotes, setMoodNotes] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({
    CALM: 4,
    JOY: 4,
    ENERGY: 3,
  });

  const submit = useMutation({
    mutationFn: () =>
      submitCustomerOnboarding({
        age: Number(age) || 25,
        cityId,
        moodNotes: moodNotes.trim() || undefined,
        emotionPreferences: Object.entries(scores)
          .filter(([, s]) => s > 0)
          .map(([emotion, score]) => ({ emotion, score })),
      }),
    onSuccess: () => {
      toast.success(t("joyMap.profileSaved"));
      void queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
      onSubmitted();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : t("joyMap.profileSaveFailed")
      ),
  });

  const toggleScore = (emotion: string, score: number) => {
    setScores((prev) => ({ ...prev, [emotion]: score }));
  };

  return (
    <form
      className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!cityId) {
          toast.error(t("joyMap.selectCity"));
          return;
        }
        submit.mutate();
      }}
    >
      <div>
        <h2 className="text-2xl font-bold">{t("joyMap.setupTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("joyMap.setupSubtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">{t("joyMap.age")}</span>
          <input
            type="number"
            min={13}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">{t("joyMap.city")}</span>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">{t("joyMap.moodTitle")}</span>
        <textarea
          value={moodNotes}
          onChange={(e) => setMoodNotes(e.target.value)}
          rows={3}
          placeholder={t("joyMap.moodPlaceholder")}
          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm"
        />
      </label>

      <div>
        <p className="mb-2 text-sm font-medium">
          {t("joyMap.emotionsPick")}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EMOTIONS.map((emotion) => {
            const value = scores[emotion] ?? 0;
            return (
              <div
                key={emotion}
                className="rounded-2xl border border-slate-200 p-3"
              >
                <p className="text-xs font-semibold tracking-wide text-slate-700">
                  {emotion}
                </p>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleScore(emotion, s === value ? 0 : s)}
                      className={`h-7 w-7 rounded-full text-xs font-medium ${
                        s <= value
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={submit.isPending}
        className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {submit.isPending ? t("joyMap.saving") : t("joyMap.saveContinue")}
      </button>
    </form>
  );
};

const JoyMap = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const subscriptionQuery = useQuery({
    queryKey: ["my-subscription"],
    queryFn: getMyActiveSubscription,
  });

  const hasActiveSubscription =
    subscriptionQuery.data?.status === "ACTIVE" ||
    subscriptionQuery.data?.status === "PAST_DUE";

  const profileQuery = useQuery({
    queryKey: ["customer-profile"],
    queryFn: getCustomerProfile,
    enabled: hasActiveSubscription,
  });

  const referenceDataQuery = useQuery({
    queryKey: ["reference-data"],
    queryFn: getReferenceData,
  });

  const currentMapQuery = useQuery({
    queryKey: ["joy-map-current"],
    queryFn: getCurrentJoyMap,
    enabled: Boolean(profileQuery.data?.onboardingDone),
  });

  const generate = useMutation({
    mutationFn: () => generateJoyMap(false),
    onSuccess: () => {
      toast.success(t("joyMap.freshReady"));
      void queryClient.invalidateQueries({ queryKey: ["joy-map-current"] });
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : t("joyMap.generateFailed")
      ),
  });

  const items = useMemo(() => {
    const data = currentMapQuery.data;
    if (!data) return [] as JoyMapItemDto[];
    return [...data.items].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  }, [currentMapQuery.data]);

  const cities = referenceDataQuery.data?.cities ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-violet-500">
              AI Joy Map
            </p>
            <h1 className="text-3xl font-bold">{t("joyMap.weeklyRoute")}</h1>
          </div>

          {profileQuery.data?.onboardingDone ? (
            <button
              type="button"
              onClick={() => generate.mutate()}
              disabled={generate.isPending}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {generate.isPending ? t("joyMap.generating") : t("joyMap.regenerate")}
            </button>
          ) : null}
        </div>

        {subscriptionQuery.isLoading ? (
          <p className="text-muted-foreground">{t("joyMap.checkingSubscription")}</p>
        ) : !hasActiveSubscription ? (
          <JoyMapPaywall />
        ) : profileQuery.isLoading ? (
          <p className="text-muted-foreground">{t("joyMap.loadingProfile")}</p>
        ) : !profileQuery.data?.onboardingDone ? (
          <OnboardingForm
            cities={cities}
            onSubmitted={() => generate.mutate()}
          />
        ) : currentMapQuery.isLoading ? (
          <p className="text-muted-foreground">{t("joyMap.loadingMap")}</p>
        ) : !currentMapQuery.data ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
            <p className="mb-4 text-muted-foreground">
              {t("joyMap.noMapYet")}
            </p>
            <button
              type="button"
              onClick={() => generate.mutate()}
              disabled={generate.isPending}
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {generate.isPending ? t("joyMap.generating") : t("joyMap.generateMap")}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl bg-linear-to-br from-violet-100 via-pink-50 to-amber-50 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-500">
                {t("joyMap.weekOf")}{new Date(currentMapQuery.data.weekStart).toLocaleDateString("ru-RU")}
              </p>
              <p className="mt-2 text-base text-foreground">
                {currentMapQuery.data.summary}
              </p>
            </div>

            <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
              {items.map((item) => (
                <div key={item.id} className="snap-start">
                  <ItemCard item={item} />
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              {WEEKDAY_LABELS.length} {t("joyMap.daysSuffix")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoyMap;
