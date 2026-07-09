import { Navbar, Footer } from "@/components/landing/navbar-footer";
import { Hero } from "@/components/landing/hero";
import { Problems } from "@/components/landing/problems";
import { Features } from "@/components/landing/features";
import { Competitors } from "@/components/landing/competitors";
import { Timeline, Pricing } from "@/components/landing/timeline-pricing";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Problems />
        <Features />
        <Competitors />
        <Timeline />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
