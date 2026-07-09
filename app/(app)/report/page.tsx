"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const categories = [
  "poor_lighting",
  "anti_social_behaviour",
  "obstruction",
  "damaged_pavement",
  "other",
];

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("poor_lighting");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Could not get your location")
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location) {
      alert("Please share your location first");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/hazards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: location.lat, lng: location.lng, description, category }),
    });

    if (res.ok) {
      setSuccess(true);
      setDescription("");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="mb-6 flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-coral" />
        <div>
          <h1 className="text-2xl font-bold text-navy">Report a hazard</h1>
          <p className="text-sm text-navy/60">
            Help improve street safety for everyone
          </p>
        </div>
      </div>

      {success ? (
        <Card className="text-center">
          <p className="font-semibold text-sage">Report submitted</p>
          <p className="mt-2 text-sm text-navy/60">
            Thank you. Your report will be forwarded to the local council.
          </p>
          <Button className="mt-4" variant="secondary" onClick={() => setSuccess(false)}>
            Report another
          </Button>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-navy/10 bg-white px-4 py-3 text-navy focus:border-sage focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-navy">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the hazard..."
                rows={4}
                required
                className="w-full rounded-xl border border-navy/10 bg-white px-4 py-3 text-navy placeholder:text-navy/40 focus:border-sage focus:outline-none"
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={getLocation}
            >
              {location ? "✓ Location captured" : "Share my location"}
            </Button>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !description || !location}
            >
              {loading ? "Submitting..." : "Submit report"}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
