import { Route, Shield, Train, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: Route,
    title: "Adaptive Smart Routing",
    description:
      "Toggle between fast or quiet paths during the day. At night, automatically switch to well-lit, staffed routes.",
  },
  {
    icon: Shield,
    title: "Integrated SOS Systems",
    description:
      "Map-based feature highlighting nearby safe spaces — staffed TfL stations and local libraries.",
  },
  {
    icon: Train,
    title: "TfL Go Partnership",
    description:
      "Real-time crowding and staffing data from TfL. Report street hazards to local councils.",
  },
  {
    icon: AlertTriangle,
    title: "Smart Diversions",
    description:
      "Real-time re-routing around crowded zones. Alerts if you step off your planned path.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-cream px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-navy md:text-4xl">
          Core <span className="text-sage">features</span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl bg-sage p-6 text-white shadow-md"
            >
              <Icon className="mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 text-white/85">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
