"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Clapperboard } from "lucide-react";
import { videos } from "./data";
import { Reveal, SectionHeading } from "./motion";

export function Highlights() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userSelected = useRef(false);

  const active = videos[activeIdx];

  // When the active clip changes via the playlist, load & play the new video
  useEffect(() => {
    if (!userSelected.current) return;
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [activeIdx]);

  const select = (i: number) => {
    if (i === activeIdx) {
      togglePlay();
      return;
    }
    userSelected.current = true;
    setActiveIdx(i);
    setMuted(true);
    setPlaying(false);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section id="highlights" className="relative bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          number="05"
          title="Highlights Reel"
          headline="See the work in motion."
          align="left"
        />

        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-[1.5fr_1fr]">
          {/* Player */}
          <Reveal>
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-2">
              <video
                ref={videoRef}
                key={active.src}
                className="aspect-video w-full cursor-pointer object-cover"
                src={active.src}
                poster={active.poster}
                muted={muted}
                loop
                playsInline
                preload="metadata"
                onClick={togglePlay}
                aria-label={`Video: ${active.title} — ${active.caption}`}
              />

              {/* Controls overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 p-4 md:p-5">
                <div className="min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={active.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="font-display truncate text-base uppercase text-paper md:text-lg"
                    >
                      {active.title}
                    </motion.p>
                  </AnimatePresence>
                  <p className="truncate text-[11px] uppercase tracking-[0.16em] text-paper-dim">
                    {active.caption}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute video" : "Mute video"}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink/60 text-paper backdrop-blur-md transition-colors hover:border-volt hover:text-volt"
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? "Pause video" : "Play video"}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-volt text-ink transition-transform hover:scale-105"
                  >
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Center play button when paused */}
              {!playing && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play video"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-volt/95 shadow-2xl shadow-volt/20 transition-transform duration-300 hover:scale-110 md:h-24 md:w-24">
                    <Play className="ml-1 h-8 w-8 text-ink md:h-10 md:w-10" />
                  </span>
                </button>
              )}
            </div>
          </Reveal>

          {/* Playlist */}
          <div className="flex flex-col gap-3">
            <Reveal delay={0.08}>
              <div className="flex items-center gap-3 px-1">
                <Clapperboard className="h-4 w-4 text-volt" />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper-dim">
                  {videos.length} clips — pick one
                </p>
              </div>
            </Reveal>
            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
              {videos.map((video, i) => (
                <Reveal key={video.src} delay={0.08 + i * 0.06}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-label={`Play clip: ${video.title}`}
                    className={`group flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all duration-300 ${
                      i === activeIdx
                        ? "border-volt/60 bg-ink-3"
                        : "border-white/10 bg-ink-2 hover:border-white/30"
                    }`}
                  >
                    <span className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl md:h-16 md:w-28">
                      <img
                        src={video.poster}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <span
                        className={`absolute inset-0 flex items-center justify-center bg-ink/40 transition-opacity ${
                          i === activeIdx ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <Play className="h-5 w-5 text-volt" />
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate font-display text-sm uppercase tracking-wide ${
                          i === activeIdx ? "text-volt" : "text-paper"
                        }`}
                      >
                        {video.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-paper-dim">
                        {video.caption}
                      </span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
