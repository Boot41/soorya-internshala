import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/components/landing/hero'
import RecentInternships from '@/components/landing/recent-internships'
import Testimonials from '@/components/landing/testimonials'
import { LandingGradientLayout } from '@/layouts/gradient-layout'
import GlobalHeader from '@/components/global-header'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const handleScrollToCredibility = () => {
    const el = document.getElementById('credibility')
    if (!el) return
    const headerOffset = 64 // 4rem header
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <LandingGradientLayout>
      <GlobalHeader />
      <main className="bg-transparent">
        <Hero onScrollToCredibility={handleScrollToCredibility} />
        <div className='relative justify-between flex flex-col min-h-[calc(100vh-8rem)] items-center overflow-hidden bg-gradient-to-t from-background to-primary/25 px-6 py-16 text-center'>
          <RecentInternships />
          <Testimonials />
        </div>
      </main>
    </LandingGradientLayout>
  )
}
