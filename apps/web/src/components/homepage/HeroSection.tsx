import type { HeroBanner } from "@ecommerce/contracts";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";

export function HeroSection({ banners }: { banners: HeroBanner[] }) {
  const slides = banners.filter((banner) => banner.isActive).sort((a, b) => a.position - b.position);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const banner = slides[activeIndex] ?? slides[0];

  React.useEffect(() => {
    setActiveIndex(0);
  }, [banners]);

  React.useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!banner) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        <AnimatePresence mode="wait">
          <motion.picture
            key={banner.id}
            initial={{ opacity: 0.25, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.25, scale: 0.99 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 block h-full w-full"
          >
            {banner.mobileImage && <source media="(max-width: 639px)" srcSet={banner.mobileImage.url} />}
            <img src={banner.image.url} alt={banner.image.alt} className="h-full w-full object-cover" />
          </motion.picture>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-ink-900/10 to-transparent" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 px-4 pb-10 sm:px-10 sm:pb-14"
      >
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-paper-100/75">
                {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </p>
              <h1 className="font-display max-w-lg text-display-md text-paper-50 sm:text-display-lg">{banner.heading}</h1>
              {banner.subheading && <p className="mt-3 max-w-md text-paper-100/90 sm:text-base">{banner.subheading}</p>}
              {banner.ctaLabel && banner.ctaHref && (
                <Link to={banner.ctaHref} className="mt-6 inline-flex items-center rounded bg-paper-50 px-5 py-2.5 text-sm font-medium text-ink-900 transition-transform hover:-translate-y-0.5">
                  {banner.ctaLabel}
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-4 flex items-center gap-2 sm:right-10">
          <button onClick={() => setActiveIndex((activeIndex - 1 + slides.length) % slides.length)} aria-label="Previous slide" className="rounded-full border border-paper-50/50 bg-ink-900/20 p-2 text-paper-50 backdrop-blur transition-colors hover:bg-ink-900/50">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setActiveIndex((activeIndex + 1) % slides.length)} aria-label="Next slide" className="rounded-full border border-paper-50/50 bg-ink-900/20 p-2 text-paper-50 backdrop-blur transition-colors hover:bg-ink-900/50">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
