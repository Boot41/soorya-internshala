import { createFileRoute } from '@tanstack/react-router'
import { SignUpForm } from "@/components/sign-up-form"
import { AuthLayout } from "@/layouts/auth-layout"
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpPage,
})

export default function SignUpPage() {
  return (
    <AuthLayout>
      <GradientLayout>
        <GlassLayout className="max-w-sm">
          <SignUpForm />
        </GlassLayout>
      </GradientLayout>
    </AuthLayout>
  )
}
