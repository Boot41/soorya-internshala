import Marquee from '@/components/landing/Marquee'

interface HeroProps {
  onScrollToCredibility?: () => void
}

export default function Hero({ onScrollToCredibility }: HeroProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-b from-background to-primary/25 px-6 py-16 text-center">
      <div className="absolute inset-0 -z-10 bg-radial-gradient-primary" />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Find internships that launch your career
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Discover curated opportunities, apply in minutes, and get hired faster — all in one place.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 sm:w-auto"
            onClick={() => {}}
          >
            Get Personalized Internships
          </button>
          <button
            className="w-full rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-accent sm:w-auto"
            onClick={onScrollToCredibility}
          >
            See why students trust us
          </button>
        </div>
        {/* Trusted by companies (compact) */}
        <div className="mt-12">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Trusted by</p>
          <div className="mt-4">
            <Marquee speedMs={22000}>
              {[
                'Acme Corp',
                'Globex',
                'Innotech',
                'Umbrella',
                'Hooli',
                'Vehement',
                'Stark Industries',
                'Wayne Enterprises',
                'Wonka',
              ].map((name) => (
                <div
                  key={name}
                  className="hover:border-primary hover:border-2 flex h-10 min-w-[150px] items-center justify-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground shadow-sm"
                >
                  {name}
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  )
}
