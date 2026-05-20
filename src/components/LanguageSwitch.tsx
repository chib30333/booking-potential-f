import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES, setLocale, type SupportedLocale } from "@/shared/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitchProps {
  className?: string;
  variant?: "pill" | "inline";
}

const LABELS: Record<SupportedLocale, string> = {
  ru: "RU",
  en: "EN",
};

const LanguageSwitch = ({ className, variant = "pill" }: LanguageSwitchProps) => {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "ru").slice(0, 2) as SupportedLocale;

  return (
    <div
      className={cn(
        variant === "pill"
          ? "inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white/80 p-0.5"
          : "inline-flex items-center gap-1",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {SUPPORTED_LOCALES.map((lng) => {
        const active = current === lng;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => setLocale(lng)}
            className={cn(
              "rounded-full px-2.5 py-2 text-xs font-semibold transition-colors",
              active
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-900",
            )}
            aria-pressed={active}
          >
            {LABELS[lng]}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitch;
