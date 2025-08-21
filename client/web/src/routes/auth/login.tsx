import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from "@/components/login-form"
import { AuthLayout } from "@/layouts/auth-layout"
import PageLayout from '@/layouts/page-layout'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})


export default function LoginPage() {
  return (
    <AuthLayout>
      <PageLayout>
        <LoginForm />
      </PageLayout>
    </AuthLayout>
  )
}
