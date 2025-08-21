import { cn } from "@/utils/cn";
import { Link } from "@tanstack/react-router";
import { GalleryVerticalEndIcon } from "lucide-react";

export default function GlassLayout({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("flex w-full max-w-[80%] flex-col gap-6", className)}>
            <Link to="/" className="flex items-center gap-2 self-center font-medium">
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                    <GalleryVerticalEndIcon className="size-4" />
                </div>
                Internshala
            </Link>
            {children}
        </div>
    )
}