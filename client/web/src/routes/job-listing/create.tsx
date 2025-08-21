import { CreateJobListingForm } from '@/components/create-job-listing'
import { useRestriction } from '@/hooks/use-restriction'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/job-listing/create')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction('recruiter')
  return (
    <GradientLayout>
      <GlassLayout>
        <CreateJobListingForm />
      </GlassLayout>
    </GradientLayout>
  )
}
