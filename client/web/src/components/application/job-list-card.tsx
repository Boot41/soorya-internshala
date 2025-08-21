import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Link } from "@tanstack/react-router"

type Props = {
    id: string
  title: string
  company: string
  location: string
  jobType: string
  postedAt: string
  description?: string
  companyId: string
  experience?: string | null
}

export default function JobListCard({ experience, title, company, location, jobType, postedAt, description, id: jobId, companyId }: Props) {
  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="gap-1">
        <Link to="/job-listing/$jobId" params={{ jobId }}>
        <CardTitle className="text-base md:text-lg">{title}</CardTitle>
        </Link>
        <div className="text-sm text-white/70 flex flex-wrap gap-2">
          <Link to="/company/$companyId" params={{ companyId }}>{company}</Link>
          <span className="px-2">•</span>
          <span className="uppercase tracking-wide text-xs md:text-sm bg-white/10 px-2 py-0.5 rounded-md">{jobType}</span>
          {experience && (
              <>
              <span className="px-2">•</span>
              <span className="uppercase tracking-wide text-xs md:text-sm bg-white/10 px-2 py-0.5 rounded-md">{experience}</span>
            </>
          )}
          <span className="px-2">•</span>
          <span>{location}</span>
        </div>
        <div className="text-xs text-white/50">Posted {new Date(postedAt).toLocaleDateString()}</div>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-sm text-white/80 line-clamp-3">{description}</p>
        </CardContent>
      )}
    </Card>
  )
}
