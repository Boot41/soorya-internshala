import { ApplicantForm } from '@/components/applicant-form'
import { useRestriction } from '@/hooks/use-restriction'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/applicant/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction('applicant')
  return (
    <GradientLayout>
      <GlassLayout>
        <ApplicantForm />
      </GlassLayout>
    </GradientLayout>
  )
}