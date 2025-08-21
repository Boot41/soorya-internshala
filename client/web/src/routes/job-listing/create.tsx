import { CreateJobListingForm } from '@/components/create-job-listing'
import { useRestriction } from '@/hooks/use-restriction'
import { useRecruiterCompanyGuard } from '@/hooks/use-recruiter-company-guard'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'
import GlobalHeader from '@/components/global-header'

export const Route = createFileRoute('/job-listing/create')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction('recruiter')
  useRecruiterCompanyGuard()
  return (
      <GradientLayout className='!pt-0 !px-0 justify-start'>
        <GlobalHeader className='w-full' />
        <GlassLayout>
          <CreateJobListingForm />
        </GlassLayout>
      </GradientLayout>
  )
}
