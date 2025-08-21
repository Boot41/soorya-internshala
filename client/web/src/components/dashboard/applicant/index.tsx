import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { listMyApplications, } from "@/api/applications"
import type { MyApplicationItem } from "@/types/application"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { Badge } from "@/ui/badge"
import { IconLoader } from "@tabler/icons-react"

export default function ApplicantDashboard() {
  const appsQ = useQuery<MyApplicationItem[], Error>({
    queryKey: ["applicant", "applications"],
    queryFn: listMyApplications,
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="mx-4 flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h2 className="text-xl font-semibold">Applicant Dashboard</h2>
          <div className="overflow-hidden rounded-lg border bg-black/20 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Job Type</TableHead>
                  <TableHead>Job Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appsQ.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <IconLoader className="animate-spin" /> Loading applications...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : appsQ.isError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Failed to load applications
                    </TableCell>
                  </TableRow>
                ) : appsQ.data && appsQ.data.length > 0 ? (
                  appsQ.data.map((app) => (
                    <TableRow key={app.application_id}>
                      <TableCell>
                        <Link
                          to="/job-listing/$jobId"
                          params={{ jobId: app.job_id }}
                          className="underline"
                        >
                          {app.job_title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          to="/company/$companyId"
                          params={{ companyId: app.company_id }}
                          className="underline"
                        >
                          {app.company_name}
                        </Link>
                      </TableCell>
                      <TableCell className="capitalize">{app.job_type.replace('-', ' ')}</TableCell>
                      <TableCell>{app.job_location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {app.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}