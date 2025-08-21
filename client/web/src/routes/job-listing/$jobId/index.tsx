import { createFileRoute } from '@tanstack/react-router'
import GradientLayout from '@/layouts/gradient-layout'
import GlassLayout from '@/layouts/glass-layout'
import { useJob } from '@/hooks/use-job'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { Field } from '@/ui/field'

export const Route = createFileRoute('/job-listing/$jobId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { jobId } = Route.useParams()
  const { data, isLoading, isError, error } = useJob(jobId)

  return (
    <GradientLayout>
      <GlassLayout hideBrand>
        <Card className="backdrop-blur-md bg-black/15 border-white/10 shadow-xl">
          <CardHeader className="items-center text-center gap-2">
            <CardTitle className="text-xl flex flex-col items-center gap-2">
              {isLoading ? (
                <span>Loading job…</span>
              ) : isError ? (
                <span className="text-red-500">{error?.message ?? 'Failed to load job'}</span>
              ) : (
                <>
                  <span>{data?.title}</span>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {data?.status && <Badge>{data.status}</Badge>}
                    {data?.job_type && <Badge variant="secondary">{data.job_type}</Badge>}
                  </div>
                </>
              )}
            </CardTitle>
            {!isLoading && !isError && (
              <CardDescription>
                {data?.location}
              </CardDescription>
            )}
          </CardHeader>
          {!isLoading && !isError && data && (
            <CardContent>
              <div className="grid gap-6">
                <Field label="Description" value={data.description} />
                <Field label="Requirements" value={data.requirements} />

                <div className="grid gap-1">
                  {data.skills_required && (
                    <>
                      <span className="text-sm text-muted-foreground">Skills</span>
                      <div className="flex gap-2 flex-wrap">
                        {data.skills_required
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((skill) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Experience Level" value={data.experience_level} />
                  <Field label="Salary Range" value={data.salary_range} />
                  {/* Dates */}
                  {data.posted_at && (
                    <Field label="Posted At" value={new Date(data.posted_at).toLocaleString()} />
                  )}
                  {data.updated_at && (
                    <Field label="Updated At" value={new Date(data.updated_at).toLocaleString()} />
                  )}
                  {data.expires_at && (
                    <Field label="Expires On" value={new Date(data.expires_at).toLocaleDateString()} />
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </GlassLayout>
    </GradientLayout>
  )
}
