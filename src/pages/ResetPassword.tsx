import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AuthShell from "@/features/auth/components/AuthShell";
import AuthTextField from "@/features/auth/components/AuthTextField";
import { resetPassword } from "@/shared/api/auth";

const ResetPassword = () => {
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
      title="Choose a new password"
      description="Set a fresh password for your account using the secure reset token from your email."
      footer={
        <span>
          Need a new link?{" "}
          <Link to="/forgot-password" className="font-semibold text-primary hover:text-primary/80">
            Request another reset email
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
          <h2 className="text-3xl font-bold text-foreground">Reset password</h2>
          <p className="mt-2 text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        {!token ? (
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This reset link is missing its token. Request a new password reset email.
          </div>
        ) : null}

        <AuthTextField
          label="New password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
        />

        <AuthTextField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />

        {mutation.isSuccess ? (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {mutation.data.message} Redirecting to login...
          </div>
        ) : null}

        {mutation.isError ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Unable to reset the password right now."}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending || !token}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mutation.isPending ? "Resetting password..." : "Reset password"}
        </button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
