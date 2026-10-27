"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

/* ---------- Scroll reveal wrapper ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Animated counter ---------- */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsub = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString("en-US")}${suffix}`;
      }
    });
    return unsub;
  }, [spring, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

/* ---------- Section heading with number + rule ---------- */
export function SectionHeading({
  number,
  title,
  headline,
  intro,
  align = "left",
}: {
  number: string;
  title: string;
  headline: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Reveal>
        <div
          className={`flex items-center gap-4 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="font-display text-volt text-sm tracking-[0.35em] md:text-base">
            {number}
          </span>
          <span className="h-px w-10 bg-volt/60 md:w-16" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-paper-dim md:text-sm">
            {title}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display mt-5 text-4xl leading-[0.95] uppercase text-paper sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.16}>
          <p
            className={`mt-6 max-w-2xl font-serif-accent text-lg italic leading-relaxed text-paper-dim md:text-xl ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            &ldquo;{intro}&rdquo;
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
