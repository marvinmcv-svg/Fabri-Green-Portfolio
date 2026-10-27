"use client";

import { ArrowUpRight, Trophy, HeartHandshake, Briefcase, Wrench } from "lucide-react";
import { profile } from "./data";
import { Reveal } from "./motion";

const pillars = [
  {
    href: "#athletics",
    number: "01",
    title: "Athletics & Leadership",
    text: "From Bolivia's 4th Division to Primera A. State champion, varsity captain.",
    icon: Trophy,
  },
  {
    href: "#community",
    number: "02",
    title: "Service & Community",
    text: "Teaching English, coaching kids, raising $7,000 for 15 surgeries.",
    icon: HeartHandshake,
  },
  {
    href: "#work",
    number: "03",
    title: "Entrepreneurship & Work",
    text: "Six real jobs and ventures — from a brewery floor to a cookie startup.",
    icon: Briefcase,
  },
  {
    href: "#independence",
    number: "04",
    title: "Independence & Life Skills",
    text: "Cooking, wiring, repairs, gardening — ready to live on my own.",
    icon: Wrench,
  },
];

export function Intro() {
  return (
    <section id="about" className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Statement */}
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-volt">
                Who I am
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display mt-5 text-4xl uppercase leading-[0.95] text-paper sm:text-5xl md:text-6xl">
                A life built on
                <span className="text-volt"> chances taken.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 leading-relaxed text-paper-dim md:text-lg">
                My life so far has been a mix of playing competitive sports, helping out in my
                community, and trying out real business projects. I believe you only grow when
                you&rsquo;re willing to try new things, face tough challenges, and work hard even
                when you&rsquo;re not sure how things will turn out.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-5 leading-relaxed text-paper-dim md:text-lg">
                I&rsquo;m applying to college because I want to push myself, think bigger, and meet
                people who inspire me. I know what I can do, and I&rsquo;m ready to see how much
                more I can achieve.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-paper-dim">
                <span>{profile.school}</span>
                <span className="h-1 w-1 rounded-full bg-volt" aria-hidden="true" />
                <span>{profile.classOf}</span>
                <span className="h-1 w-1 rounded-full bg-volt" aria-hidden="true" />
                <span>American Citizenship Award</span>
              </div>
            </Reveal>
          </div>

          {/* Pillar cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.href} delay={0.08 + i * 0.07}>
                <a
                  href={pillar.href}
                  className="group flex h-full flex-col rounded-3xl border border-white/10 bg-ink-2 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-volt/50 hover:bg-ink-3 md:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-4xl text-outline-volt transition-all duration-500 group-hover:text-volt group-hover:[-webkit-text-stroke:0px]">
                      {pillar.number}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-volt/10 text-volt transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <pillar.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="font-display mt-6 text-xl uppercase leading-tight text-paper">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper-dim">{pillar.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-volt">
                    Explore
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
