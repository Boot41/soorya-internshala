import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/job-listing/$jobId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return 
}
