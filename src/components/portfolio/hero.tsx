"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { profile, heroStats } from "./data";
import { Counter } from "./motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="grain relative flex min-h-screen flex-col overflow-hidden bg-ink"
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="glow-volt absolute -right-40 top-24 h-[480px] w-[480px] rounded-full opacity-70 md:h-[640px] md:w-[640px]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-56 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(244,243,238,0.05),transparent_70%)]"
      />

      {/* Giant ghost word in background */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.5 }}
        className="font-display text-outline pointer-events-none absolute -bottom-6 left-0 select-none whitespace-nowrap text-[22vw] leading-none uppercase opacity-[0.55] md:-bottom-10"
      >
        La Paz · Bolivia
      </motion.span>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pb-16 pt-28 md:px-8 md:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
        {/* ---- Left: type ---- */}
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-volt/30 bg-volt/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-volt">
              <Sparkles className="h-3.5 w-3.5" />
              Student · Athlete · Entrepreneur
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-paper-dim">
              <MapPin className="h-3.5 w-3.5 text-volt" />
              {profile.location}
            </span>
          </motion.div>

          <h1 className="mt-6 font-display uppercase leading-[0.88] text-paper">
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="block text-[17vw] sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.5rem]"
            >
              {profile.first}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease }}
              className="block text-[17vw] text-volt sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.5rem]"
            >
              {profile.last}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-paper-dim md:text-xl"
          >
            {profile.tagline.split(".").slice(0, 1)}.
            <span className="font-serif-accent italic text-paper">
              {" "}
              {profile.tagline.split(".").slice(1).join(".").trim()}
            </span>
          </motion.p>

          <motion.blockquote
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mt-6 max-w-xl border-l-2 border-volt/70 pl-5 font-serif-accent text-xl italic leading-snug text-paper md:text-2xl"
          >
            &ldquo;{profile.quote}&rdquo;
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#athletics"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-volt px-7 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-all duration-300 hover:bg-paper md:h-[52px]"
            >
              Explore my story
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition-all duration-300 hover:border-volt hover:text-volt md:h-[52px]"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        {/* ---- Right: portrait ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="relative order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-none"
        >
          <div className="relative">
            {/* accent frame */}
            <div
              aria-hidden="true"
              className="absolute -left-4 -top-4 h-full w-full rounded-3xl border-2 border-volt/50 md:-left-6 md:-top-6"
            />
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/media/images/hero-trophy.jpg"
                alt="Fabrizio Saunero holding a championship trophy and gold medal on a soccer field with the Bolivian altiplano behind him"
                fill
                priority
                loading="eager"
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
              />
              {/* caption chip */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/15 bg-ink/70 px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="font-display text-sm uppercase tracking-wider text-paper">
                    U19 State Champion
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-paper-dim">
                    Club de Tenis La Paz
                  </p>
                </div>
                <span className="font-display text-2xl text-volt">01</span>
              </div>
            </div>

            {/* floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease }}
              className="absolute -right-3 top-8 rounded-2xl border border-volt/40 bg-ink-2/90 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-md md:-right-8"
            >
              <p className="font-display text-xl text-volt md:text-2xl">2×</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-paper-dim">
                U17 State Champion
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease }}
              className="absolute -left-3 bottom-24 rounded-2xl border border-white/15 bg-ink-2/90 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-md md:-left-10"
            >
              <p className="font-display text-sm uppercase tracking-wider text-paper">
                Varsity Captain
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-paper-dim">
                ACS Cougars · Since 2023
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ---- Stats strip ---- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0, ease }}
        className="relative z-10 border-t border-white/10 bg-ink-2/60 backdrop-blur-sm"
      >
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-5 md:grid-cols-4 md:px-8">
          {heroStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-1 px-4 py-6 md:px-8 md:py-8 ${
                i >= 2 ? "border-t border-white/10 md:border-t-0" : ""
              } ${i === 2 ? "border-l-0 md:border-l" : ""}`}
            >
              <dd className="font-display text-3xl text-volt md:text-5xl">
                <Counter
                  value={stat.value}
                  prefix={"prefix" in stat ? stat.prefix : ""}
                  suffix={stat.suffix}
                />
              </dd>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper md:text-xs">
                {stat.label}
              </dt>
              <p className="hidden text-[11px] leading-snug text-paper-dim md:block">
                {stat.sub}
              </p>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
