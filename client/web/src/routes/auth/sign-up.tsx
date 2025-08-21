import { createFileRoute } from '@tanstack/react-router'
import { SignUpForm } from "@/components/sign-up-form"
import { AuthLayout } from "@/layouts/auth-layout"
import PageLayout from '@/layouts/page-layout'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpPage,
})

export default function SignUpPage() {
  return (
    <AuthLayout>
      <PageLayout>
        <SignUpForm />
      </PageLayout>
    </AuthLayout>
  )
}
