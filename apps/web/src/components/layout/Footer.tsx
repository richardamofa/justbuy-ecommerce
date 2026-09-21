import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-paper-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">JUSTBUY</p>
          <p className="mt-2 max-w-[220px] text-sm text-ink-500">Considered goods for everyday life.</p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink-900">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/shop" className="hover:text-ink-900">Shop all</Link></li>
            <li><Link to="/collections/new-arrivals" className="hover:text-ink-900">New Arrivals</Link></li>
            <li><Link to="/collections/best-sellers" className="hover:text-ink-900">Best Sellers</Link></li>
            <li><Link to="/collections/sale" className="hover:text-ink-900">Sale</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-ink-900">Support</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/account" className="hover:text-ink-900">Account</Link></li>
            <li><Link to="/orders" className="hover:text-ink-900">Orders</Link></li>
            <li><a href="mailto:hello@form-store.example" className="hover:text-ink-900">Contact</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-ink-900">Newsletter</p>
          <p className="mt-3 text-sm text-ink-500">Occasional notes on new arrivals and restocks.</p>
        </div>
      </div>
      <div className="border-t border-ink-100 px-4 py-5 text-xs text-ink-400 sm:px-6">
        © {new Date().getFullYear()} Form. All rights reserved.
      </div>
    </footer>
  );
}
