import { useQuery } from "@tanstack/react-query";
import { Calendar, Heart, Star, TrendingUp, DollarSign, Users, Award } from "lucide-react";
import { getMe } from "@/shared/api/auth";
import { listMyBookings, listProviderBookings } from "@/shared/api/bookings";
import { getCustomerProfile, getProviderProfile } from "@/shared/api/profiles";
import { getStoredAccessToken } from "@/shared/lib/auth";
import type { BookingResponseDto, CustomerProfileDto, SafeUser } from "@/shared/types/api";
import {
  fallbackCustomerStats,
  fallbackEmotionStats,
  fallbackProviderStats,
  fallbackRecentBookings,
} from "../data/fallbackProfileData";

const iconMap = {
  calendar: Calendar,
  heart: Heart,
  star: Star,
  trending: TrendingUp,
  dollar: DollarSign,
  users: Users,
  award: Award,
};

const emotionLabelMap: Record<string, string> = {
  CALM: "Relaxation",
  JOY: "Romantic",
  ENERGY: "Adventure",
  RECOVERY: "Relaxation",
  FOCUS: "Creative",
  BALANCE: "Relaxation",
  CONFIDENCE: "Adventure",
  RELAX: "Relaxation",
  SOCIAL: "Social",
  MINDFULNESS: "Creative",
};

const emotionColorMap: Record<string, string> = {
  Relaxation: "bg-secondary",
  Adventure: "bg-mood-adventure",
  Social: "bg-mood-social",
  Creative: "bg-mood-creative",
  Romantic: "bg-primary",
};

function formatShortDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function mapCustomerStats(bookings: BookingResponseDto[]) {
  const completed = bookings.filter((booking) => booking.status === "COMPLETED").length;
  const upcoming = bookings.filter((booking) =>
    ["PENDING_PAYMENT", "CONFIRMED"].includes(booking.status)
  ).length;

  return [
    { icon: iconMap.calendar, label: "Booked", value: String(bookings.length), color: "text-primary" },
    { icon: iconMap.star, label: "Completed", value: String(completed), color: "text-mood-adventure" },
    { icon: iconMap.heart, label: "Favorites", value: String(Math.max(3, Math.ceil(bookings.length / 2))), color: "text-mood-social" },
    { icon: iconMap.award, label: "Joy Score", value: `${Math.min(98, 70 + upcoming + completed)}%`, color: "text-mood-creative" },
  ];
}

function mapEmotionStats(profile?: CustomerProfileDto) {
  if (!profile?.emotionPreferences.length) {
    return fallbackEmotionStats;
  }

  const total = profile.emotionPreferences.reduce((sum, item) => sum + item.score, 0) || 1;
  return profile.emotionPreferences.map((item) => {
    const mood = emotionLabelMap[item.emotion] ?? item.emotion;
    return {
      mood,
      pct: Math.round((item.score / total) * 100),
      color: emotionColorMap[mood] ?? "bg-primary",
    };
  });
}

function mapRecentBookings(bookings: BookingResponseDto[]) {
  if (!bookings.length) {
    return fallbackRecentBookings;
  }

  return bookings.slice(0, 3).map((booking) => ({
    title: booking.slot.service.title,
    date: formatShortDate(booking.slot.startsAt),
    status: booking.status === "CONFIRMED" ? "Upcoming" : "Completed",
    mood:
      booking.slot.emotionTag === "SOCIAL"
        ? "social"
        : booking.slot.emotionTag === "CALM"
          ? "relaxing"
          : "adventure",
  }));
}

function buildDisplayName(user?: SafeUser) {
  return user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Alex Johnson";
}

function buildInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function useProfileDashboard() {
  const token = getStoredAccessToken();

  const meQuery = useQuery({
    queryKey: ["auth-me"],
    queryFn: getMe,
    enabled: Boolean(token),
  });

  const customerBookingsQuery = useQuery({
    queryKey: ["profile-customer-bookings"],
    queryFn: listMyBookings,
    enabled: Boolean(token) && meQuery.data?.role === "CUSTOMER",
  });

  const providerBookingsQuery = useQuery({
    queryKey: ["profile-provider-bookings"],
    queryFn: listProviderBookings,
    enabled: Boolean(token) && meQuery.data?.role === "PROVIDER",
  });

  const customerProfileQuery = useQuery({
    queryKey: ["customer-profile"],
    queryFn: getCustomerProfile,
    enabled: Boolean(token) && meQuery.data?.role === "CUSTOMER",
  });

  const providerProfileQuery = useQuery({
    queryKey: ["provider-profile"],
    queryFn: getProviderProfile,
    enabled: Boolean(token) && meQuery.data?.role === "PROVIDER",
  });

  const user = meQuery.data;
  const isProviderAccount = user?.role === "PROVIDER";
  const displayName = buildDisplayName(user);

  const customerStats = customerBookingsQuery.data?.bookings.length
    ? mapCustomerStats(customerBookingsQuery.data.bookings)
    : fallbackCustomerStats.map((item) => ({
        ...item,
        icon: iconMap[item.iconKey as keyof typeof iconMap],
      }));

  const providerStats = providerBookingsQuery.data?.bookings.length
    ? [
        {
          icon: iconMap.calendar,
          label: "Total Bookings",
          value: String(providerBookingsQuery.data.bookings.length),
          color: "text-primary",
        },
        {
          icon: iconMap.dollar,
          label: "Revenue",
          value: `$${providerBookingsQuery.data.bookings
            .reduce((sum, booking) => sum + booking.totalAmount, 0)
            .toLocaleString()}`,
          color: "text-mood-creative",
        },
        {
          icon: iconMap.users,
          label: "Customers",
          value: String(new Set(providerBookingsQuery.data.bookings.map((booking) => booking.slot.provider.id)).size || 1),
          color: "text-secondary",
        },
        {
          icon: iconMap.trending,
          label: "Growth",
          value: "+24%",
          color: "text-mood-adventure",
        },
      ]
    : fallbackProviderStats.map((item) => ({
        ...item,
        icon: iconMap[item.iconKey as keyof typeof iconMap],
      }));

  return {
    user,
    isProviderAccount,
    displayName,
    initials: buildInitials(displayName),
    customerStats,
    providerStats,
    emotionStats: mapEmotionStats(customerProfileQuery.data),
    recentBookings: mapRecentBookings(customerBookingsQuery.data?.bookings ?? []),
    providerBrandName: providerProfileQuery.data?.brandName ?? displayName,
    joinedLabel: user?.createdAt
      ? `Emotion explorer since ${new Date(user.createdAt).getFullYear()}`
      : "Emotion explorer since 2025",
    isUsingFallback: !token,
  };
}
