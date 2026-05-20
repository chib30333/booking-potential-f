import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import AuthShell from "@/features/auth/components/AuthShell";
import AuthTextField from "@/features/auth/components/AuthTextField";
import { resetPassword } from "@/shared/api/auth";

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const mutation = useMutation({
    mutationFn: resetPassword,
  });

  return (
    <AuthShell
      title={t("auth.reset.shellTitle")}
      description={t("auth.reset.shellDescription")}
      footer={
        <span>
          {t("auth.reset.footerPrompt")}{" "}
          <Link to="/forgot-password" className="font-semibold text-primary hover:text-primary/80">
            {t("auth.reset.footerCta")}
          </Link>
        </span>
      }
    >
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          await mutation.mutateAsync(
            { token, password, confirmPassword },
            {
              onSuccess: () => {
                window.setTimeout(() => navigate("/login"), 1200);
              },
            }
          );
        }}
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t("auth.reset.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("auth.reset.subtitle")}</p>
        </div>

        {!token ? (
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t("auth.reset.missingToken")}
          </div>
        ) : null}

        <AuthTextField
          label={t("auth.common.newPassword")}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder={t("auth.common.passwordPlaceholder")}
        />

        <AuthTextField
          label={t("auth.common.confirmPassword")}
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          placeholder={t("auth.common.confirmPlaceholder")}
        />

        {mutation.isSuccess ? (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {mutation.data.message} {t("auth.reset.successSuffix")}
          </div>
        ) : null}

        {mutation.isError ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {mutation.error instanceof Error
              ? mutation.error.message
              : t("auth.reset.errorFallback")}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending || !token}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mutation.isPending ? t("auth.reset.submitting") : t("auth.reset.submit")}
        </button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
