import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

const AuthShell = ({ title, description, children, footer }: AuthShellProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(136,94,255,0.20),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(80,214,196,0.12),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,1),_rgba(244,247,251,0.96))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 via-cyan-400 to-indigo-500 text-white shadow-[0_14px_28px_rgba(56,189,248,0.35)]">
              <img src={logo} alt="Feelora logo" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.34em] text-slate-900 uppercase">
                Feelora
              </p>
              <p className="text-xs text-slate-500">Curated escapes for every mood</p>
            </div>
          </Link>

          <Link
            to="/"
            className="rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
          >
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]"
          >
            <div className="hidden rounded-[32px] bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] lg:block">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary" />
                Emotional wellness starts here
              </div>
              <h1 className="mt-8 text-4xl font-bold leading-tight">{title}</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">
                {description}
              </p>
              <div className="mt-10 grid gap-4">
                {[
                  "Curated experiences matched to your energy and mood",
                  "Booking flows that stay connected to real provider data",
                  "A cleaner MVP foundation without changing the product UI",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-sm text-white/80"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[32px] p-8 md:p-10">
              <div className="mb-8 lg:hidden">
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                <p className="mt-3 text-muted-foreground">{description}</p>
              </div>
              {children}
              <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
                {footer}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
