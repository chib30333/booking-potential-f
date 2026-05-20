import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Heart, Sparkles, Star, Settings, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useProfileDashboard } from "@/features/profile/hooks/useProfileDashboard";
import {
  cancelMySubscription,
  getMyActiveSubscription,
} from "@/shared/api/subscriptions";
import { getStoredAccessToken } from "@/shared/lib/auth";

const formatRub = (minor: number, currency = "RUB") => {
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

const Profile = () => {
  const queryClient = useQueryClient();
  const token = getStoredAccessToken();
  const {
    user,
    customerStats,
    emotionStats,
    recentBookings,
    displayName,
    initials,
    joinedLabel,
    isProviderAccount,
  } = useProfileDashboard();

  const subscriptionQuery = useQuery({
    queryKey: ["my-subscription"],
    queryFn: getMyActiveSubscription,
    enabled: Boolean(token),
  });

  const cancelSub = useMutation({
    mutationFn: () => cancelMySubscription(false),
    onSuccess: () => {
      toast.success("Подписка будет отменена в конце оплаченного периода");
      void queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Не удалось отменить подписку"),
  });

  const subscription = subscriptionQuery.data;
  const subscriptionActive =
    subscription?.status === "ACTIVE" || subscription?.status === "PAST_DUE";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {initials}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
                  <p className="text-muted-foreground">{joinedLabel}</p>
                  {user?.email ? (
                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isProviderAccount ? (
                  <Link
                    to="/provider"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    <Briefcase className="w-4 h-4" /> Кабинет провайдера
                  </Link>
                ) : null}
                <Link
                  to="/calendar"
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/70"
                >
                  <CalendarIcon className="w-4 h-4" /> Календарь
                </Link>
                <Link
                  to="/joy-map"
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/70"
                >
                  <Sparkles className="w-4 h-4" /> Карта радости
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {customerStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Subscription */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" /> Подписка Joy Map
                </h2>
                {subscriptionQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground mt-1">Загрузка...</p>
                ) : subscriptionActive ? (
                  <div className="text-sm text-muted-foreground mt-1 space-y-1">
                    <p>
                      Статус: <span className="font-medium text-foreground">{subscription?.status}</span>
                      {subscription?.plan ? (
                        <> · {formatRub(subscription.plan.priceAmount, subscription.plan.currency)} / мес</>
                      ) : null}
                    </p>
                    {subscription?.currentPeriodEnd ? (
                      <p>
                        Активна до {new Date(subscription.currentPeriodEnd).toLocaleDateString("ru-RU")}
                        {subscription.cancelAtPeriodEnd ? " · отменяется по окончании" : ""}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Подключите подписку, чтобы получать персональную карту радости каждую неделю.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {subscriptionActive && !subscription?.cancelAtPeriodEnd ? (
                  <button
                    onClick={() => cancelSub.mutate()}
                    disabled={cancelSub.isPending}
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
                  >
                    {cancelSub.isPending ? "Отмена..." : "Отменить подписку"}
                  </button>
                ) : null}
                <Link
                  to="/joy-map"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  {subscriptionActive ? "Открыть карту" : "Оформить"}
                </Link>
              </div>
            </div>
          </div>

          {/* Emotional Journey */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" /> Эмоциональный профиль
            </h2>
            <div className="space-y-4">
              {emotionStats.map((item) => (
                <div key={item.mood}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{item.mood}</span>
                    <span className="text-muted-foreground">{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent bookings */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Последние бронирования</h2>
              <Link to="/calendar" className="text-sm font-medium text-primary hover:underline">
                Все →
              </Link>
            </div>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Бронирований пока нет.{" "}
                <Link to="/explore" className="font-medium text-primary">
                  Найти впечатления →
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={`${booking.title}-${booking.date}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          booking.mood === "relaxing"
                            ? "bg-secondary"
                            : booking.mood === "social"
                              ? "bg-mood-social"
                              : "bg-mood-adventure"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-foreground">{booking.title}</p>
                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        booking.status === "Upcoming"
                          ? "bg-primary/10 text-primary"
                          : "bg-mood-creative/10 text-mood-creative"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings footer */}
          <div className="mt-8 flex items-center justify-end text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Settings className="w-3 h-3" /> Управляйте подпиской и данными в этом разделе.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
