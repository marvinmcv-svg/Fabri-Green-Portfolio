"use client";

import Image from "next/image";
import { Briefcase, Lightbulb, Target } from "lucide-react";
import { work } from "./data";
import { Reveal, SectionHeading } from "./motion";

const icons = [Briefcase, Lightbulb, Target];

export function Work() {
  return (
    <section id="work" className="relative bg-ink py-24 md:py-36">
      {/* ghost numeral */}
      <span
        aria-hidden="true"
        className="font-display text-outline pointer-events-none absolute left-4 top-10 select-none text-[26vw] leading-none md:text-[18rem]"
      >
        03
      </span>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          number={work.number}
          title={work.title}
          headline={work.headline}
          intro={work.intro}
        />

        {/* Photo strip */}
        <div className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-4 md:gap-6">
          <Reveal className="group relative col-span-2 overflow-hidden rounded-3xl border border-white/10 md:col-span-2 md:row-span-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[420px]">
              <Image
                src="/media/images/work-saltenas-prep.jpg"
                alt="Fabrizio Saunero hand-folding salteñas with his grandfather in the family kitchen"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="font-display text-lg uppercase text-paper">
                  The family craft
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-paper-dim">
                  Salteñas · Bolivia&rsquo;s favorite pastry
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="group relative overflow-hidden rounded-3xl border border-white/10">
            <div className="relative aspect-[4/3] md:aspect-square">
              <Image
                src="/media/images/work-register.jpg"
                alt="Fabrizio Saunero taking a customer order at the shop register"
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </Reveal>
          <Reveal delay={0.14} className="group relative overflow-hidden rounded-3xl border border-white/10">
            <div className="relative aspect-[4/3] md:aspect-square">
              <Image
                src="/media/images/work-counter.jpg"
                alt="Fabrizio Saunero working behind the counter of the family shop"
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </Reveal>
          <Reveal delay={0.2} className="group relative col-span-2 overflow-hidden rounded-3xl border border-white/10 md:col-span-2">
            <div className="relative aspect-[4/3] md:aspect-[4/3]">
              <Image
                src="/media/images/work-pizza.jpg"
                alt=""
                aria-hidden="true"
                fill
                sizes="10vw"
                className="scale-110 object-cover opacity-60 blur-2xl"
              />
              <Image
                src="/media/images/work-pizza.jpg"
                alt="Fabrizio Saunero preparing pizzas in a commercial kitchen"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="font-display text-base uppercase text-paper md:text-lg">
                  Kitchen hours build character
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Narrative */}
        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3">
          {work.blocks.map((block, i) => {
            const Icon = icons[i] ?? Briefcase;
            return (
              <Reveal key={block.kicker} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-white/10 bg-ink-2 p-7 transition-all duration-500 hover:border-volt/40 md:p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-volt/10 text-volt">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display mt-4 text-xl uppercase text-paper md:text-2xl">
                    {block.kicker}
                  </h3>
                  <p className="mt-3 leading-relaxed text-paper-dim">{block.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Experience timeline */}
        <div className="mt-16 md:mt-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <Briefcase className="h-5 w-5 text-volt" />
              <h3 className="font-display text-xl uppercase tracking-wide text-paper md:text-2xl">
                Experience ledger
              </h3>
              <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
            </div>
          </Reveal>

          <ol className="relative mt-10 space-y-10 border-l border-white/15 pl-6 md:pl-10">
            {work.jobs.map((job, i) => (
              <li key={job.title}>
                <Reveal delay={Math.min(i * 0.05, 0.25)}>
                  <div className="group relative rounded-3xl border border-white/10 bg-ink-2 p-6 transition-all duration-500 hover:border-volt/40 md:p-8">
                    {/* node */}
                    <span
                      aria-hidden="true"
                      className="absolute -left-[31px] top-9 h-3 w-3 rounded-full border-2 border-volt bg-ink transition-colors duration-300 group-hover:bg-volt md:-left-[47px]"
                    />
                    <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-6">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h4 className="font-display text-xl uppercase text-paper md:text-2xl">
                          {job.title}
                        </h4>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-volt">
                          {job.role}
                        </span>
                      </div>
                      <span className="whitespace-nowrap font-mono text-xs uppercase tracking-wider text-paper-dim">
                        {job.period}
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl leading-relaxed text-paper-dim">
                      {job.text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
