import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, MapPin, X } from "lucide-react";
import Navbar from "@/components/Navbar";

interface CalendarEvent {
    id: number;
    title: string;
    date: string;
    time: string;
    mood: "relaxing" | "exciting" | "social" | "adventure" | "creative";
    location: string;
    description: string;
}

const events: CalendarEvent[] = [
    { id: 1, title: "Sunrise Yoga", date: "2026-04-06", time: "6:00 AM", mood: "relaxing", location: "Hilltop Park", description: "Start your week with peaceful mountain yoga" },
    { id: 2, title: "Cooking Class", date: "2026-04-08", time: "6:30 PM", mood: "social", location: "Chef's Studio", description: "Italian pasta masterclass with friends" },
    { id: 3, title: "Lake Kayaking", date: "2026-04-10", time: "9:00 AM", mood: "adventure", location: "Crystal Lake", description: "4-hour expedition through the canyon" },
    { id: 4, title: "Wine Tasting", date: "2026-04-12", time: "5:00 PM", mood: "exciting", location: "Sunset Vineyard", description: "Sample premium wines at golden hour" },
    { id: 5, title: "Art Workshop", date: "2026-04-15", time: "2:00 PM", mood: "creative", location: "Studio Bloom", description: "Watercolor painting for beginners" },
    { id: 6, title: "Jazz Night", date: "2026-04-18", time: "8:00 PM", mood: "social", location: "Blue Note Club", description: "Live jazz performance evening" },
    { id: 7, title: "Forest Hike", date: "2026-04-20", time: "7:00 AM", mood: "adventure", location: "Emerald Trail", description: "Guided nature trail exploration" },
    { id: 8, title: "Beach Meditation", date: "2026-04-22", time: "6:30 AM", mood: "relaxing", location: "Coral Beach", description: "Guided mindfulness by the ocean" },
];

const moodConfig: Record<string, { bg: string; border: string; dot: string; label: string }> = {
    relaxing: { bg: "bg-secondary/10", border: "border-secondary/30", dot: "bg-secondary", label: "Relaxing" },
    exciting: { bg: "bg-primary/10", border: "border-primary/30", dot: "bg-primary", label: "Exciting" },
    social: { bg: "bg-mood-social/10", border: "border-mood-social/30", dot: "bg-mood-social", label: "Social" },
    adventure: { bg: "bg-mood-adventure/10", border: "border-mood-adventure/30", dot: "bg-mood-adventure", label: "Adventure" },
    creative: { bg: "bg-mood-creative/10", border: "border-mood-creative/30", dot: "bg-mood-creative", label: "Creative" },
};

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); // April 2026
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [view, setView] = useState<"month" | "timeline">("timeline");

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    const getEventsForDay = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return events.filter((e) => e.date === dateStr);
    };

    const timelineEvents = events
        .filter((e) => {
            const d = new Date(e.date);
            return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                            Your Emotional <span className="gradient-text">Roadmap</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">Plan your journey to joy</p>
                    </motion.div>

                    {/* View toggle */}
                    <div className="flex gap-2 mb-6">
                        {(["timeline", "month"] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${view === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>

                    {/* Month navigation */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 rounded-xl hover:bg-muted transition-colors">
                                <ChevronLeft className="w-5 h-5 text-foreground" />
                            </button>
                            <h2 className="text-xl font-bold text-foreground">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h2>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 rounded-xl hover:bg-muted transition-colors">
                                <ChevronRight className="w-5 h-5 text-foreground" />
                            </button>
                        </div>

                        {/* Mood legend */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {Object.entries(moodConfig).map(([key, val]) => (
                                <div key={key} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${val.dot}`} />
                                    <span className="text-xs text-muted-foreground">{val.label}</span>
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {view === "month" ? (
                                <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {/* Calendar grid */}
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                                            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: firstDay }).map((_, i) => (
                                            <div key={`empty-${i}`} className="h-20" />
                                        ))}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const day = i + 1;
                                            const dayEvents = getEventsForDay(day);
                                            const isToday = day === 4;
                                            return (
                                                <motion.div
                                                    key={day}
                                                    whileHover={{ scale: 1.05 }}
                                                    className={`h-20 rounded-xl p-2 border transition-all cursor-pointer ${isToday ? "border-primary bg-primary/5" : "border-transparent hover:border-border hover:bg-muted/30"
                                                        }`}
                                                >
                                                    <span className={`text-sm font-medium ${isToday ? "text-primary" : "text-foreground"}`}>{day}</span>
                                                    <div className="mt-1 space-y-0.5">
                                                        {dayEvents.map((ev) => (
                                                            <button
                                                                key={ev.id}
                                                                onClick={() => setSelectedEvent(ev)}
                                                                className={`w-full text-left text-xs px-1.5 py-0.5 rounded ${moodConfig[ev.mood].bg} ${moodConfig[ev.mood].border} border truncate`}
                                                            >
                                                                {ev.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                                    {/* Timeline */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                                    <div className="space-y-6 pl-14">
                                        {timelineEvents.map((ev, i) => {
                                            const d = new Date(ev.date);
                                            const config = moodConfig[ev.mood];
                                            return (
                                                <motion.div
                                                    key={ev.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    onClick={() => setSelectedEvent(ev)}
                                                    className={`relative glass-card p-5 cursor-pointer hover-lift ${config.bg} border ${config.border}`}
                                                >
                                                    {/* Timeline dot */}
                                                    <div className={`absolute -left-[2.65rem] top-6 w-4 h-4 rounded-full ${config.dot} border-4 border-background`} />
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground font-medium mb-1">
                                                                {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                                            </p>
                                                            <h3 className="font-semibold text-foreground text-lg">{ev.title}</h3>
                                                            <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>
                                                        </div>
                                                        <div className="text-right shrink-0 ml-4">
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                <span className="text-xs">{ev.time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-muted-foreground mt-1">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                <span className="text-xs">{ev.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Event detail modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/30 backdrop-blur-sm"
                        onClick={() => setSelectedEvent(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`glass-card p-8 max-w-md w-full ${moodConfig[selectedEvent.mood].bg}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-3 h-3 rounded-full ${moodConfig[selectedEvent.mood].dot} mt-2`} />
                                <button onClick={() => setSelectedEvent(null)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">{selectedEvent.title}</h3>
                            <p className="text-muted-foreground mb-4">{selectedEvent.description}</p>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{selectedEvent.time}</div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{selectedEvent.location}</div>
                            </div>
                            <button className="mt-6 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                                View Details
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Calendar;
