import { UpdateCompanyForm } from '@/components/update-company-form'
import PageLayout from '@/layouts/page-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/$companyId/update')({
  component: RouteComponent,
})

function RouteComponent() {
  const { companyId } = Route.useParams()

  return (
    <PageLayout>
      <UpdateCompanyForm companyId={companyId} />
    </PageLayout>
  )
}
