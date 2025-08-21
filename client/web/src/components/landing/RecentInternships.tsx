//

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
      <button className="mt-4 w-full rounded-md bg-primary py-2 text-sm text-primary-foreground hover:opacity-90">View</button>
    </div>
  )
}

interface RecentInternshipsProps {
  items?: InternshipCardData[]
}

export default function RecentInternships({ items }: RecentInternshipsProps) {
  // Placeholder items if none provided. Replace with API wired data later.
  const fallback: InternshipCardData[] = Array.from({ length: 5 }).map((_, i) => ({
    id: `dummy-${i + 1}`,
    title: ['Frontend Intern', 'Backend Intern', 'Data Analyst Intern', 'Marketing Intern', 'Design Intern'][i] || 'Internship',
    company: ['Acme Corp', 'Globex', 'Innotech', 'Soylent', 'Umbrella'][i] || 'Company',
    location: 'Remote',
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }))

  const data = items?.slice(0, 5) ?? fallback

  return (
    <section id="recent-internships" className="bg-transparent px-6 py-16">
      <div className="">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Recently added Internships</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {data.map((it) => (
            <InternshipCard key={it.id} item={it} />
          ))}
        </div>
      </div>
    </section>
  )
}
