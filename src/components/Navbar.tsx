import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import feeloraLogo from "@/assets/feelora-logo.svg";

const navItems = [
    { path: "/", label: "Home" },
    { path: "/corporate", label: "Corporate" },
    { path: "/explore", label: "Explore" },
    { path: "/calendar", label: "Calendar" },
    { path: "/profile", label: "Profile" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === "/" || location.pathname === "/corporate";

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 ${isHome ? "glass-dark" : "glass-card"
                }`}
        >
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        src={feeloraLogo}
                        alt="Feelora"
                        className="h-10 w-auto object-contain sm:h-11"
                    />
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === item.path
                                    ? isHome
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "bg-primary/10 text-primary"
                                    : isHome
                                        ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`md:hidden p-2 rounded-xl ${isHome ? "text-primary-foreground" : "text-foreground"}`}
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`md:hidden border-t ${isHome ? "border-white/10" : "border-border"}`}
                    >
                        <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path
                                            ? isHome
                                                ? "bg-primary-foreground/20 text-primary-foreground"
                                                : "bg-primary/10 text-primary"
                                            : isHome
                                                ? "text-primary-foreground/70"
                                                : "text-muted-foreground"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
