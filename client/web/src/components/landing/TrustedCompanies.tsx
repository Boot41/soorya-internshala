import Marquee from './Marquee'

export interface CompanyItem {
  id: string
  name: string
}

function CompanyPill({ name }: { name: string }) {
  return (
    <div className="flex h-14 min-w-[180px] items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground shadow-sm">
      {name}
    </div>
  )
}

interface TrustedCompaniesProps {
  items?: CompanyItem[]
}

export default function TrustedCompanies({ items }: TrustedCompaniesProps) {
  const fallback: CompanyItem[] = [
    'Acme Corp',
    'Globex',
    'Innotech',
    'Umbrella',
    'Hooli',
    'Vehement',
    'Stark Industries',
    'Wayne Enterprises',
    'Wonka',
  ].map((name, i) => ({ id: `c-${i}`, name }))

  const data = items?.slice(0, 12) ?? fallback

  return (
    <section id="credibility" className="bg-secondary py-16">
      <div className="">
        <h2 className="text-2xl pl-6 font-bold tracking-tight text-foreground sm:text-3xl">
          Trusted by these companies
        </h2>
        <p className="mt-2 pl-6 text-sm text-muted-foreground">Top startups and brands hire interns through our platform</p>
        <div className="mt-6">
          <Marquee speedMs={25000}>
            {data.map((c) => (
              <CompanyPill key={c.id} name={c.name} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
