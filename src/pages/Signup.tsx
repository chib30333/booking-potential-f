import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthShell from "@/features/auth/components/AuthShell";
import AuthTextField from "@/features/auth/components/AuthTextField";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { getDefaultRedirectPath } from "@/features/auth/lib/redirectByRole";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerMutation } = useAuthSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

  const roleOptions = [
    {
      value: "CUSTOMER" as const,
      label: t("auth.signup.customer"),
      description: t("auth.signup.customerDescription"),
    },
    {
      value: "PROVIDER" as const,
      label: t("auth.signup.provider"),
      description: t("auth.signup.providerDescription"),
    },
  ];

  return (
    <AuthShell
      title={t("auth.signup.shellTitle")}
      description={t("auth.signup.shellDescription")}
      footer={
        <span>
          {t("auth.signup.footerPrompt")}{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            {t("auth.signup.footerCta")}
          </Link>
        </span>
      }
    >
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          await registerMutation.mutateAsync(
            { email, password, firstName, lastName, role },
            {
              onSuccess: (result) =>
                navigate(getDefaultRedirectPath(result.user.role), { replace: true }),
            }
          );
        }}
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t("auth.signup.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("auth.signup.subtitle")}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AuthTextField
            label={t("auth.common.firstName")}
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
            placeholder={t("auth.common.firstNamePlaceholder")}
          />
          <AuthTextField
            label={t("auth.common.lastName")}
            value={lastName}
            onChange={setLastName}
            autoComplete="family-name"
            placeholder={t("auth.common.lastNamePlaceholder")}
          />
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
          autoComplete="new-password"
          placeholder={t("auth.common.passwordPlaceholder")}
        />

        <div>
          <span className="mb-2 block text-sm font-medium text-foreground">
            {t("auth.signup.accountType")}
          </span>
          <div className="grid gap-3 md:grid-cols-2">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                  role === option.value
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-border bg-muted/30 text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="font-semibold">{option.label}</div>
                <div
                  className={`mt-1 text-sm ${
                    role === option.value ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {registerMutation.isError ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {registerMutation.error instanceof Error
              ? registerMutation.error.message
              : t("auth.signup.errorFallback")}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {registerMutation.isPending ? t("auth.signup.submitting") : t("auth.signup.submit")}
        </button>
      </form>
    </AuthShell>
  );
};

export default Signup;
