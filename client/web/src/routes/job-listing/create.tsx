import { CreateJobListingForm } from '@/components/create-job-listing'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/job-listing/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <GradientLayout>
      <GlassLayout>
        <CreateJobListingForm />
      </GlassLayout>
    </GradientLayout>
  )
}
