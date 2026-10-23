import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentAdmin } from "../hooks/useAdminAuth.js";
import { ApiRequestError } from "../lib/api-client.js";
import { AdminLoadError } from "./AdminLoadError";

export function AdminRoute() {
  const location = useLocation();
  const { data: admin, isLoading, isError, error, refetch } = useCurrentAdmin();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-neutral-500">Checking session...</p>
      </div>
    );
  }

  const authRejected = error instanceof ApiRequestError && (error.status === 401 || error.status === 403);

  if (isError && !authRejected) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <AdminLoadError
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => { void refetch(); }}
        />
      </div>
    );
  }

  if (authRejected || !admin) {
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