import { cn } from "@ecommerce/ui";
import { ArrowRight, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import * as React from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useCategories } from "../../hooks/queries";
import { useCartStore, useCartTotals } from "../../store/cart";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn("text-sm transition-colors hover:text-moss-900", isActive ? "font-medium text-moss-500" : "text-ink-600");

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const topLevel = categories.filter((c) => c.parentId === null);
  const openCart = useCartStore((s) => s.open);
  const { count } = useCartTotals();

  React.useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  React.useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = search.trim();
    navigate(value ? `/shop?search=${encodeURIComponent(value)}` : "/shop");
    setSearchOpen(false);
  }

  function closeSearch() {
    setSearchOpen(false);
    searchInputRef.current?.blur();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-paper-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button
          className="p-1 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="font-display text-lg font-semibold tracking-tight text-ink-900">
          JUSTBUY
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/shop" className={navLinkClass}>
            Shop all
          </NavLink>
          {topLevel.map((c) => (
            <NavLink key={c.id} to={`/category/${c.slug}`} className={navLinkClass}>
              {c.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form
            onSubmit={submitSearch}
            className={cn(
              "group flex items-center overflow-hidden rounded-sm border bg-paper-50 transition-[width,box-shadow,border-color] duration-200",
              searchOpen
                ? "w-56 border-moss-500 shadow-[0_4px_18px_rgba(76,104,74,0.14)] sm:w-72"
                : "w-9 border-transparent bg-transparent shadow-none"
            )}
          >
            <button
              type="button"
              aria-label={searchOpen ? "Close search" : "Open search"}
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                searchOpen ? "text-moss-600" : "text-ink-600 hover:bg-paper-50 hover:text-moss-500"
              )}
            >
              {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-[18px] w-[18px]" />}
            </button>
            <input
              ref={searchInputRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") closeSearch();
              }}
              placeholder="Search the collection"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm text-ink-900 outline-none placeholder:text-ink-400"
            />
            {searchOpen && search.trim() && (
              <button
                type="submit"
                aria-label="Search"
                className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-paper-50 transition-colors hover:bg-moss-600"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
          <Link to="/account" aria-label="Account" className="p-1 text-ink-600 hover:text-moss-500">
            <User className="h-[18px] w-[18px]" />
          </Link>
          <button
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            onClick={openCart}
            className="relative p-1 text-ink-600 hover:text-moss-500"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-moss-500 px-1 text-[10px] font-medium text-paper-50">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink-100 px-4 py-3 md:hidden">
          <NavLink to="/shop" className="py-2 text-sm text-ink-700" onClick={() => setMobileOpen(false)}>
            Shop all
          </NavLink>
          {topLevel.map((c) => (
            <NavLink
              key={c.id}
              to={`/category/${c.slug}`}
              className="py-2 text-sm text-ink-700"
              onClick={() => setMobileOpen(false)}
            >
              {c.name}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
