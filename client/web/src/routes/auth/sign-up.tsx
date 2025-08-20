import { createFileRoute, Link } from '@tanstack/react-router'
import { GalleryVerticalEnd } from "lucide-react"
import { SignUpForm } from "@/components/sign-up-form"
import { AuthLayout } from "@/layouts/auth-layout"

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpPage,
})

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Internshala
          </Link>
          <SignUpForm />
        </div>
      </div>
    </AuthLayout>
  )
}
