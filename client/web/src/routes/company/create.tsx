import { CreateCompanyForm } from '@/components/create-company-form'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <GradientLayout>
      <GlassLayout>
        <CreateCompanyForm />
      </GlassLayout>
    </GradientLayout>
  )
}
