import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from "@/components/login-form"
import { AuthLayout } from "@/layouts/auth-layout"
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})


export default function LoginPage() {
  return (
    <AuthLayout>
      <GradientLayout>
        <GlassLayout className="max-w-sm">
          <LoginForm />
        </GlassLayout>
      </GradientLayout>
    </AuthLayout>
  )
}
