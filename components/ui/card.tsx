import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-6 shadow-sm border border-navy/5",
        className
      )}
      {...props}
    />
  );
}
