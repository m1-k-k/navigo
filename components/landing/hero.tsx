"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Zap, MapPin, Clock } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-20 md:py-32">
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 400 400">
          <path d="M50 200 Q150 50 250 200 T450 200" stroke="#E8836B" strokeWidth="3" fill="none" />
          <path d="M0 250 L400 150" stroke="#1E2A3A" strokeWidth="2" fill="none" />
          <path d="M100 0 L100 400" stroke="#8BA888" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sage/10 px-4 py-2 text-sm font-medium text-sage">
          <Shield className="h-4 w-4" />
          Safety-first navigation for young people
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-navy md:text-6xl">
          A smarter, safer way{" "}
          <span className="text-coral">to get home</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-navy/70 md:text-xl">
          NaviGo puts safety first — not just speed. Get guided through well-lit,
          busy streets with routes that adapt automatically depending on the time of day.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/navigate?demo=1">
            <Button size="lg">Watch live demo</Button>
          </Link>
          <Link href="/navigate">
            <Button variant="secondary" size="lg">
              Start navigating
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Shield, label: "Safe routing" },
            { icon: Zap, label: "Fast routing" },
            { icon: MapPin, label: "SOS safe spaces" },
            { icon: Clock, label: "Time-aware" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 p-4 backdrop-blur"
            >
              <Icon className="h-6 w-6 text-sage" />
              <span className="text-sm font-medium text-navy">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
