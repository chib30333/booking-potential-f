import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Building2, CheckCircle2, MapPin, Sparkles, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero.png";
import yogaImage from "@/assets/activity-yoga.jpg";
import potteryImage from "@/assets/activity-pottery.jpg";
import driftingImage from "@/assets/activity-drifting.jpg";
import artImage from "@/assets/exp-art.jpg";

const benefits = [
    {
        title: "AI Joy Map for teams",
        description: "Weekly emotional wellness recommendations shaped around energy, stress, recovery, and team culture goals.",
        icon: BrainCircuit,
    },
    {
        title: "Curated provider network",
        description: "Book trusted classes, workshops, SPA sessions, and wellness formats from one coordinated platform.",
        icon: Building2,
    },
    {
        title: "Clear outcomes for HR",
        description: "Turn wellness budgets into visible participation, repeat engagement, and healthier routines across teams.",
        icon: Users,
    },
];

const howItWorks = [
    "Share team size, city coverage, and wellness goals",
    "Launch employee onboarding and Joy Map recommendations",
    "Offer bookable wellness experiences by city and category",
    "Track engagement patterns and refine future campaigns",
];

const categories = [
    { title: "Yoga & Mindfulness", image: yogaImage },
    { title: "Creative Workshops", image: potteryImage },
    { title: "Energy & Team Reset", image: driftingImage },
];

const faqs = [
    {
        question: "Who is the corporate page for?",
        answer: "HR leaders, people operations teams, and workplace wellness decision-makers exploring employee emotional wellness programs.",
    },
    {
        question: "What makes Joy Map different?",
        answer: "It combines wellness discovery, emotional preference signals, and weekly AI-guided recommendations instead of offering a flat directory only.",
    },
    {
        question: "Can this work across multiple cities?",
        answer: "Yes. The corporate concept is built around multi-city teams and category-based supply matching.",
    },
];

const Corporate = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="relative overflow-hidden pt-28 pb-20">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(142,92,255,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(49,193,171,0.18),_transparent_30%),linear-gradient(135deg,_rgba(8,15,28,0.96),_rgba(20,32,54,0.92)_42%,_rgba(34,23,62,0.96))]" />
                    <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_left,_rgba(255,255,255,0.08),_transparent_48%)]" />
                </div>

                <div className="relative container mx-auto px-6">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Emotional wellness for modern teams
                            </div>

                            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
                                A corporate wellness layer powered by <span className="gradient-text">Joy Map</span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                                Give teams a calmer, more intentional path to wellbeing with AI-guided emotional wellness plans,
                                curated providers, and city-based booking experiences.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:bg-primary/90">
                                    Talk to sales
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <button className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition-all hover:bg-white/15">
                                    See how it works
                                </button>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                {["Multi-city programs", "Bookable experiences", "AI-guided recommendations"].map((item) => (
                                    <div key={item} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-sm text-white/80 backdrop-blur">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 blur-2xl" />
                            <div className="relative grid gap-4 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <img src={yogaImage} alt="Team yoga experience" className="h-52 w-full rounded-[1.75rem] object-cover shadow-2xl shadow-black/25" />
                                    <img src={artImage} alt="Creative wellness session" className="h-44 w-full rounded-[1.75rem] object-cover shadow-2xl shadow-black/25" />
                                </div>
                                <div className="space-y-4 pt-8">
                                    <img src={potteryImage} alt="Workshop experience" className="h-44 w-full rounded-[1.75rem] object-cover shadow-2xl shadow-black/25" />
                                    <img src={driftingImage} alt="Energy reset experience" className="h-52 w-full rounded-[1.75rem] object-cover shadow-2xl shadow-black/25" />
                                </div>
                            </div>
                            <div className="relative mt-5 glass-card overflow-hidden p-3">
                                <img src={heroImage} alt="Product preview" className="h-full w-full rounded-2xl object-cover" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="mb-14 max-w-3xl">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Why companies choose Feelora</p>
                        <h2 className="text-3xl font-bold text-foreground md:text-5xl">
                            Wellness that feels personalized, measurable, and easy to launch
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-8"
                            >
                                <benefit.icon className="mb-5 h-10 w-10 text-primary" />
                                <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                                <p className="mt-3 text-muted-foreground leading-7">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                        <div>
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">How it works</p>
                            <h2 className="text-3xl font-bold text-foreground md:text-5xl">
                                Launch a corporate wellness program in a few structured steps
                            </h2>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                                The corporate page presents Feelora as a startup-ready solution for HR and people teams,
                                while keeping the product language aligned with emotional wellness and Joy Map.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {howItWorks.map((step, index) => (
                                <div key={step} className="glass-card flex items-start gap-4 p-6">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                        {index + 1}
                                    </div>
                                    <p className="pt-2 text-foreground">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="mb-14 max-w-3xl">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Program highlights</p>
                        <h2 className="text-3xl font-bold text-foreground md:text-5xl">
                            Designed for calm, recovery, joy, and team energy
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {categories.map((category, index) => (
                            <motion.article
                                key={category.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
                            >
                                <img src={category.image} alt={category.title} className="h-64 w-full object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                                    <p className="mt-3 text-muted-foreground">
                                        Flexible programming for onsite sessions, partner studios, and city-based wellness experiences.
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
                        <div className="glass-card p-8 md:p-10">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">What’s included</p>
                            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                                A clean corporate MVP story without redesigning the existing product UI
                            </h2>
                            <div className="mt-8 grid gap-4">
                                {[
                                    "Corporate landing experience and startup-style messaging",
                                    "Joy Map explanation for employee wellness programs",
                                    "City and category framing for scalable rollout",
                                    "Clear CTA structure for future sales or demo conversion",
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3 rounded-2xl bg-background/70 p-4">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                        <span className="text-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-8 md:p-10">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Ideal buyers</p>
                            <div className="space-y-4">
                                {[
                                    { icon: Building2, title: "HR & People Ops", text: "For retention, culture, and wellbeing program planning." },
                                    { icon: Users, title: "Team leads", text: "For recurring experiences that build energy and connection." },
                                    { icon: MapPin, title: "Multi-city teams", text: "For distributed organizations needing location-aware options." },
                                ].map((item) => (
                                    <div key={item.title} className="rounded-2xl bg-background/70 p-5">
                                        <item.icon className="mb-3 h-6 w-6 text-primary" />
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="mb-10 max-w-3xl">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">FAQ</p>
                        <h2 className="text-3xl font-bold text-foreground md:text-5xl">Answers for the corporate conversation</h2>
                    </div>

                    <div className="grid gap-4">
                        {faqs.map((faq) => (
                            <div key={faq.question} className="glass-card p-6">
                                <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                                <p className="mt-2 text-muted-foreground leading-7">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="border-t border-border bg-muted/20 py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm text-muted-foreground">Corporate page for Feelora. Existing product UI remains unchanged.</p>
                </div>
            </footer>
        </div>
    );
};

export default Corporate;
