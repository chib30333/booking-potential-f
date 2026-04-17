import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/features/auth/components/AuthShell";
import AuthTextField from "@/features/auth/components/AuthTextField";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";

const Login = () => {
  const navigate = useNavigate();
  const { loginMutation } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title="Welcome back to Feelora"
      description="Sign in to manage bookings, discover new experiences, and keep your emotional roadmap in sync."
      footer={
        <span>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:text-primary/80">
            Create one
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
              onSuccess: () => navigate("/profile"),
            }
          );
        }}
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground">Login</h2>
          <p className="mt-2 text-muted-foreground">
            Use your email and password to continue.
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

        <AuthTextField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            Secure session with refresh-token cookie support.
          </span>
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
            Forgot password?
          </Link>
        </div>

        {loginMutation.isError ? (
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : "Unable to sign in right now."}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
