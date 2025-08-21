import { CreateJobListingForm } from '@/components/create-job-listing'
import { createFileRoute, Link } from '@tanstack/react-router'
import { GalleryVerticalEndIcon } from 'lucide-react'

export const Route = createFileRoute('/job-listing/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-gradient-to-b from-primary/40 via-muted to-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-[80%] flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Internshala
        </Link>
        <CreateJobListingForm  />
      </div>
    </div>
  )
}
