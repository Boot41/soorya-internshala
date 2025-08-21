import { createFileRoute } from '@tanstack/react-router'
import GlobalHeader from '@/components/global-header'
import GradientLayout from '@/layouts/gradient-layout'
import GlassLayout from '@/layouts/glass-layout'
import JobListCard from '@/components/application/job-list-card'
import JobListFilters from '@/components/application/job-list-filters'
import JobListSkeleton from '@/components/application/job-list-skeleton'
import { useJobListingsFeed,  } from '@/hooks/use-job-listings-feed'
import { Button } from '@/ui/button'
import { Separator } from '@/ui/separator'
import { useRestriction } from '@/hooks/use-restriction'
import { useJobFilters } from '@/hooks/use-job-filters'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

export const Route = createFileRoute('/job-listing/')({
  component: RouteComponent,
})

function RouteComponent() {

  useRestriction()

  const filters = useJobFilters({ sort_by: 'posted_at', sort_order: 'desc', limit: 20 })

  const { items, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useJobListingsFeed(filters.params)

  const { ref: sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    canLoad: Boolean(hasNextPage && !isFetchingNextPage),
  })

  return (
    <GradientLayout className='!pt-0 !px-0 justify-start'>
      <GlobalHeader className='w-full' />
      <GlassLayout className='flex-1 w-full max-w-5xl mx-auto px-4 md:px-6' hideBrand>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Browse Jobs</h1>
            <p className="text-sm text-white/70">Search, filter and scroll infinitely</p>
          </div>
        </div>

        <Separator className="my-4 bg-white/10" />

        <JobListFilters
          value={filters.value}
          onChange={filters.onChange}
          reset={filters.reset}
          searchValue={filters.searchValue}
          onSearchChange={filters.onSearchChange}
        />

        <div className="mt-6 grid gap-3">
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <JobListSkeleton key={i} />
              ))}
            </>
          ) : isError ? (
            <div className="text-red-400">{error?.message ?? 'Failed to load jobs'}</div>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="text-center text-white/70 py-10">No Internships found</div>
              ) : (
                items.map((j) => (
                  <JobListCard
                    experience={j.experience_level}
                    companyId={j.company_id}
                    id={j.job_id}
                    key={j.job_id}
                    title={j.title}
                    company={j.company_name}
                    location={j.location}
                    jobType={j.job_type}
                    postedAt={j.posted_at}
                    description={j.description}
                  />
                ))
              )}

              <div ref={sentinelRef} />

              {isFetchingNextPage && (
                <div className="mt-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <JobListSkeleton key={i} />
                  ))}
                </div>
              )}

              {!hasNextPage && !isFetchingNextPage && items.length > 0 && (
                <div className="text-center text-white/60 py-4">You are all caught up</div>
              )}

              {hasNextPage && (
                <div className="flex justify-center py-4">
                  <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? 'Loading…' : 'Load more'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </GlassLayout>
    </GradientLayout>
  )
}
