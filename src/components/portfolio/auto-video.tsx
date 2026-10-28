"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function AutoVideo({
  src,
  poster,
  label,
  alt,
}: {
  src: string;
  poster: string;
  label: string;
  alt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // React's `muted` prop sets the property but not the attribute,
    // which some browsers require for autoplay permission — set both.
    v.muted = true;
    v.setAttribute("muted", "");
    v.defaultMuted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full overflow-hidden rounded-3xl border border-white/10"
    >
      <video
        ref={videoRef}
        className="aspect-video h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-ink/70 px-4 py-2 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
