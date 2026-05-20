import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import AuthShell from "@/features/auth/components/AuthShell";
import AuthTextField from "@/features/auth/components/AuthTextField";
import { forgotPassword } from "@/shared/api/auth";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: forgotPassword,
  });

  return (
    <AuthShell
      title={t("auth.forgot.shellTitle")}
      description={t("auth.forgot.shellDescription")}
      footer={
        <span>
          {t("auth.forgot.footerPrompt")}{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            {t("auth.forgot.footerCta")}
          </Link>
        </span>
      }
    >
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          await mutation.mutateAsync(email);
        }}
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t("auth.forgot.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("auth.forgot.subtitle")}</p>
        </div>

        <AuthTextField
          label={t("auth.common.email")}
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder={t("auth.common.emailPlaceholder")}
        />

        {mutation.isSuccess ? (
          <div className="space-y-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p>{mutation.data.message}</p>
            {mutation.data.debugResetUrl ? (
              <a
                className="font-semibold text-primary hover:text-primary/80"
                href={mutation.data.debugResetUrl}
              >
                {t("auth.forgot.debugLink")}
              </a>
            ) : null}
          </div>
        ) : null}

        {mutation.isError ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {mutation.error instanceof Error
              ? mutation.error.message
              : t("auth.forgot.errorFallback")}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mutation.isPending ? t("auth.forgot.submitting") : t("auth.forgot.submit")}
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
