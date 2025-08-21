import Marquee from './Marquee'
import testimonies from '@/mocks/testimonies.json'

interface TestimonyItem {
  id: string
  name: string
  role: string
  quote: string
  avatarUrl?: string
}

function TestimonyCard({ item }: { item: TestimonyItem }) {
  return (
    <div className="flex min-w-[280px] max-w-sm flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted" style={item.avatarUrl ? { backgroundImage: `url(${item.avatarUrl})`, backgroundSize: 'cover' } : {}} />
        <div>
          <p className="text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.role}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">“{item.quote}”</p>
    </div>
  )
}

export default function Testimonials() {
  const data = (testimonies as TestimonyItem[]).slice(0, 12)
  return (
    <section id="credibility" className="bg-transparent py-16">
      <div className="">  
        <h2 className="text-2xl pl-6 font-bold tracking-tight text-foreground sm:text-3xl">Success stories from our learners</h2>
        <p className="mt-2 pl-6 text-sm text-muted-foreground">Real students, real internships, real outcomes</p>
        <div className="mt-6">
          <Marquee speedMs={30000} direction="right">
            {data.map((t) => (
              <TestimonyCard key={t.id} item={t} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
