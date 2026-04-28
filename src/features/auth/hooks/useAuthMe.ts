import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/shared/lib/http";
import { getMe } from "@/shared/api/auth";
import { getStoredAccessToken, setStoredAccessToken } from "@/shared/lib/auth";

export const AUTH_ME_QUERY_KEY = ["auth-me"] as const;

export function useAuthMe() {
  const token = getStoredAccessToken();

  return useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: async () => {
      try {
        return await getMe();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setStoredAccessToken(null);
        }
        throw error;
      }
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: 60_000,
  });
}
