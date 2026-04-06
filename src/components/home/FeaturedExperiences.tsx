import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import expYoga from "@/assets/exp-yoga.jpg";
import expCooking from "@/assets/exp-cooking.jpg";
import expKayak from "@/assets/exp-kayak.jpg";
import expWine from "@/assets/exp-wine.jpg";
import expArt from "@/assets/exp-art.jpg";
import expHiking from "@/assets/exp-hiking.jpg";

const experiences = [
    { id: 1, title: "Monastery Garden Yoga, Suzdal", category: "Relaxation", price: 45, rating: 4.9, image: expYoga, mood: "relaxing" },
    { id: 2, title: "Pelmeni & Blini Cooking Class", category: "Social", price: 65, rating: 4.8, image: expCooking, mood: "social" },
    { id: 3, title: "Lake Baikal Kayak Expedition", category: "Adventure", price: 80, rating: 4.9, image: expKayak, mood: "adventure" },
    { id: 4, title: "Neva River Sunset Wine Tasting", category: "Romantic", price: 95, rating: 4.7, image: expWine, mood: "exciting" },
    { id: 5, title: "Hermitage Museum Art Tour", category: "Creative", price: 55, rating: 4.8, image: expArt, mood: "creative" },
    { id: 6, title: "Caucasus Mountains Hiking", category: "Adventure", price: 35, rating: 4.6, image: expHiking, mood: "adventure" },
];

const moodColors: Record<string, string> = {
    relaxing: "bg-mood-relaxing/20 text-secondary",
    exciting: "bg-primary/20 text-primary",
    social: "bg-mood-social/20 text-mood-social",
    adventure: "bg-mood-adventure/20 text-mood-adventure",
    creative: "bg-mood-creative/20 text-mood-creative",
};

const FeaturedExperiences = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Featured <span className="gradient-text">Experiences</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Handpicked moments designed to spark joy and create lasting memories
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="glass-card overflow-hidden cursor-pointer group"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <LazyImage
                                    src={exp.image}
                                    alt={exp.title}
                                    className="h-full w-full group-hover:scale-110 transition-transform duration-500"
                                    width={768}
                                    height={768}
                                />
                                <div className="absolute top-4 right-4">
                                    <button className="p-2 rounded-full glass transition-all duration-300 hover:bg-primary/30">
                                        <Heart className="w-4 h-4 text-primary-foreground" />
                                    </button>
                                </div>
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${moodColors[exp.mood]}`}>
                                    {exp.category}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {exp.title}
                                </h3>
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
            </div>
        </section>
    );
};

export default FeaturedExperiences;
