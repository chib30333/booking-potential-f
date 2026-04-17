import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AuthShell from "@/features/auth/components/AuthShell";
import AuthTextField from "@/features/auth/components/AuthTextField";
import { forgotPassword } from "@/shared/api/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: forgotPassword,
  });

  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we’ll generate a secure reset link for your account."
      footer={
        <span>
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            Back to login
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
          <h2 className="text-3xl font-bold text-foreground">Forgot password</h2>
          <p className="mt-2 text-muted-foreground">
            We&apos;ll send password reset instructions if the account exists.
          </p>
        </div>

        <AuthTextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="you@example.com"
        />

        {mutation.isSuccess ? (
          <div className="space-y-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p>{mutation.data.message}</p>
            {mutation.data.debugResetUrl ? (
              <a
                className="font-semibold text-primary hover:text-primary/80"
                href={mutation.data.debugResetUrl}
              >
                Open debug reset link
              </a>
            ) : null}
          </div>
        ) : null}

        {mutation.isError ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Unable to request a reset right now."}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mutation.isPending ? "Sending reset link..." : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
