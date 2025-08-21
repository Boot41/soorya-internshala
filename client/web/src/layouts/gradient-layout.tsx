import { cn } from "@/utils/cn";
import type { PropsWithChildren } from "react";

// Centered gradient layout (good for auth screens, dialogs etc.)
export default function GradientLayout({ children, className }: PropsWithChildren & { className?: string }) {
  return (
    <div className={cn("flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-b from-primary/40 via-muted to-muted p-6 md:p-10", className)}>
      {children}
    </div>
  )
}

// Landing page gradient layout (full-flow, not centered)
export function LandingGradientLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-svh bg-gradient-to-b from-background via-primary/5 to-primary/10">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-gradient-primary" />
      <div className="relative">
        {children}
      </div>
    </div>
  )
}