import Link from "next/link";
import { Button } from "@/components/ui/button";

const phases = [
  {
    phase: "01",
    title: "Foundation",
    period: "Months 1–2",
    tasks: "Finalize safety-routing logic, register for TfL API, complete wireframes",
  },
  {
    phase: "02",
    title: "Build MVP",
    period: "Months 3–4",
    tasks: "Routing engine, SOS emergency button, live TfL data integration",
    active: true,
  },
  {
    phase: "03",
    title: "Validation",
    period: "Months 5–6",
    tasks: "Test with real users at schools and colleges, gather feedback",
  },
  {
    phase: "04",
    title: "Expansion",
    period: "Month 7+",
    tasks: "Public launch, marketing, partnerships with councils and universities",
  },
];

export function Timeline() {
  return (
    <section id="timeline" className="bg-sage/10 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-navy md:text-4xl">
          Project <span className="text-sage">timeline</span>
        </h2>

        <div className="mt-12 space-y-6">
          {phases.map((p) => (
            <div
              key={p.phase}
              className={`rounded-2xl border-l-4 bg-white p-6 shadow-sm ${
                p.active ? "border-transit-red" : "border-sage"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-coral">{p.phase}</span>
                <div>
                  <h3 className="text-lg font-bold text-navy">{p.title}</h3>
                  <p className="text-sm text-navy/50">{p.period}</p>
                </div>
              </div>
              <p className="mt-3 text-navy/70">{p.tasks}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="bg-navy px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Go Premium with <span className="text-coral">NaviGo</span>
        </h2>
        <p className="mt-4 text-white/70">
          Unlock advanced safe routing, priority SOS, and offline maps.
        </p>

        <div className="mt-10 rounded-2xl bg-white/10 p-8 backdrop-blur">
          <p className="text-5xl font-bold">
            £4.99<span className="text-lg font-normal text-white/60">/month</span>
          </p>
          <ul className="mt-6 space-y-2 text-left text-white/80">
            <li>✓ Adaptive safe routing 24/7</li>
            <li>✓ Live TfL crowding data</li>
            <li>✓ SOS safe spaces map</li>
            <li>✓ Off-path alerts & smart diversions</li>
          </ul>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg">Get started free</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
