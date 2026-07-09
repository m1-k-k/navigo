"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      router.push("/navigate");
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

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
          <h1 className="text-xl font-bold text-navy">Create your account</h1>
          <p className="mt-1 text-sm text-navy/60">Start navigating safer today</p>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">Full name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
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
                minLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-transit-red">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign up free"}
            </Button>
          </form>

          {!isSupabaseConfigured() && (
            <p className="mt-4 text-center text-sm text-navy/50">
              Auth not configured — continuing as guest.
            </p>
          )}

          <p className="mt-4 text-center text-sm text-navy/60">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-coral hover:underline">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
