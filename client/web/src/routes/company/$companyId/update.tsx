import { UpdateCompanyForm } from '@/components/update-company-form'
import GlassLayout from '@/layouts/glass-layout'
import GradientLayout from '@/layouts/gradient-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/$companyId/update')({
  component: RouteComponent,
})

function RouteComponent() {
  const { companyId } = Route.useParams()

  return (
    <GradientLayout>
      <GlassLayout>
        <UpdateCompanyForm companyId={companyId} />
      </GlassLayout>
    </GradientLayout>
  )
}
