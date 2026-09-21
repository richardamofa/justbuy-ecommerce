import { Link } from "react-router-dom";
import { Button } from "@ecommerce/ui";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-3xl text-ink-900">Page not found</h1>
      <p className="mt-2 text-sm text-ink-500">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button className="mt-6">Back to shop</Button>
      </Link>
    </div>
  );
}
