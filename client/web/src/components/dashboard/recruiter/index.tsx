import type {  ApplicationStatus } from "@/types/application"
import { SectionCards } from "./section-card"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { IconLoader } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { useRecruiterDashboard } from "@/hooks/use-recruiter-dashboard"
import { Pencil } from "lucide-react"



export default function RecruiterDashboard() {
  const { selectedJobId, setSelectedJobId, jobsQ, appsQ, changeStatus, isUpdatingStatus } = useRecruiterDashboard()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="mx-4 flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h2 className="text-xl font-semibold">Recruiter Dashboard</h2>
          <SectionCards />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Select Job</span>
            <Select
              value={selectedJobId}
              onValueChange={(v) => setSelectedJobId(v)}
              disabled={jobsQ.isLoading || jobsQ.isError}
            >
              <SelectTrigger className="w-80 !bg-black/20">
                <SelectValue placeholder={jobsQ.isLoading ? "Loading jobs..." : "Choose a job"} />
              </SelectTrigger>
              <SelectContent>
                {jobsQ.data?.map((j) => (
                  <SelectItem key={j.job_id} value={j.job_id}>
                    {j.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {jobsQ.isLoading && <IconLoader className="animate-spin" />}
            {jobsQ.isError && <Badge variant="destructive">Failed to load jobs</Badge>}
            {selectedJobId && (
              <Link
                to="/job-listing/$jobId/update"
                params={{ jobId: selectedJobId }}
                aria-label="Edit job"
                title="Edit job"
                className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 p-2 text-white/90 shadow-sm hover:bg-white/10"
              >
                <Pencil className="h-4 w-4 text-primary" />
              </Link>
            )}
          </div>

          <div className="overflow-hidden rounded-lg border bg-black/20 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Profile URL</TableHead>
                  <TableHead>Resume URL</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!selectedJobId ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Select a job to view applicants
                    </TableCell>
                  </TableRow>
                ) : appsQ.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <IconLoader className="animate-spin" /> Loading applicants...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : appsQ.isError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Failed to load applicants
                    </TableCell>
                  </TableRow>
                ) : appsQ.data && appsQ.data.length > 0 ? (
                  appsQ.data.map((app) => (
                    <TableRow key={app.application_id}>
                      <TableCell>{app.applicant_name}</TableCell>
                      <TableCell className="underline">
                        <a href={`mailto:${app.applicant_email}`}>
                          {app.applicant_email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Link to="/applicant/$applicantId" params={{ applicantId: app.applicant_id }} className=" underline">
                          Profile URL
                        </Link>
                      </TableCell>
                      <TableCell className="underline">
                        {app.resume_url ? (
                          <a href={app.resume_url} target="_blank" rel="noreferrer">Resume URL</a>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={app.status}
                          onValueChange={(v) =>
                            changeStatus({ applicationId: app.application_id, status: v as ApplicationStatus })
                          }
                          disabled={isUpdatingStatus}
                        >
                          <SelectTrigger className="w-44 capitalize">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(["applied", "under review", "shortlisted", "rejected", "hired"] as ApplicationStatus[]).map(
                              (s) => (
                                <SelectItem 
                                className="capitalize"
                                key={s} value={s}>
                                  {s}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No applicants found
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