import { Link } from '@tanstack/react-router'
import { GalleryVerticalEndIcon } from 'lucide-react'

// Simple global header with fixed height and placeholder links/logo
export default function GlobalHeader() {
    return (
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEndIcon className="size-4" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-foreground">InternHub</span>
                </div>

                <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
                    <Link to="/" className="hover:text-foreground">
                        Home
                    </Link>
                    <a href="#recent-internships" className="hover:text-foreground">
                        Internships
                    </a>
                    <a href="#credibility" className="hover:text-foreground">
                        Credibility
                    </a>
                </nav>

                <div className="flex items-center gap-2">
                    <Link to="/auth/login" className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-accent">
                        Log in
                    </Link>
                    <Link to="/auth/sign-up" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90">
                        Sign up
                    </Link>
                </div>
            </div>
        </header>
    )
}
