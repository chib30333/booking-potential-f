import { useMemo, useState } from "react";
import type { ExploreExperience } from "../data/fallbackExperiences";

export function useExploreFilters(experiences: ExploreExperience[]) {
  const [search, setSearch] = useState("");
  const [selectedMood, setSelectedMood] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const moodOptions = useMemo(() => {
    return ["All", ...new Set(experiences.map((item) => item.mood))];
  }, [experiences]);

  const categoryOptions = useMemo(() => {
    return ["All", ...new Set(experiences.map((item) => item.category))];
  }, [experiences]);

  const filteredExperiences = useMemo(() => {
    return experiences.filter((experience) => {
      const matchSearch = experience.title.toLowerCase().includes(search.toLowerCase());
      const matchMood = selectedMood === "All" || experience.mood === selectedMood;
      const matchCategory =
        selectedCategory === "All" || experience.category === selectedCategory;

      return matchSearch && matchMood && matchCategory;
    });
  }, [experiences, search, selectedMood, selectedCategory]);

  return {
    search,
    setSearch,
    selectedMood,
    setSelectedMood,
    selectedCategory,
    setSelectedCategory,
    moodOptions,
    categoryOptions,
    filteredExperiences,
  };
}
