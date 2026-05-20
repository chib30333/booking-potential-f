import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthShell from "@/features/auth/components/AuthShell";
import AuthTextField from "@/features/auth/components/AuthTextField";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { getDefaultRedirectPath } from "@/features/auth/lib/redirectByRole";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMutation } = useAuthSession();
  const fromState = (location.state as { from?: string } | null)?.from;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title={t("auth.login.shellTitle")}
      description={t("auth.login.shellDescription")}
      footer={
        <span>
          {t("auth.login.footerPrompt")}{" "}
          <Link to="/signup" className="font-semibold text-primary hover:text-primary/80">
            {t("auth.login.footerCta")}
          </Link>
        </span>
      }
    >
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          await loginMutation.mutateAsync(
            { email, password },
            {
              onSuccess: (result) => {
                const dest = fromState ?? getDefaultRedirectPath(result.user.role);
                navigate(dest, { replace: true });
              },
            }
          );
        }}
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t("auth.login.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("auth.login.subtitle")}</p>
        </div>

        <AuthTextField
          label={t("auth.common.email")}
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder={t("auth.common.emailPlaceholder")}
        />

        <AuthTextField
          label={t("auth.common.password")}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder={t("auth.login.passwordPlaceholder")}
        />

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">{t("auth.login.secureNote")}</span>
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
            {t("auth.common.forgotPassword")}
          </Link>
        </div>

        {loginMutation.isError ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : t("auth.login.errorFallback")}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loginMutation.isPending ? t("auth.login.submitting") : t("auth.login.submit")}
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
