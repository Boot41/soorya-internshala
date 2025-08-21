import { ApplicantForm } from '@/components/applicant-form'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/applicant/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <GradientLayout>
      <GlassLayout>
        <ApplicantForm />
      </GlassLayout>
    </GradientLayout>
  )
}