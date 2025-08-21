import { createFileRoute, Link } from '@tanstack/react-router'
import { useRestriction } from '@/hooks/use-restriction'
import GradientLayout from '@/layouts/gradient-layout'
import GlassLayout from '@/layouts/glass-layout'
import { useApplicant } from '@/hooks/use-applicant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { FileText, Pencil } from 'lucide-react'
import { Row } from '@/ui/row'
import { Badge } from '@/ui/badge'

export const Route = createFileRoute('/applicant/')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction('applicant')
  const { data, isLoading, isError, error } = useApplicant()

  return (
    <GradientLayout>
      <GlassLayout hideBrand>
        <div className="relative">
          <Link
            to="/applicant/edit"
            aria-label="Edit profile"
            className="z-10 absolute right-3 top-3 inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 p-2 text-white/90 shadow-sm hover:bg-white/10"
            title="Edit"
          >
            <Pencil className="h-4 w-4 text-primary" />
          </Link>
          <Card className="backdrop-blur-md bg-black/15 border-white/10 shadow-xl">
          <CardHeader className="items-center text-center gap-2">
            {/* Avatar */}
            {!isLoading && !isError && (
              <div className="flex items-center justify-center pb-2">
                <Avatar className="h-20 w-20 border border-white/20">
                  <AvatarImage className="object-cover" alt="Profile photo" src={data?.profile_picture_url ?? undefined} />
                  <AvatarFallback className="text-lg">{(data?.first_name?.[0] ?? 'A')}</AvatarFallback>
                </Avatar>
              </div>
            )}
            <CardTitle className="text-xl">
              {isLoading ? 'Loading profile…' : isError ? (error?.message ?? 'Failed to load profile') : `${data?.first_name ?? ''} ${data?.last_name ?? ''}`.trim() || 'Your Profile'}
            </CardTitle>
            {!isLoading && !isError && (
              <CardDescription>{data?.email}</CardDescription>
            )}
            {/* Download Resume button below email */}
            {!isLoading && !isError && (
              <div className="flex items-center justify-center pt-1">
                {data?.resume_url ? (
                  <a
                    href={data.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-fit inline-flex items-center gap-2 rounded-md border border-dashed border-white/15 bg-white/5 px-3 py-2 text-xs text-white/90 shadow-sm hover:bg-white/10"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Download resume</span>
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">Resume not set</span>
                )}
              </div>
            )}
          </CardHeader>
          {!isLoading && !isError && data && (
            <CardContent>
              <div className="grid gap-6">
                <Row label="Headline" value={data.headline ?? undefined} />
                <Row label="Bio" value={data.bio ?? undefined} />

                {/* Experience + Education in a single row */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Experience */}
                  <div className="grid gap-1">
                    <span className="text-sm text-muted-foreground">Experience</span>
                    {data.experience && data.experience.length > 0 ? (
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {data.experience.map((it, idx) => (
                          <li key={idx}>
                            {(it.title?.trim() || 'Title not set')} at {(it.company?.trim() || 'Company not set')}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm">Not set</span>
                    )}
                  </div>

                  {/* Education */}
                  <div className="grid gap-1">
                    <span className="text-sm text-muted-foreground">Education</span>
                    {data.education && data.education.length > 0 ? (
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {data.education.map((it, idx) => (
                          <li key={idx}>
                            {(it.degree?.trim() || 'Degree not set')} at {(it.university?.trim() || 'University not set')}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm">Not set</span>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="grid gap-1">
                  <span className="text-sm text-muted-foreground">Skills</span>
                  {data.skills && data.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((s, idx) => (
                        <Badge key={`${s}-${idx}`}>{s}</Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm">Not set</span>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </GlassLayout>
  </GradientLayout>
  )
}
