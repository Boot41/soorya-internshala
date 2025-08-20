import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh">
      <header className="absolute left-0 top-0 z-10 w-full p-4 md:p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to Home
        </Link>
      </header>
      {children}
    </div>
  )
}
