"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Navigation, Shield, User, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/navigate", label: "Navigate", icon: Navigation },
  { href: "/map", label: "Map", icon: Map },
  { href: "/sos", label: "SOS", icon: Shield },
  { href: "/report", label: "Report", icon: AlertTriangle },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-navy/10 md:bg-white md:p-6">
      <Link href="/" className="mb-8 text-2xl font-bold text-navy">
        Navi<span className="text-coral">Go</span>
      </Link>
      <nav className="flex flex-col gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-sage/10 text-sage"
                  : "text-navy/60 hover:bg-navy/5 hover:text-navy"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
