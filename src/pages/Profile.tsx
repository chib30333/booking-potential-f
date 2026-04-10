import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Heart, Star, TrendingUp, DollarSign, Users, Award } from "lucide-react";
import Navbar from "@/components/Navbar";

const Profile = () => {
    const [isProvider, setIsProvider] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                                    AJ
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">Alex Johnson</h1>
                                    <p className="text-muted-foreground">Emotion explorer since 2025</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-medium ${!isProvider ? "text-primary" : "text-muted-foreground"}`}>Customer</span>
                                <button
                                    onClick={() => setIsProvider(!isProvider)}
                                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isProvider ? "bg-primary" : "bg-muted"}`}
                                >
                                    <motion.div
                                        layout
                                        className="absolute top-1 w-5 h-5 rounded-full bg-primary-foreground shadow-md"
                                        style={{ left: isProvider ? "calc(100% - 24px)" : "4px" }}
                                    />
                                </button>
                                <span className={`text-sm font-medium ${isProvider ? "text-primary" : "text-muted-foreground"}`}>Provider</span>
                            </div>
                        </div>
                    </motion.div>

                    {!isProvider ? (
                        /* Customer Dashboard */
                        <motion.div key="customer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[
                                    { icon: Calendar, label: "Booked", value: "24", color: "text-primary" },
                                    { icon: Star, label: "Completed", value: "18", color: "text-mood-adventure" },
                                    { icon: Heart, label: "Favorites", value: "12", color: "text-mood-social" },
                                    { icon: Award, label: "Joy Score", value: "92%", color: "text-mood-creative" },
                                ].map((stat, i) => (
                                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center hover-lift">
                                        <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Emotional Stats */}
                            <div className="glass-card p-6 mb-8">
                                <h2 className="text-lg font-bold text-foreground mb-6">Emotional Journey</h2>
                                <div className="space-y-4">
                                    {[
                                        { mood: "Relaxation", pct: 35, color: "bg-secondary" },
                                        { mood: "Adventure", pct: 28, color: "bg-mood-adventure" },
                                        { mood: "Social", pct: 20, color: "bg-mood-social" },
                                        { mood: "Creative", pct: 12, color: "bg-mood-creative" },
                                        { mood: "Romantic", pct: 5, color: "bg-primary" },
                                    ].map((item) => (
                                        <div key={item.mood}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-foreground font-medium">{item.mood}</span>
                                                <span className="text-muted-foreground">{item.pct}%</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.pct}%` }}
                                                    transition={{ duration: 1, delay: 0.3 }}
                                                    className={`h-full rounded-full ${item.color}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent bookings */}
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold text-foreground mb-4">Recent Bookings</h2>
                                <div className="space-y-3">
                                    {[
                                        { title: "Sunrise Yoga", date: "Apr 6", status: "Upcoming", mood: "relaxing" },
                                        { title: "Cooking Class", date: "Mar 28", status: "Completed", mood: "social" },
                                        { title: "Lake Kayaking", date: "Mar 20", status: "Completed", mood: "adventure" },
                                    ].map((booking) => (
                                        <div key={booking.title} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${booking.mood === "relaxing" ? "bg-secondary" : booking.mood === "social" ? "bg-mood-social" : "bg-mood-adventure"}`} />
                                                <div>
                                                    <p className="font-medium text-foreground">{booking.title}</p>
                                                    <p className="text-sm text-muted-foreground">{booking.date}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${booking.status === "Upcoming" ? "bg-primary/10 text-primary" : "bg-mood-creative/10 text-mood-creative"}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Provider Dashboard */
                        <motion.div key="provider" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[
                                    { icon: Calendar, label: "Total Bookings", value: "156", color: "text-primary" },
                                    { icon: DollarSign, label: "Revenue", value: "$12,480", color: "text-mood-creative" },
                                    { icon: Users, label: "Customers", value: "89", color: "text-secondary" },
                                    { icon: TrendingUp, label: "Growth", value: "+24%", color: "text-mood-adventure" },
                                ].map((stat, i) => (
                                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center hover-lift">
                                        <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Revenue chart placeholder */}
                            <div className="glass-card p-6 mb-8">
                                <h2 className="text-lg font-bold text-foreground mb-4">Revenue Overview</h2>
                                <div className="flex items-end gap-2 h-40">
                                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.05 }}
                                            className="flex-1 rounded-t-lg bg-gradient-to-t from-primary to-secondary opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                                        <span key={m}>{m}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold text-foreground mb-4">Subscription</h2>
                                <p className="text-muted-foreground mb-4">Upgrade to reach more customers and unlock analytics.</p>
                                <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105">
                                    Upgrade to Pro — $29/mo
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
