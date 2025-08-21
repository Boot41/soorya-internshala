import { Link } from '@tanstack/react-router'
import { GalleryVerticalEndIcon, LogOut } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useUserStore } from '@/store/user'
import { useLogout } from '@/hooks/use-logout'

// Simple global header with fixed height and placeholder links/logo
export default function GlobalHeader({className}: {className?: string}) {
    // Select individually to avoid object identity changes causing re-renders
    const userId = useUserStore((s) => s.userId)
    const fullName = useUserStore((s) => s.fullName)
    const userType = useUserStore((s) => s.userType)
    const { logout, isLoggingOut } = useLogout()

    return (
        <header className={cn("sticky top-0 z-40 h-16 border-b border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60", className)}>
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEndIcon className="size-4" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-foreground">InternHub</span>
                </Link>

                <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
                    {userId && <Link to="/dashboard" className="hover:text-foreground">
                        Dashboard
                    </Link>}
                    {userType === 'applicant' && <Link to="/job-listing" className="hover:text-foreground">
                        Internships
                    </Link>}
                    {userType === 'recruiter' && <Link to="/company" className="hover:text-foreground">
                        Company
                    </Link>}
                    {userType === 'recruiter' && <Link to="/job-listing/create" className="hover:text-foreground">
                        Create an Opening
                    </Link>}
                    {userType === 'applicant' && <Link to="/applicant" className="hover:text-foreground">
                        View Profile
                    </Link>}
                </nav>

                <div className="flex items-center gap-2">
                    {userId ? (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end leading-tight">
                                <span className="text-sm font-medium">{fullName ?? 'User'}</span>
                                <span className="text-xs capitalize text-muted-foreground">{userType ?? ''}</span>
                            </div>
                            <button
                                type="button"
                                aria-label="Log out"
                                onClick={() => logout()}
                                disabled={isLoggingOut}
                                className="cursor-pointer rounded-md border border-border p-2 hover:bg-accent"
                            >
                                <LogOut className="size-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/auth/login" className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-accent">
                                Log in
                            </Link>
                            <Link to="/auth/sign-up" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
