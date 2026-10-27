"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { galleryImages } from "./data";
import { Reveal, SectionHeading } from "./motion";

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () =>
      setLightbox((cur) =>
        cur === null ? null : (cur - 1 + galleryImages.length) % galleryImages.length
      ),
    []
  );
  const next = useCallback(
    () =>
      setLightbox((cur) =>
        cur === null ? null : (cur + 1) % galleryImages.length
      ),
    []
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, prev, next]);

  return (
    <section id="gallery" className="relative border-t border-white/10 bg-ink-2 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          number="06"
          title="Photo Gallery"
          headline="Moments that tell the story."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-3 md:gap-6">
          {galleryImages.map((img, i) => (
            <Reveal key={img.src} delay={Math.min(i * 0.04, 0.3)} className="h-full">
              <button
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Open photo: ${img.caption}`}
                className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 text-left focus:outline-none focus:ring-2 focus:ring-volt"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 45vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper">
                      {img.caption}
                    </span>
                    <Expand className="h-4 w-4 shrink-0 text-volt" />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={close}
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-ink/70 text-paper transition-colors hover:border-volt hover:text-volt md:right-6 md:top-6"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev / Next */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/70 text-paper transition-colors hover:border-volt hover:text-volt md:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/70 text-paper transition-colors hover:border-volt hover:text-volt md:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image */}
            <motion.figure
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-full w-full max-w-4xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[72vh] w-full md:h-[76vh]">
                <Image
                  src={galleryImages[lightbox].src}
                  alt={galleryImages[lightbox].alt}
                  fill
                  sizes="90vw"
                  className="rounded-2xl object-contain"
                />
              </div>
              <figcaption className="mt-4 flex items-center gap-3 text-center">
                <span className="font-display text-sm uppercase tracking-[0.2em] text-volt">
                  {String(lightbox + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                </span>
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                <span className="text-sm text-paper-dim">
                  {galleryImages[lightbox].caption}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
