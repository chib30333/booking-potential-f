import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  CreditCard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { getMe } from "@/shared/api/auth";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { getStoredAccessToken } from "@/shared/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/corporate", label: "Corporate" },
  { path: "/explore", label: "Explore" },
  { path: "/calendar", label: "Calendar" },
  { path: "/profile", label: "Profile" },
];

const accountLinks = [
  { label: "Account", path: "/profile", icon: User },
  { label: "Billing", path: "/", icon: CreditCard },
  { label: "Settings", path: "/", icon: Settings },
];

const notifications = [
  "Your Explore shortlist has 3 new matches.",
  "Calendar reminder: pottery class tomorrow at 11:00.",
];

function buildDisplayName(user?: {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
}) {
  return (
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Account"
  );
}

function buildInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const token = getStoredAccessToken();
  const { logoutMutation } = useAuthSession();
  const meQuery = useQuery({
    queryKey: ["auth-me"],
    queryFn: getMe,
    enabled: Boolean(token),
  });
  const isAuthenticated = Boolean(token && meQuery.data);
  const displayName = buildDisplayName(meQuery.data);
  const initials = buildInitials(displayName);
  const accountSubtitle =
    meQuery.data?.role === "PROVIDER" ? "Provider account" : "Member account";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    setIsAccountOpen(false);
  }, [isAuthenticated, location.pathname]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <motion.nav
        animate={{
          paddingTop: isScrolled ? "0.8rem" : "1rem",
          paddingBottom: isScrolled ? "0.8rem" : "1rem",
        }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className={cn(
          "flex w-full items-center justify-between gap-4 px-4 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:px-5",
          isScrolled
            ? "header-shell shadow-[0_26px_70px_rgba(15,23,42,0.14)]"
            : "border border-transparent bg-transparent shadow-none backdrop-blur-0",
        )}
      >
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 via-cyan-400 to-indigo-500 text-white shadow-[0_14px_28px_rgba(56,189,248,0.35)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[0.34em] text-slate-900 uppercase">
              Feelora
            </p>
            <p className="truncate text-xs text-slate-500">
              Curated escapes for every mood
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full bg-white/65 p-1 lg:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsAccountOpen(false)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 transition-colors hover:bg-slate-50"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-white/90" />
              </button>

              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((open) => !open)}
                  className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white/88 px-3 py-2 transition-colors hover:bg-white"
                  aria-label="Account menu"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-fuchsia-500 via-pink-500 to-orange-400 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(244,114,182,0.35)]">
                    {initials}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-violet-500">{accountSubtitle}</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-slate-500 transition-transform duration-300",
                      isAccountOpen && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isAccountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-[calc(100%+0.75rem)] w-80 overflow-hidden rounded-[28px] border border-white/80 bg-white/96 p-3 shadow-[0_26px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
                    >
                      <div className="rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4 text-white">
                        <p className="text-sm text-white/60">Signed in as</p>
                        <p className="mt-1 text-lg font-semibold">{displayName}</p>
                        <p className="mt-2 text-sm leading-6 text-white/72">
                          Manage your profile, upcoming plans, and premium perks.
                        </p>
                      </div>

                      <div className="mt-3 rounded-3xl bg-slate-50 p-3">
                        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                          Latest Updates
                        </p>
                        <div className="space-y-2">
                          {notifications.map((item) => (
                            <div
                              key={item}
                              className="rounded-2xl bg-white px-3 py-2.5 text-sm text-slate-600"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        {accountLinks.map((item) => {
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.label}
                              to={item.path}
                              onClick={() => setIsAccountOpen(false)}
                              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Icon className="h-4 w-4 text-slate-500" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => logoutMutation.mutate()}
                        className="mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-[20px] border border-slate-200 bg-white/88 px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-[20px] bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/85 text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.22 }}
            className="mt-3 w-full overflow-hidden md:hidden"
          >
            <div className="header-shell rounded-[30px] p-4">
              {isAuthenticated ? (
                <div className="mb-4 rounded-[24px] bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 font-semibold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm text-white/60">{displayName}</p>
                      <p className="text-base font-semibold">{accountSubtitle}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              <div className="space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      {item.label}
                      <ChevronDown className="-rotate-90 h-4 w-4" />
                    </Link>
                  );
                })}
              </div>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logoutMutation.mutate();
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
