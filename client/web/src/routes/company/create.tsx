import { CreateCompanyForm } from '@/components/create-company-form'
import GlobalHeader from '@/components/global-header'
import { useRestriction } from '@/hooks/use-restriction'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/create')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction('recruiter')
  return (
      <GradientLayout className='!pt-0 !px-0 justify-start'>
        <GlobalHeader className='w-full' />
        <GlassLayout>
          <CreateCompanyForm />
        </GlassLayout>
      </GradientLayout>
  )
}
