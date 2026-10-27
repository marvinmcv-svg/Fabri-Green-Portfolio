"use client";

import Image from "next/image";
import { HeartHandshake, GraduationCap, HandCoins, Users } from "lucide-react";
import { community } from "./data";
import { Reveal, SectionHeading, Counter } from "./motion";

const icons = [GraduationCap, HandCoins, Users];

export function Community() {
  return (
    <section id="community" className="relative border-t border-white/10 bg-ink-2 py-24 md:py-36">
      {/* ghost numeral */}
      <span
        aria-hidden="true"
        className="font-display text-outline pointer-events-none absolute right-4 top-10 select-none text-[26vw] leading-none md:text-[18rem]"
      >
        02
      </span>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          number={community.number}
          title={community.title}
          headline={community.headline}
          intro={community.intro}
        />

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-2 lg:gap-14">
          {/* Left: photos */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <Reveal className="col-span-2 group relative overflow-hidden rounded-3xl border border-white/10">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/media/images/community-kids.jpg"
                  alt="Fabrizio Saunero sitting on a bench with children at a community park event, wearing a Manchester City shirt"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-display text-lg uppercase text-paper">
                    A Day in the Park
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-paper-dim">
                    Monthly gatherings with children & families
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="group relative overflow-hidden rounded-3xl border border-white/10">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/media/images/community-coaching.jpg"
                  alt="Fabrizio Saunero coaching a young child playing with a ball in a park"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Reveal>

            {/* Impact card */}
            <Reveal delay={0.16}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-volt/30 bg-volt p-6 text-ink md:p-7">
                <HandCoins className="h-7 w-7" />
                <div className="mt-6">
                  <p className="font-display text-5xl leading-none md:text-6xl">
                    <Counter value={7000} prefix="$" />
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em]">
                    raised for Operation Smile
                  </p>
                  <p className="mt-4 border-t border-ink/20 pt-4 text-sm font-medium leading-snug">
                    Kilómetros por Sonrisas 5K funded{" "}
                    <strong className="font-display">15 children&rsquo;s surgeries</strong>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: narrative */}
          <div className="flex flex-col gap-8">
            {community.blocks.map((block, i) => {
              const Icon = icons[i] ?? HeartHandshake;
              return (
                <Reveal key={block.kicker} delay={i * 0.08}>
                  <div className="group rounded-3xl border border-white/10 bg-ink p-7 transition-all duration-500 hover:border-volt/40 md:p-8">
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-volt/10 text-volt">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-xl uppercase text-paper md:text-2xl">
                        {block.kicker}
                      </h3>
                    </div>
                    <p className="mt-4 leading-relaxed text-paper-dim">
                      {block.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}

            {/* Commitments */}
            <Reveal delay={0.2}>
              <div className="rounded-3xl border border-white/10 bg-ink p-7 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
                  Ongoing commitments
                </p>
                <ul className="mt-5 divide-y divide-white/10">
                  {community.commitments.map((c) => (
                    <li
                      key={c.name}
                      className="flex flex-col justify-between gap-1 py-3.5 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <span className="font-medium text-paper">{c.name}</span>
                      <span className="sm:whitespace-nowrap text-xs uppercase tracking-[0.14em] text-paper-dim">
                        {c.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
