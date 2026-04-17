import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, register } from "@/shared/api/auth";
import { setStoredAccessToken } from "@/shared/lib/auth";
import type { UserRole } from "@/shared/types/api";

export function useAuthSession() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      login(input.email, input.password),
    onSuccess: (result) => {
      setStoredAccessToken(result.accessToken);
      void queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (input: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      role: Extract<UserRole, "CUSTOMER" | "PROVIDER">;
    }) => register(input),
    onSuccess: (result) => {
      setStoredAccessToken(result.accessToken);
      void queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setStoredAccessToken(null);
      void queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
  };
}
