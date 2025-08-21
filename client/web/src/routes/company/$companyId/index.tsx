import { createFileRoute } from '@tanstack/react-router'
import GlobalHeader from '@/components/global-header'
import GradientLayout from '@/layouts/gradient-layout'
import GlassLayout from '@/layouts/glass-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Row } from '@/ui/row'
import { useCompany } from '@/hooks/use-company'

export const Route = createFileRoute('/company/$companyId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { companyId } = Route.useParams()
  const { data, isLoading, isError, error } = useCompany(companyId)

  return (
      <GradientLayout className='!pt-0 !px-0 justify-start'>
        <GlobalHeader className='w-full' />
        <GlassLayout className='flex-1 justify-center' hideBrand>
          <Card className="backdrop-blur-md bg-black/15 border-white/10 shadow-xl">
            <CardHeader className="items-center text-center gap-2">
              {/* Logo */}
              {!isLoading && !isError && (
                <div className="flex items-center justify-center pb-2">
                  <Avatar className="h-20 w-20 border border-white/20">
                    <AvatarImage className="object-cover" alt="Company logo" src={data?.logo_url ?? undefined} />
                    <AvatarFallback className="text-lg">{(data?.name?.[0] ?? 'C')}</AvatarFallback>
                  </Avatar>
                </div>
              )}
              <CardTitle className="text-xl">
                {isLoading ? 'Loading company…' : isError ? (error?.message ?? 'Failed to load company') : (data?.name || 'Company')}
              </CardTitle>
              {!isLoading && !isError && data?.website_url && (
                <CardDescription>
                  <a
                    href={data.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-white"
                  >
                    {data.website_url}
                  </a>
                </CardDescription>
              )}
            </CardHeader>
            {!isLoading && !isError && data && (
              <CardContent>
                <div className="grid gap-6">
                  <Row label="Description" value={data.description ?? undefined} />
                  <div className="grid gap-6 md:grid-cols-2">
                    <Row label="Industry" value={data.industry ?? undefined} />
                    <Row label="Headquarters" value={data.headquarters ?? undefined} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </GlassLayout>
      </GradientLayout>
  )
}
