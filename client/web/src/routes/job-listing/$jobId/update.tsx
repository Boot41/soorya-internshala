import { UpdateJobListingForm } from '@/components/update-job-listing'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/job-listing/$jobId/update')({
  component: RouteComponent,
})

function RouteComponent() {
  const { jobId } = Route.useParams()
  return (
    <GradientLayout>
      <GlassLayout>
        <UpdateJobListingForm jobId={jobId} />
      </GlassLayout>
    </GradientLayout>
  )
}