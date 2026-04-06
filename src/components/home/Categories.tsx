import { motion } from "framer-motion";
import { Mountain, Waves, Users, Palette, Heart, Music } from "lucide-react";

const categories = [
    { icon: Mountain, label: "Adventure", color: "from-mood-adventure/20 to-mood-adventure/5" },
    { icon: Waves, label: "Relaxation", color: "from-secondary/20 to-secondary/5" },
    { icon: Users, label: "Social", color: "from-mood-social/20 to-mood-social/5" },
    { icon: Palette, label: "Creative", color: "from-mood-creative/20 to-mood-creative/5" },
    { icon: Heart, label: "Romantic", color: "from-primary/20 to-primary/5" },
    { icon: Music, label: "Entertainment", color: "from-accent/20 to-accent/5" },
];

const Categories = () => {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        How do you want to <span className="gradient-text">feel</span>?
                    </h2>
                    <p className="text-muted-foreground text-lg">Choose your mood, discover your experience</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                            className={`glass-card p-6 text-center cursor-pointer bg-gradient-to-b ${cat.color} hover:shadow-lg transition-shadow duration-300`}
                        >
                            <cat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                            <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
