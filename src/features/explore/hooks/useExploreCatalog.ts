import { useQuery } from "@tanstack/react-query";
import { listPublicServices } from "@/shared/api/services";
import { getReferenceData } from "@/shared/api/reference-data";
import type { PublicServiceCardDto } from "@/shared/types/api";
import {
  fallbackExperiences,
  type ExploreExperience,
} from "../data/fallbackExperiences";
import expYoga from "@/assets/exp-yoga.jpg";
import expCooking from "@/assets/exp-cooking.jpg";
import expKayak from "@/assets/exp-kayak.jpg";
import expWine from "@/assets/exp-wine.jpg";
import expArt from "@/assets/exp-art.jpg";
import expHiking from "@/assets/exp-hiking.jpg";

const fallbackImages = [expYoga, expCooking, expKayak, expWine, expArt, expHiking];

const emotionLabelMap: Record<string, string> = {
  CALM: "Calm",
  JOY: "Happy",
  ENERGY: "Energized",
  RECOVERY: "Relaxed",
  FOCUS: "Inspired",
  BALANCE: "Calm",
  CONFIDENCE: "Thrilling",
  RELAX: "Relaxed",
  SOCIAL: "Happy",
  MINDFULNESS: "Inspired",
};

function formatDuration(durationMinutes: number) {
  if (durationMinutes % 60 === 0) {
    return `${durationMinutes / 60}h`;
  }

  return `${durationMinutes / 60}h`;
}

function mapServiceToExperience(service: PublicServiceCardDto, index: number): ExploreExperience {
  return {
    id: service.id,
    title: service.title,
    category: service.category.name,
    mood: emotionLabelMap[service.emotionTag] ?? service.emotionTag,
    price: service.priceAmount,
    rating: service.provider.averageRating || 4.8,
    duration: formatDuration(service.durationMinutes),
    image: service.coverImageUrl || fallbackImages[index % fallbackImages.length],
    desc: service.description || `Curated by ${service.provider.brandName}`,
  };
}

export function useExploreCatalog() {
  const servicesQuery = useQuery({
    queryKey: ["public-services"],
    queryFn: listPublicServices,
  });

  const referenceDataQuery = useQuery({
    queryKey: ["reference-data"],
    queryFn: getReferenceData,
  });

  const experiences =
    servicesQuery.data?.items.length
      ? servicesQuery.data.items.map(mapServiceToExperience)
      : fallbackExperiences;

  const categories =
    referenceDataQuery.data?.categories.length
      ? ["All", ...referenceDataQuery.data.categories.map((category) => category.name)]
      : ["All", ...new Set(fallbackExperiences.map((item) => item.category))];

  return {
    experiences,
    categories,
    isLoading: servicesQuery.isLoading || referenceDataQuery.isLoading,
    isError: servicesQuery.isError && !servicesQuery.data,
  };
}
