const competitors = [
  { name: "Waze", routing: 90, signal: 70, battery: 80 },
  { name: "Google Maps", routing: 75, signal: 60, battery: 65 },
  { name: "Apple Maps", routing: 55, signal: 50, battery: 45 },
  { name: "Citymapper", routing: 40, signal: 35, battery: 30 },
];

export function Competitors() {
  return (
    <section id="competitors" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-navy md:text-4xl">
          Why <span className="text-coral">NaviGo</span>?
        </h2>

        <div className="mt-8 rounded-2xl bg-cream p-8">
          <p className="text-lg text-navy/80">
            <strong className="text-navy">The market gap:</strong> Current navigation
            apps ignore personal safety to save a few minutes.
          </p>
          <p className="mt-4 text-lg text-navy/80">
            <strong className="text-navy">Our solution:</strong> NaviGo introduces
            flexible, dual-routing choices — maximum speed or well-lit, populated streets.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <p className="text-sm font-medium text-navy/60">
            Competitor issues (routing bias, signal failure, battery drain)
          </p>
          {competitors.map((c) => (
            <div key={c.name} className="flex items-center gap-4">
              <span className="w-28 text-sm font-medium text-navy">{c.name}</span>
              <div className="flex flex-1 gap-1">
                <div
                  className="h-6 rounded-l bg-coral"
                  style={{ width: `${c.routing}%` }}
                  title="Routing bias"
                />
                <div
                  className="h-6 bg-sage"
                  style={{ width: `${c.signal}%` }}
                  title="Signal failure"
                />
                <div
                  className="h-6 rounded-r bg-navy"
                  style={{ width: `${c.battery}%` }}
                  title="Battery drain"
                />
              </div>
            </div>
          ))}
          <div className="flex gap-4 text-xs text-navy/50">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-coral" /> Routing bias
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-sage" /> Signal failure
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-navy" /> Battery drain
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
