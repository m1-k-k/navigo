import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-navy/10 bg-white px-4 py-3 text-navy placeholder:text-navy/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
