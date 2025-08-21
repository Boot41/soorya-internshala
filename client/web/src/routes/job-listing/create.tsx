import { CreateJobListingForm } from '@/components/create-job-listing'
import PageLayout from '@/layouts/page-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/job-listing/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout>
      <CreateJobListingForm />
    </PageLayout>
  )
}
