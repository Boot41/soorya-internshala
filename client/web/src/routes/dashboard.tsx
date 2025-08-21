import RecruiterDashboard from '@/components/dashboard/recruiter'
import GlobalHeader from '@/components/global-header'
import { useRestriction } from '@/hooks/use-restriction'
import GradientLayout from '@/layouts/gradient-layout'
import GlassLayout from '@/layouts/glass-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction()
  return (
    <GradientLayout className='!pt-0 !px-0 justify-start'>
      <GlobalHeader className='w-full' />
      <GlassLayout className='flex-1 justify-center' hideBrand>
        <RecruiterDashboard />
      </GlassLayout>
    </GradientLayout>
  )
}
