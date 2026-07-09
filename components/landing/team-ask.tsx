import Link from "next/link";
import { Button } from "@/components/ui/button";

const fundAllocation = [
  { label: "App development", percent: 45 },
  { label: "Safety data & partnerships", percent: 20 },
  { label: "Marketing & user acquisition", percent: 15 },
  { label: "Servers & maintenance", percent: 10 },
  { label: "Legal, branding & contingency", percent: 10 },
];

export function Team() {
  return (
    <section id="team" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-navy md:text-4xl">
          The <span className="text-sage">team</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-navy/70">
          Built by founders who understand what it feels like to change your route
          because a street doesn&apos;t feel safe.
        </p>

        <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl bg-cream p-8 md:flex-row md:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-sage/20 text-3xl font-bold text-sage">
            NG
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-navy">Founder Name</h3>
            <p className="mt-1 text-sm text-coral">CEO & Product</p>
            <p className="mt-4 text-navy/70">
              [Add your one-line credentials — e.g. &quot;Computer Science student,
              London. Built NaviGo after friends stopped walking home alone after dark.&quot;]
            </p>
            <p className="mt-4 text-sm italic text-navy/60">
              Why we&apos;re building this: Everyone deserves to get home without
              choosing between speed and safety.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TheAsk() {
  return (
    <section id="ask" className="bg-sage/10 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-navy md:text-4xl">
          The <span className="text-coral">ask</span>
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-navy/50">
              Investment sought
            </p>
            <p className="mt-2 text-3xl font-bold text-navy">
              TBC
            </p>
            <p className="mt-2 text-navy/60">
              [e.g. £X for Y% equity — fill in before pitch day]
            </p>

            <p className="mt-6 text-sm font-medium uppercase tracking-wide text-navy/50">
              Revenue model
            </p>
            <ul className="mt-2 space-y-1 text-navy/80">
              <li>£4.99/month premium subscription</li>
              <li>Transport partnerships</li>
              <li>In-app advertising</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-navy/50">
              Use of funds (£55k roadmap)
            </p>
            <div className="mt-4 space-y-3">
              {fundAllocation.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/80">{item.label}</span>
                    <span className="font-semibold text-sage">{item.percent}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-navy/5">
                    <div
                      className="h-2 rounded-full bg-sage"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-sage/30 bg-white p-6 text-center">
          <p className="font-semibold text-navy">Traction</p>
          <p className="mt-2 text-navy/70">
            MVP live today. School and college pilot planned for Phase 03 validation.
          </p>
          <Link href="/navigate?demo=1" className="mt-6 inline-block">
            <Button size="lg">Watch live demo →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
