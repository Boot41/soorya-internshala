import RecruiterDashboard from '@/components/dashboard/recruiter'
import GlobalHeader from '@/components/global-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <GlobalHeader />
      <RecruiterDashboard />
    </>
  )
}
