import expYoga from "@/assets/exp-yoga.jpg";
import expCooking from "@/assets/exp-cooking.jpg";
import expKayak from "@/assets/exp-kayak.jpg";
import expWine from "@/assets/exp-wine.jpg";
import expArt from "@/assets/exp-art.jpg";
import expHiking from "@/assets/exp-hiking.jpg";

export interface ExploreExperience {
  id: string;
  title: string;
  category: string;
  mood: string;
  price: number;
  rating: number;
  duration: string;
  image: string;
  desc: string;
}

export const fallbackExperiences: ExploreExperience[] = [
  { id: "1", title: "Monastery Garden Yoga, Suzdal", category: "Relaxation", mood: "Calm", price: 45, rating: 4.9, duration: "2h", image: expYoga, desc: "Find inner peace near golden domes" },
  { id: "2", title: "Pelmeni & Blini Cooking Class", category: "Social", mood: "Happy", price: 65, rating: 4.8, duration: "3h", image: expCooking, desc: "Master traditional Russian cuisine" },
  { id: "3", title: "Lake Baikal Kayak Expedition", category: "Adventure", mood: "Thrilling", price: 80, rating: 4.9, duration: "4h", image: expKayak, desc: "Paddle the world's deepest lake" },
  { id: "4", title: "Neva River Sunset Wine Tasting", category: "Romantic", mood: "Relaxed", price: 95, rating: 4.7, duration: "2.5h", image: expWine, desc: "Savor wines overlooking St. Petersburg" },
  { id: "5", title: "Hermitage Museum Art Tour", category: "Creative", mood: "Inspired", price: 55, rating: 4.8, duration: "3h", image: expArt, desc: "Explore world-class masterpieces" },
  { id: "6", title: "Caucasus Mountains Hiking", category: "Adventure", mood: "Energized", price: 35, rating: 4.6, duration: "5h", image: expHiking, desc: "Trek toward Mount Elbrus" },
  { id: "7", title: "Sochi Seaside Meditation", category: "Relaxation", mood: "Calm", price: 30, rating: 4.8, duration: "1.5h", image: expYoga, desc: "Meditate by the Black Sea waves" },
  { id: "8", title: "Moscow Jazz Night", category: "Entertainment", mood: "Happy", price: 50, rating: 4.7, duration: "3h", image: expWine, desc: "Live jazz in a stylish Moscow venue" },
  { id: "9", title: "Elbrus Rock Climbing Day", category: "Adventure", mood: "Thrilling", price: 70, rating: 4.9, duration: "4h", image: expKayak, desc: "Conquer Russia's highest peak" },
];
