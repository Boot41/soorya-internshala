import { ApplicantForm } from '@/components/applicant-form'
import PageLayout from '@/layouts/page-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/applicant/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout>
      <ApplicantForm />
    </PageLayout>
  )
}