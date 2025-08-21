import { UpdateJobListingForm } from '@/components/update-job-listing'
import { useRestriction } from '@/hooks/use-restriction'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'
import GlobalHeader from '@/components/global-header'

export const Route = createFileRoute('/job-listing/$jobId/update')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction('recruiter')
  const { jobId } = Route.useParams()
  return (
      <GradientLayout>
        <GlobalHeader />
        <GlassLayout>
          <UpdateJobListingForm jobId={jobId} />
        </GlassLayout>
      </GradientLayout>
  )
}