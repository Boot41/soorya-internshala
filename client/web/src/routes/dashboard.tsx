import RecruiterDashboard from '@/components/dashboard/recruiter'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RecruiterDashboard />
}
