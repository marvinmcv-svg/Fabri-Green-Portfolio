"use client";

import Image from "next/image";
import { Trophy, ShieldCheck, ChevronDown } from "lucide-react";
import { athletics } from "./data";
import { AutoVideo } from "./auto-video";
import { Reveal, SectionHeading } from "./motion";

export function Athletics() {
  return (
    <section id="athletics" className="relative bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          number={athletics.number}
          title={athletics.title}
          headline={athletics.headline}
          intro={athletics.intro}
        />

        {/* Top media row */}
        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-[1.25fr_1fr]">
          {/* Featured video */}
          <div className="grid gap-6 lg:grid-rows-2">
            <AutoVideo
              src="https://fabrizio-saunero-2.vercel.app/media/soccer-a.mp4"
              poster="https://fabrizio-saunero-2.vercel.app/media/soccer-a.webp"
              label="Match day · Sub 19"
              alt="Match footage of Fabrizio defending for Club de Tenis La Paz in a Sub 19 game"
            />
            <AutoVideo
              src="/media/videos/golf-swing.mp4"
              poster="/media/videos/golf-swing-poster.jpg"
              label="Golf at 3,600 m — full swing"
              alt="Fabrizio Saunero hitting a full golf swing at Club de Golf La Paz"
            />
          </div>

          {/* Night team photo + basketball */}
          <div className="grid gap-6">
            <Reveal delay={0.1} className="group relative overflow-hidden rounded-3xl border border-white/10">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/media/images/team-tequilas-night.jpg"
                  alt="Team Tequilas celebrating a first-place finish at night, Fabrizio holding the championship trophy in the center"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="font-display text-lg uppercase text-paper">
                    Champions again — Team Tequilas
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-paper-dim">
                    Captain · 1st place · Club de Tenis La Paz
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.18} className="group relative overflow-hidden rounded-3xl border border-white/10">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/media/images/basketball-cougars.jpg"
                  alt="ACS Cougars basketball team posing with a trophy, Fabrizio wearing jersey number 15"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="font-display text-lg uppercase text-paper">
                    Cougars basketball #15
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-paper-dim">
                    2× Cougar Cup Champion
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Narrative blocks */}
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
          {athletics.blocks.map((block, i) => (
            <Reveal key={block.kicker} delay={i * 0.1}>
              <div className="group h-full rounded-3xl border border-white/10 bg-ink-2 p-7 transition-all duration-500 hover:border-volt/40 hover:bg-ink-3 md:p-8">
                <span className="font-display text-sm uppercase tracking-[0.25em] text-volt">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-2xl uppercase text-paper md:text-[1.7rem]">
                  {block.kicker}
                </h3>
                <p className="mt-4 leading-relaxed text-paper-dim">
                  {block.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Honors grid */}
        <div className="mt-16 md:mt-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <Trophy className="h-5 w-5 text-volt" />
              <h3 className="font-display text-xl uppercase tracking-wide text-paper md:text-2xl">
                Trophy cabinet
              </h3>
              <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {athletics.honors.map((honor, i) => (
              <Reveal key={honor.title} delay={(i % 4) * 0.07}>
                <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-ink-2 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-volt/50">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-volt/80 transition-colors group-hover:text-volt" />
                  <div>
                    <p className="font-semibold leading-snug text-paper">
                      {honor.title}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper-dim">
                      {honor.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Teams roster */}
        <div className="mt-16 grid gap-4 md:mt-24 lg:grid-cols-2">
          {athletics.teams.map((team, i) => (
            <Reveal key={team.name} delay={(i % 2) * 0.08}>
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-ink-2 to-ink p-6 transition-all duration-500 hover:border-volt/40 md:flex-row md:items-center md:gap-6">
                <div>
                  <p className="font-display text-lg uppercase text-paper">
                    {team.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-volt">
                    {team.role}
                  </p>
                </div>
                <p className="flex items-center gap-2 text-sm text-paper-dim">
                  <ChevronDown className="h-4 w-4 rotate-[-90deg] text-volt/70" />
                  {team.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
