"use client";

import Image from "next/image";
import { Wrench, Puzzle, Compass, GraduationCap, Languages } from "lucide-react";
import { independence } from "./data";
import { Reveal, SectionHeading } from "./motion";

const icons = [Wrench, Puzzle, Compass];

export function Independence() {
  return (
    <section
      id="independence"
      className="relative border-t border-white/10 bg-ink-2 py-24 md:py-36"
    >
      {/* ghost numeral */}
      <span
        aria-hidden="true"
        className="font-display text-outline pointer-events-none absolute right-4 top-10 select-none text-[26vw] leading-none md:text-[18rem]"
      >
        04
      </span>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          number={independence.number}
          title={independence.title}
          headline={independence.headline}
          intro={independence.intro}
        />

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left: narrative + skills */}
          <div className="flex flex-col gap-6">
            {independence.blocks.map((block, i) => {
              const Icon = icons[i] ?? Wrench;
              return (
                <Reveal key={block.kicker} delay={i * 0.08}>
                  <div className="rounded-3xl border border-white/10 bg-ink p-7 transition-all duration-500 hover:border-volt/40 md:p-8">
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-volt/10 text-volt">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-xl uppercase text-paper md:text-2xl">
                        {block.kicker}
                      </h3>
                    </div>
                    <p className="mt-4 leading-relaxed text-paper-dim">{block.text}</p>
                  </div>
                </Reveal>
              );
            })}

            {/* Skills grid */}
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-white/10 bg-ink p-7 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
                  Hands-on toolkit
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {independence.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/15 bg-ink-3 px-4 py-2 text-[13px] font-medium text-paper transition-colors duration-300 hover:border-volt/60 hover:text-volt"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-6">
                  <Languages className="h-5 w-5 shrink-0 text-volt" />
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {independence.languages.map((lang) => (
                      <span key={lang.name} className="text-sm text-paper-dim">
                        <strong className="font-semibold text-paper">{lang.name}</strong>
                        {" — "}
                        {lang.level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Education */}
            <Reveal delay={0.2}>
              <div className="rounded-3xl border border-volt/25 bg-gradient-to-br from-ink to-ink-3 p-7 md:p-8">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-volt" />
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
                    Education
                  </p>
                </div>
                <h4 className="font-display mt-4 text-xl uppercase leading-tight text-paper md:text-2xl">
                  {independence.education.school}
                </h4>
                <p className="mt-2 text-sm text-paper-dim">
                  {independence.education.detail}
                </p>
                <p className="mt-4 border-l-2 border-volt/50 pl-4 text-sm leading-relaxed text-paper-dim">
                  {independence.education.courses}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                  {independence.education.summer}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: photo stack */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <Reveal className="group relative col-span-2 overflow-hidden rounded-3xl border border-white/10">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/media/images/forman-summer.jpg"
                  alt="Fabrizio Saunero at the Forman School summer program in Connecticut, USA"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-display text-lg uppercase text-paper">
                    Forman Summer — Connecticut
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-paper-dim">
                    Four weeks · Independence & cultural awareness
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="group relative overflow-hidden rounded-3xl border border-white/10">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/media/images/work-dough.jpg"
                  alt="Fabrizio Saunero learning to roll dough in the family kitchen"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Reveal>
            <Reveal delay={0.16} className="group relative overflow-hidden rounded-3xl border border-white/10">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/media/images/golf-portrait-alt.jpg"
                  alt="Fabrizio Saunero on the golf course holding a club"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Reveal>
            <Reveal delay={0.22} className="col-span-2">
              <p className="font-serif-accent rounded-3xl border border-white/10 bg-ink p-6 text-center text-lg italic leading-snug text-paper md:p-8 md:text-xl">
                &ldquo;Every repaired switch and home-cooked meal is proof I can
                handle what life throws at me.&rdquo;
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
