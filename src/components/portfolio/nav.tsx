"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { href: "#athletics", label: "Athletics" },
  { href: "#community", label: "Community" },
  { href: "#work", label: "Work" },
  { href: "#independence", label: "Life Skills" },
  { href: "#highlights", label: "Highlights" },
  { href: "#gallery", label: "Gallery" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-8"
      >
        {/* Logo */}
        <a
          href="#top"
          className="group -mx-1.5 -my-2.5 flex items-center gap-3 px-1.5 py-2.5"
          aria-label="Fabrizio Saunero — back to top"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-volt font-display text-sm text-ink transition-transform duration-300 group-hover:rotate-12">
            FS
          </span>
          <span className="hidden font-display text-sm uppercase tracking-[0.22em] text-paper sm:block">
            Fabrizio Saunero
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`relative text-[13px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 hover:text-paper ${
                  active === link.href ? "text-volt" : "text-paper-dim"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-volt transition-all duration-300 ${
                    active === link.href ? "w-full" : "w-0"
                  }`}
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="group hidden h-10 items-center gap-1.5 rounded-full bg-volt px-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-all duration-300 hover:bg-paper sm:inline-flex md:h-11 md:px-6"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-paper lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="space-y-1 px-5 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      const id = link.href.slice(1);
                      // Delay the scroll until the menu's exit animation finishes:
                      // framer-motion's keyframe measurement momentarily resets
                      // scroll to 0, which cancels any scroll started too early.
                      window.setTimeout(() => {
                        const reduce = window.matchMedia(
                          "(prefers-reduced-motion: reduce)"
                        ).matches;
                        document
                          .getElementById(id)
                          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                        history.pushState(null, "", `#${id}`);
                      }, 360);
                    }}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium uppercase tracking-wider text-paper transition-colors hover:bg-white/5 hover:text-volt"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 text-paper-dim" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    window.setTimeout(() => {
                      const reduce = window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                      ).matches;
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                      history.pushState(null, "", "#contact");
                    }, 360);
                  }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-volt px-5 py-3.5 text-sm font-semibold uppercase tracking-wider text-ink"
                >
                  Get in touch
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
