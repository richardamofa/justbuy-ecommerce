import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentAdmin } from "../hooks/useAdminAuth.js";

export function AdminRoute() {
  const location = useLocation();
  const { data: admin, isLoading, isError } = useCurrentAdmin();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-neutral-500">Checking session...</p>
      </div>
    );
  }

  if (isError || !admin) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}