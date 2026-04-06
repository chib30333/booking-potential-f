import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const suggestedPrompts = [
    "I feel bored",
    "Plan my weekend",
    "I want something exciting",
];

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
                {!imageLoaded && (
                    <div className="absolute inset-0 gradient-bg" />
                )}
                <motion.img
                    src={heroBg}
                    alt="St. Basil's Cathedral at sunset, Moscow Red Square"
                    width={1920}
                    height={1080}
                    onLoad={() => setImageLoaded(true)}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 1.1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
                    >
                        Your life, full of{" "}
                        <span className="gradient-text">emotions</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="text-primary-foreground/70 text-lg md:text-xl mb-10 max-w-xl mx-auto"
                    >
                        Discover experiences that make you feel alive. Let our AI guide you to your next moment of joy.
                    </motion.p>

                    {/* AI Chatbox */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="glass rounded-2xl p-6 max-w-2xl mx-auto animate-pulse-glow"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="text-primary-foreground/80 text-sm font-medium">
                                AI Experience Assistant
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="How do you want to feel today?"
                                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Suggested prompts */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {suggestedPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => setQuery(prompt)}
                                    className="text-sm px-4 py-2 rounded-full bg-white/10 text-primary-foreground/70 hover:bg-white/20 hover:text-primary-foreground transition-all duration-300 border border-white/10"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center pt-2"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
