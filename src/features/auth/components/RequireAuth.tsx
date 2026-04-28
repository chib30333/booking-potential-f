import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthMe } from "@/features/auth/hooks/useAuthMe";
import { getStoredAccessToken } from "@/shared/lib/auth";
import type { UserRole } from "@/shared/types/api";

interface RequireAuthProps {
  children: ReactNode;
  roles?: UserRole[];
}

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const location = useLocation();
  const token = getStoredAccessToken();
  const meQuery = useAuthMe();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (meQuery.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Loading your session...
      </div>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(meQuery.data.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
