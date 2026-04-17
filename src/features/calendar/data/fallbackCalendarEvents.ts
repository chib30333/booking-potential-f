export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  mood: "relaxing" | "exciting" | "social" | "adventure" | "creative";
  location: string;
  description: string;
}

export const fallbackCalendarEvents: CalendarEvent[] = [
  { id: "1", title: "Sunrise Yoga", date: "2026-04-06", time: "6:00 AM", mood: "relaxing", location: "Hilltop Park", description: "Start your week with peaceful mountain yoga" },
  { id: "2", title: "Cooking Class", date: "2026-04-08", time: "6:30 PM", mood: "social", location: "Chef's Studio", description: "Italian pasta masterclass with friends" },
  { id: "3", title: "Lake Kayaking", date: "2026-04-10", time: "9:00 AM", mood: "adventure", location: "Crystal Lake", description: "4-hour expedition through the canyon" },
  { id: "4", title: "Wine Tasting", date: "2026-04-12", time: "5:00 PM", mood: "exciting", location: "Sunset Vineyard", description: "Sample premium wines at golden hour" },
  { id: "5", title: "Art Workshop", date: "2026-04-15", time: "2:00 PM", mood: "creative", location: "Studio Bloom", description: "Watercolor painting for beginners" },
  { id: "6", title: "Jazz Night", date: "2026-04-18", time: "8:00 PM", mood: "social", location: "Blue Note Club", description: "Live jazz performance evening" },
  { id: "7", title: "Forest Hike", date: "2026-04-20", time: "7:00 AM", mood: "adventure", location: "Emerald Trail", description: "Guided nature trail exploration" },
  { id: "8", title: "Beach Meditation", date: "2026-04-22", time: "6:30 AM", mood: "relaxing", location: "Coral Beach", description: "Guided mindfulness by the ocean" },
];
