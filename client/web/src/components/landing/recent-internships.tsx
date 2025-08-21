//

import { Link } from "@tanstack/react-router"
import { useJobListings } from "@/hooks/use-job-listings"

export interface InternshipCardData {
  id: string
  title: string
  company: string
  location: string
  createdAt: string
}

function InternshipCard({ item }: { item: InternshipCardData }) {
  return (
    <div className="flex min-w-[260px] max-w-sm flex-col rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
        <span className="whitespace-nowrap text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{item.company}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{item.location}</p>
      <Link
        to="/job-listing/$jobId"
        params={{ jobId: item.id }}
        className="mt-4 w-full rounded-md bg-primary py-2 text-sm text-primary-foreground hover:opacity-90"
      >
        View
      </Link>
    </div>
  )
}

interface RecentInternshipsProps {
  items?: InternshipCardData[]
}

export default function RecentInternships({ items }: RecentInternshipsProps) {
  // If explicit items are passed, use them; else fetch recent 5 from API
  const { data, isLoading, isError, error } = useJobListings({ limit: 5 })
  const cards: InternshipCardData[] = items
    ? items.slice(0, 5)
    : (data ?? []).map((j) => ({
        id: j.job_id,
        title: j.title,
        company: j.company_name,
        location: j.location,
        createdAt: j.posted_at,
      }))

  return (
    <section id="recent-internships" className="bg-transparent px-6 py-16">
      <div className="">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Recently added Internships</h2>
        {isLoading && !items && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse h-32 rounded-lg border border-border bg-card" />
            ))}
          </div>
        )}
        {isError && !items && (
          <p className="mt-4 text-sm text-destructive">{error?.message || 'Failed to load recent internships.'}</p>
        )}
        {!!cards.length && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {cards.map((it) => (
              <InternshipCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
