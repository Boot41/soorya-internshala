import { UpdateJobListingForm } from '@/components/update-job-listing'
import PageLayout from '@/layouts/page-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/job-listing/$jobId/update')({
  component: RouteComponent,
})

function RouteComponent() {
  const { jobId } = Route.useParams()
  return (
    <PageLayout>
      <UpdateJobListingForm jobId={jobId} />
    </PageLayout>
  )
}