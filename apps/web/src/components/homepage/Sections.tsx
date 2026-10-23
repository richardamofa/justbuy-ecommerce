import type { Category, Product } from "@ecommerce/contracts";
import { Button, ProductCard } from "@ecommerce/ui";
import { CheckCircle2 } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api-client";

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
}: {
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
}) {
  if (!title) return null;
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="font-display text-2xl text-ink-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link to={viewAllHref} className="hidden text-sm text-ink-500 hover:text-ink-900 sm:block">
          View all
        </Link>
      )}
    </div>
  );
}

export function ProductGridSection({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title?: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeader title={title} subtitle={subtitle} viewAllHref={viewAllHref} />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} href={`/product/${product.slug}`} LinkComponent={Link} />
        ))}
      </div>
    </section>
  );
}

export function ProductCarouselSection({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title?: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeader title={title} subtitle={subtitle} viewAllHref={viewAllHref} />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={`/product/${product.slug}`}
            LinkComponent={Link}
          />
        ))}
      </div>
    </section>
  );
}

export function CategoryGridSection({ title, categories }: { title?: string; categories: Category[] }) {
  if (!categories.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeader title={title} />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-5">
        {categories.map((category) => (
          <Link key={category.id} to={`/category/${category.slug}`} className="group block">
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-ink-50">
              {category.image && (
                <img
                  src={category.image.url}
                  alt={category.image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.04]"
                />
              )}
            </div>
            <p className="mt-3 text-sm text-ink-900">{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CollectionBlockSection({
  title,
  subtitle,
  products,
  collectionHref,
}: {
  title?: string;
  subtitle?: string;
  products: Product[];
  collectionHref?: string;
}) {
  if (!products.length) return null;
  return (
    <section className="bg-moss-50/60 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader title={title} subtitle={subtitle} viewAllHref={collectionHref} />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} href={`/product/${product.slug}`} LinkComponent={Link} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BannerSection({
  image,
  title,
  ctaLabel,
  ctaHref,
}: {
  image: { url: string; alt: string };
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative mx-auto my-12 max-w-7xl overflow-hidden rounded-md px-4 sm:px-6">
      <div className="relative aspect-[16/7] overflow-hidden rounded-md">
        <img src={image.url} alt={image.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink-900/30" />
        <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 p-8 sm:p-14">
          {title && <h3 className="font-display max-w-sm text-2xl text-paper-50 sm:text-3xl">{title}</h3>}
          {ctaLabel && ctaHref && (
            <Link to={ctaHref}>
              <Button variant="secondary">{ctaLabel}</Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function RichContentSection({ html }: { html: string }) {
  if (!html) return null;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 text-ink-700 sm:px-6" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function NewsletterSection({ heading, body }: { heading: string; body?: string }) {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");
    try {
      const result = await apiRequest<{ status: "pending" | "subscribed" }>("/api/v1/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(result.status === "subscribed" ? "Thanks for subscribing. You are on the list." : "Thanks, your sign-up has been recorded.");
      setEmail("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not subscribe you. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border-t border-ink-100 bg-ink-900 py-16 text-paper-50">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <h2 className="font-display text-2xl">{heading}</h2>
        {body && <p className="mt-2 text-sm text-paper-200/80">{body}</p>}
        <form
          className="mt-6 flex flex-col gap-2 sm:flex-row"
          onSubmit={submit}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            aria-label="Email address"
            placeholder="you@example.com"
            className="flex-1 rounded border border-paper-50/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-paper-200/50 focus:border-paper-50 focus:outline-none"
          />
          <Button type="submit" variant="secondary" className="sm:w-auto" isLoading={isSubmitting}>
            Subscribe
          </Button>
        </form>
        {message && <p role="status" className="mt-3 flex items-center justify-center gap-2 text-sm text-paper-50"><CheckCircle2 className="h-4 w-4" />{message}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
      </div>
    </section>
  );
}
