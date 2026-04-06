import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Heart, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import LazyImage from "@/components/LazyImage";
import expYoga from "@/assets/exp-yoga.jpg";
import expCooking from "@/assets/exp-cooking.jpg";
import expKayak from "@/assets/exp-kayak.jpg";
import expWine from "@/assets/exp-wine.jpg";
import expArt from "@/assets/exp-art.jpg";
import expHiking from "@/assets/exp-hiking.jpg";

const allExperiences = [
    { id: 1, title: "Monastery Garden Yoga, Suzdal", category: "Relaxation", mood: "Calm", price: 45, rating: 4.9, duration: "2h", image: expYoga, desc: "Find inner peace near golden domes" },
    { id: 2, title: "Pelmeni & Blini Cooking Class", category: "Social", mood: "Happy", price: 65, rating: 4.8, duration: "3h", image: expCooking, desc: "Master traditional Russian cuisine" },
    { id: 3, title: "Lake Baikal Kayak Expedition", category: "Adventure", mood: "Thrilling", price: 80, rating: 4.9, duration: "4h", image: expKayak, desc: "Paddle the world's deepest lake" },
    { id: 4, title: "Neva River Sunset Wine Tasting", category: "Romantic", mood: "Relaxed", price: 95, rating: 4.7, duration: "2.5h", image: expWine, desc: "Savor wines overlooking St. Petersburg" },
    { id: 5, title: "Hermitage Museum Art Tour", category: "Creative", mood: "Inspired", price: 55, rating: 4.8, duration: "3h", image: expArt, desc: "Explore world-class masterpieces" },
    { id: 6, title: "Caucasus Mountains Hiking", category: "Adventure", mood: "Energized", price: 35, rating: 4.6, duration: "5h", image: expHiking, desc: "Trek toward Mount Elbrus" },
    { id: 7, title: "Sochi Seaside Meditation", category: "Relaxation", mood: "Calm", price: 30, rating: 4.8, duration: "1.5h", image: expYoga, desc: "Meditate by the Black Sea waves" },
    { id: 8, title: "Moscow Jazz Night", category: "Entertainment", mood: "Happy", price: 50, rating: 4.7, duration: "3h", image: expWine, desc: "Live jazz in a stylish Moscow venue" },
    { id: 9, title: "Elbrus Rock Climbing Day", category: "Adventure", mood: "Thrilling", price: 70, rating: 4.9, duration: "4h", image: expKayak, desc: "Conquer Russia's highest peak" },
];

const moods = ["All", "Calm", "Happy", "Thrilling", "Relaxed", "Inspired", "Energized"];
const categories = ["All", "Relaxation", "Social", "Adventure", "Romantic", "Creative", "Entertainment"];

const Explore = () => {
    const [search, setSearch] = useState("");
    const [selectedMood, setSelectedMood] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filtered = allExperiences.filter((e) => {
        const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
        const matchMood = selectedMood === "All" || e.mood === selectedMood;
        const matchCat = selectedCategory === "All" || e.category === selectedCategory;
        return matchSearch && matchMood && matchCat;
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                            Explore <span className="gradient-text">Experiences</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">Find what makes your heart sing</p>
                    </motion.div>

                    {/* Search & Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 mb-8"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search experiences..."
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground font-medium">Filters</span>
                            </div>
                        </div>

                        {/* Mood filters */}
                        <div className="mt-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mood</p>
                            <div className="flex flex-wrap gap-2">
                                {moods.map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setSelectedMood(m)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedMood === m
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-primary/10"
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category filters */}
                        <div className="mt-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category</p>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCategory(c)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === c
                                                ? "bg-secondary text-secondary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-secondary/10"
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((exp, i) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -6 }}
                                className="glass-card overflow-hidden cursor-pointer group"
                            >
                                <div className="relative h-52 overflow-hidden">
                                    <LazyImage src={exp.image} alt={exp.title} className="h-full group-hover:scale-110 transition-transform duration-500" width={768} height={768} />
                                    <button className="absolute top-3 right-3 p-2 rounded-full glass hover:bg-primary/30 transition-all">
                                        <Heart className="w-4 h-4 text-primary-foreground" />
                                    </button>
                                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full glass text-xs font-medium text-primary-foreground">
                                        {exp.duration}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{exp.mood}</span>
                                        <span className="text-xs text-muted-foreground">{exp.category}</span>
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{exp.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{exp.desc}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-mood-adventure fill-mood-adventure" />
                                            <span className="text-sm font-medium text-foreground">{exp.rating}</span>
                                        </div>
                                        <span className="text-lg font-bold text-primary">${exp.price}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">No experiences match your filters. Try adjusting them!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explore;
