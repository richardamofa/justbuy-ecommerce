import { cn } from "@ecommerce/ui";
import {
  Boxes,
  FolderTree,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminLogout } from "../../hooks/useAdminAuth";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/collections", label: "Collections", icon: Layers },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/sections", label: "Homepage sections", icon: LayoutTemplate },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors",
              isActive ? "bg-ink-900 text-paper-50" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const logout = useAdminLogout();

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      navigate("/login", { replace: true });
    } catch {
      // Keep the user on the page if logout fails.
    }
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 md:hidden">
        <span className="font-display text-lg font-semibold tracking-tight text-ink-900">
          JUSTBUY{" "}
          <span className="text-xs font-medium tracking-normal text-ink-400">
            Admin
          </span>
        </span>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-b border-ink-100 py-2 md:hidden">
          <NavList onNavigate={() => setMobileOpen(false)} />

          <div className="px-3 pt-2">
            <button
              type="button"
              onClick={handleLogout}
              disabled={logout.isPending}
              className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {logout.isPending ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      )}

      <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-100 bg-paper-50 py-6 md:flex">
        <div className="mb-6 px-6">
          <span className="font-display text-lg font-semibold tracking-tight text-ink-900">
            JUSTBUY{" "}
            <span className="text-xs font-medium tracking-normal text-ink-400">
              Admin
            </span>
          </span>
        </div>

        <NavList />

        <div className="mt-auto px-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {logout.isPending ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}
