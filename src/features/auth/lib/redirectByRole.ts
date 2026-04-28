import type { UserRole } from "@/shared/types/api";

export function getDefaultRedirectPath(role: UserRole): string {
  switch (role) {
    case "PROVIDER":
      return "/provider";
    case "MANAGER":
    case "ADMIN":
      return "/admin";
    case "CUSTOMER":
    default:
      return "/";
  }
}
