import type { PropsWithChildren } from "react";

export default function GradientLayout({ children }: PropsWithChildren) {
    return (
        <div className="bg-gradient-to-b from-primary/40 via-muted to-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            {children}
        </div>
    )
}