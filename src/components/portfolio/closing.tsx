"use client";

import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { profile, closing } from "./data";
import { Reveal } from "./motion";

export function Closing() {
  return (
    <section id="contact" className="grain relative overflow-hidden bg-ink">
      {/* glow */}
      <div
        aria-hidden="true"
        className="glow-volt absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/3 rounded-full md:h-[760px] md:w-[760px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <Reveal>
          <div className="flex items-center justify-center gap-4">
            <span className="font-display text-sm tracking-[0.35em] text-volt">07</span>
            <span className="h-px w-10 bg-volt/60 md:w-16" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-paper-dim md:text-sm">
              Closing Statement
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="font-display mx-auto mt-6 max-w-4xl text-center text-5xl leading-[0.92] uppercase text-paper sm:text-6xl md:text-8xl">
            Ready for
            <br />
            <span className="text-volt">What&rsquo;s Next</span>
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 max-w-2xl md:mt-14">
          <Reveal delay={0.16}>
            <p className="text-center leading-relaxed text-paper-dim md:text-lg">
              {closing.body1}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-5 text-center leading-relaxed text-paper-dim md:text-lg">
              {closing.body2}
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="font-serif-accent mt-8 text-center text-2xl italic text-paper md:text-3xl">
              &ldquo;{closing.kicker}&rdquo;
            </p>
          </Reveal>
        </div>

        {/* Contact cards */}
        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3 md:gap-6">
          <Reveal delay={0.05}>
            <a
              href={`mailto:${profile.email}`}
              className="group flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-ink-2 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-volt/50 md:p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-volt/10 text-volt">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper-dim">
                  Email
                </p>
                <p className="mt-2 break-all font-medium text-paper transition-colors group-hover:text-volt">
                  {profile.email}
                </p>
              </div>
              <ArrowUpRight className="mt-auto h-5 w-5 text-paper-dim transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-volt" />
            </a>
          </Reveal>
          <Reveal delay={0.12}>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="group flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-ink-2 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-volt/50 md:p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-volt/10 text-volt">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper-dim">
                  Phone / WhatsApp
                </p>
                <p className="mt-2 font-medium text-paper transition-colors group-hover:text-volt">
                  {profile.phone}
                </p>
              </div>
              <ArrowUpRight className="mt-auto h-5 w-5 text-paper-dim transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-volt" />
            </a>
          </Reveal>
          <Reveal delay={0.19}>
            <div className="flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-ink-2 p-7 md:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-volt/10 text-volt">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper-dim">
                  Based in
                </p>
                <p className="mt-2 font-medium text-paper">{profile.location}</p>
                <p className="mt-1 text-sm text-paper-dim">
                  {profile.school} · {profile.classOf}
                </p>
              </div>
              <span className="mt-auto font-display text-sm uppercase tracking-[0.2em] text-volt">
                La Paz · Bolivia
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-volt font-display text-xs text-ink">
              FS
            </span>
            <p className="font-display text-xs uppercase tracking-[0.22em] text-paper">
              Fabrizio Saunero
            </p>
          </div>
          <p className="text-center text-xs text-paper-dim">
            &copy; {new Date().getFullYear()} Fabrizio Saunero · Built by experience, driven by
            purpose.
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-paper-dim transition-colors hover:text-volt"
          >
            Back to top
            <ArrowUpRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </footer>
    </section>
  );
}
