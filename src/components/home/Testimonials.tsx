import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Sarah M.",
        text: "Feelora helped me rediscover the joy in everyday life. The sunset yoga session was pure magic.",
        rating: 5,
        mood: "Relaxed & Refreshed",
    },
    {
        name: "James K.",
        text: "I was stuck in a rut. One weekend adventure through Feelora and I felt completely alive again.",
        rating: 5,
        mood: "Excited & Energized",
    },
    {
        name: "Emily R.",
        text: "The cooking class brought my friend group closer. We laughed so hard — best evening in months!",
        rating: 5,
        mood: "Connected & Happy",
    },
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Real <span className="gradient-text">feelings</span>, real stories
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="glass-card p-8 hover-lift"
                        >
                            <Quote className="w-8 h-8 text-primary/30 mb-4" />
                            <p className="text-foreground mb-6 leading-relaxed">{t.text}</p>
                            <div className="flex items-center gap-1 mb-3">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <Star key={j} className="w-4 h-4 text-mood-adventure fill-mood-adventure" />
                                ))}
                            </div>
                            <p className="font-semibold text-foreground">{t.name}</p>
                            <p className="text-sm text-primary">{t.mood}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
