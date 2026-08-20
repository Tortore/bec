import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "olive" | "outline" | "muted";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
      variant === "default" && "bg-primary/10 text-primary",
      variant === "olive" && "bg-olive text-olive-foreground",
      variant === "outline" && "border border-border text-foreground",
      variant === "muted" && "bg-secondary text-muted-foreground",
      className,
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
