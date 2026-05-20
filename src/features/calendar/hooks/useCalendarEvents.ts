import { useQuery } from "@tanstack/react-query";
import { listMyBookings } from "@/shared/api/bookings";
import { getStoredAccessToken } from "@/shared/lib/auth";
import type { BookingResponseDto } from "@/shared/types/api";
import { type CalendarEvent } from "../data/fallbackCalendarEvents";

const emotionToMood: Record<string, CalendarEvent["mood"]> = {
  CALM: "relaxing",
  JOY: "social",
  ENERGY: "adventure",
  RECOVERY: "relaxing",
  FOCUS: "creative",
  BALANCE: "relaxing",
  CONFIDENCE: "exciting",
  RELAX: "relaxing",
  SOCIAL: "social",
  MINDFULNESS: "creative",
};

function mapBookingToEvent(booking: BookingResponseDto): CalendarEvent {
  const startsAt = new Date(booking.slot.startsAt);

  return {
    id: booking.id,
    title: booking.slot.service.title,
    date: booking.slot.startsAt.slice(0, 10),
    time: startsAt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    mood: emotionToMood[booking.slot.emotionTag] ?? "exciting",
    location: booking.slot.provider.brandName,
    description: booking.notes || `Booking with ${booking.slot.provider.brandName}`,
    bookingId: booking.id,
    status: booking.status,
    qrCodeValue: booking.qrCodeValue ?? null,
    startsAt: booking.slot.startsAt,
  };
}

export function useCalendarEvents() {
  const token = getStoredAccessToken();
  const bookingsQuery = useQuery({
    queryKey: ["my-bookings-calendar"],
    queryFn: listMyBookings,
    enabled: Boolean(token),
  });

  const events: CalendarEvent[] =
    bookingsQuery.data?.bookings.map(mapBookingToEvent) ?? [];

  return {
    events,
    isLoading: bookingsQuery.isLoading,
    isError: bookingsQuery.isError,
    isEmpty: !bookingsQuery.isLoading && events.length === 0,
  };
}
