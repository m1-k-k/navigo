"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      router.push("/navigate");
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/navigate");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center text-3xl font-bold text-navy">
          Navi<span className="text-coral">Go</span>
        </Link>

        <Card>
          <h1 className="text-xl font-bold text-navy">Welcome back</h1>
          <p className="mt-1 text-sm text-navy/60">Log in to your account</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-transit-red">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          {!isSupabaseConfigured() && (
            <p className="mt-4 text-center text-sm text-navy/50">
              Auth not configured — you can use the app as a guest.
            </p>
          )}

          <p className="mt-4 text-center text-sm text-navy/60">
            No account?{" "}
            <Link href="/signup" className="font-medium text-coral hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
