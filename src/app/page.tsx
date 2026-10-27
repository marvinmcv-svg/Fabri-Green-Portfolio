import { Nav } from "@/components/portfolio/nav";
import { Hero } from "@/components/portfolio/hero";
import { Marquee } from "@/components/portfolio/marquee";
import { Intro } from "@/components/portfolio/intro";
import { Athletics } from "@/components/portfolio/athletics";
import { Community } from "@/components/portfolio/community";
import { Work } from "@/components/portfolio/work";
import { Independence } from "@/components/portfolio/independence";
import { Highlights } from "@/components/portfolio/highlights";
import { Gallery } from "@/components/portfolio/gallery";
import { Closing } from "@/components/portfolio/closing";

export default function Portfolio() {
  return (
    <main className="relative bg-ink text-paper">
      <Nav />
      <Hero />
      <Marquee />
      <Intro />
      <Athletics />
      <Community />
      <Work />
      <Independence />
      <Highlights />
      <Gallery />
      <Closing />
    </main>
  );
}
