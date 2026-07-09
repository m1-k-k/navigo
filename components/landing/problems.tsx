import { Ban } from "lucide-react";

const problems = [
  {
    stat: "36%",
    text: "of young women (18–24) are discouraged from walking in their local area due to safety concerns.",
  },
  {
    stat: "70%",
    text: "of young women have experienced unwanted street harassment.",
    highlight: true,
  },
  {
    stat: "70%",
    text: "of people who feel unsafe stop travelling at certain times of day.",
  },
  {
    stat: "86%",
    text: "of public transport users have experienced safety-reducing anti-social behaviour.",
  },
];

export function Problems() {
  return (
    <section id="problems" className="bg-sage/20 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-navy md:text-4xl">
          The <span className="text-coral">problem</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-navy/70">
          Young people and women face disproportionately high risk. Current navigation
          apps ignore personal safety to save a few minutes.
        </p>

        <div className="mt-12 space-y-4">
          {problems.map((p) => (
            <div
              key={p.stat + p.text.slice(0, 20)}
              className={`flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ${
                p.highlight ? "ring-2 ring-coral/30" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transit-red/10">
                <Ban className="h-5 w-5 text-transit-red" />
              </div>
              <div>
                <span className="text-2xl font-bold text-coral">{p.stat}</span>
                <p className="mt-1 text-navy/80">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
