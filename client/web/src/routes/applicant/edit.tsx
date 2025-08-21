import { ApplicantForm } from '@/components/applicant-form'
import GlobalHeader from '@/components/global-header'
import { useRestriction } from '@/hooks/use-restriction'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/applicant/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction('applicant')
  return (
    <GradientLayout className='!pt-0 !px-0 justify-start'>
      <GlobalHeader className='w-full' />
      <GlassLayout>
        <ApplicantForm />
      </GlassLayout>
    </GradientLayout>
  )
}