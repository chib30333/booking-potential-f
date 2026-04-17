import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/features/auth/components/AuthShell";
import AuthTextField from "@/features/auth/components/AuthTextField";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";

const Signup = () => {
  const navigate = useNavigate();
  const { registerMutation } = useAuthSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

  return (
    <AuthShell
      title="Create your Feelora account"
      description="Join as a customer or provider without changing the product’s current experience-driven interface."
      footer={
        <span>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            Sign in
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
              onSuccess: () => navigate("/profile"),
            }
          );
        }}
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground">Sign up</h2>
          <p className="mt-2 text-muted-foreground">
            Create an account to start booking or listing experiences.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AuthTextField
            label="First name"
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
            placeholder="Ava"
          />
          <AuthTextField
            label="Last name"
            value={lastName}
            onChange={setLastName}
            autoComplete="family-name"
            placeholder="Morgan"
          />
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
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
        />

        <div>
          <span className="mb-2 block text-sm font-medium text-foreground">Account type</span>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                value: "CUSTOMER" as const,
                label: "Customer",
                description: "Book and manage experiences.",
              },
              {
                value: "PROVIDER" as const,
                label: "Provider",
                description: "Offer services and manage bookings.",
              },
            ].map((option) => (
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
              : "Unable to create the account right now."}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {registerMutation.isPending ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Signup;
