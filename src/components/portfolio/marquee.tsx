import { marqueeValues } from "./data";

export function Marquee() {
  const items = [...marqueeValues, ...marqueeValues];
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/10 bg-volt py-4 md:py-5"
    >
      <div className="marquee-track items-center gap-0">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {items.slice(half * items.length * 0.5, (half + 1) * items.length * 0.5).map((value, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="font-display px-6 text-xl uppercase tracking-wide text-ink md:px-10 md:text-3xl">
                  {value}
                </span>
                <span className="h-2 w-2 rounded-full bg-ink/70 md:h-3 md:w-3" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
