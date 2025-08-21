import { UpdateCompanyForm } from '@/components/update-company-form'
import { useRestriction } from '@/hooks/use-restriction'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'
import GlobalHeader from '@/components/global-header'

export const Route = createFileRoute('/company/$companyId/update')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction('recruiter')
  const { companyId } = Route.useParams()

  return (
      <GradientLayout className='!pt-0 !px-0 justify-start'>
        <GlobalHeader className='w-full' />
        <GlassLayout>
          <UpdateCompanyForm companyId={companyId} />
        </GlassLayout>
      </GradientLayout>
  )
}
