import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper-200 md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden md:ml-60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
