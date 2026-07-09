"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Navigation, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/navigate", label: "Navigate", icon: Navigation },
  { href: "/map", label: "Map", icon: Map },
  { href: "/sos", label: "SOS", icon: Shield },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-navy/10 bg-white/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                active ? "text-sage" : "text-navy/50 hover:text-navy"
              )}
            >
              <Icon className={cn("h-5 w-5", href === "/sos" && "text-transit-red")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
