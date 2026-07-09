"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, LogOut, Moon, Crown } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      if (!supabase) return;

      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/");
    }
  }

  if (loading) {
    return <div className="p-6 text-navy/50">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-bold text-navy">Profile</h1>

      <Card className="mt-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/20">
            <User className="h-7 w-7 text-sage" />
          </div>
          <div>
            {email ? (
              <>
                <p className="font-semibold text-navy">{email}</p>
                <p className="text-sm text-navy/50">Free plan</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-navy">Guest mode</p>
                <p className="text-sm text-navy/50">Sign in to save routes</p>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-6 space-y-3">
        <Card className="flex items-center gap-4">
          <Moon className="h-5 w-5 text-sage" />
          <div className="flex-1">
            <p className="font-medium text-navy">Auto safe mode at night</p>
            <p className="text-xs text-navy/50">Enabled by default</p>
          </div>
          <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-medium text-sage">
            On
          </span>
        </Card>

        <Card className="flex items-center gap-4">
          <Crown className="h-5 w-5 text-coral" />
          <div className="flex-1">
            <p className="font-medium text-navy">Premium</p>
            <p className="text-xs text-navy/50">£4.99/month — coming soon</p>
          </div>
        </Card>
      </div>

      <div className="mt-8 space-y-3">
        {!email && (
          <Link href="/signup">
            <Button className="w-full">Create account</Button>
          </Link>
        )}
        {email && (
          <Button variant="ghost" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        )}
      </div>
    </div>
  );
}
