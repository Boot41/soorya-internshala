import { CreateCompanyForm } from '@/components/create-company-form'
import PageLayout from '@/layouts/page-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout>
      <CreateCompanyForm />
    </PageLayout>
  )
}
