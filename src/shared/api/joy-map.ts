import { request } from "../lib/http";

export interface JoyMapItemDto {
  id: string;
  dayOfWeek: number;
  dayLabel: string;
  emotionTag: string;
  category: { id: string | null; name: string | null; slug: string | null };
  title: string;
  reason: string;
  suggestedService: {
    id: string;
    title: string;
    slug: string;
    priceAmount: number;
    currency: string;
    coverImageUrl: string | null;
    ratingAverage: number;
    providerName: string;
    cityName: string;
  } | null;
}

export interface JoyMapResponseDto {
  id: string;
  weekStart: string;
  summary: string;
  status: string;
  version: number;
  items: JoyMapItemDto[];
}

export function generateJoyMap(forceRegenerate = false) {
  return request<JoyMapResponseDto>("/joy-map/generate", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ forceRegenerate }),
  });
}

export function getCurrentJoyMap() {
  return request<JoyMapResponseDto | null>("/joy-map/me/current", { auth: true });
}

export function getJoyMapHistory(limit = 8) {
  return request<JoyMapResponseDto[]>(`/joy-map/me/history?limit=${limit}`, {
    auth: true,
  });
}
