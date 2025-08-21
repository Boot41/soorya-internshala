import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listJobListings } from "@/api/job-listing"
import { listApplicationsByJob, updateApplicationStatus, type JobApplicationItem, type ApplicationStatus } from "@/api/applications"
import { useRecruiterCompany } from "@/hooks/use-recruiter-company"
import { SectionCards } from "./section-card"
import { toast } from "sonner"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { IconLoader } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { useRecruiterDashboard } from "@/hooks/use-recruiter-dashboard"



export default function RecruiterDashboard() {
  const { selectedJobId, setSelectedJobId, jobsQ, appsQ, changeStatus, isUpdatingStatus } = useRecruiterDashboard()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="mx-4 flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Select Job</span>
            <Select
              value={selectedJobId}
              onValueChange={(v) => setSelectedJobId(v)}
              disabled={jobsQ.isLoading || jobsQ.isError}
            >
              <SelectTrigger className="w-80">
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
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Profile URL</TableHead>
                  <TableHead>Resume URL</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!selectedJobId ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Select a job to view applicants
                    </TableCell>
                  </TableRow>
                ) : appsQ.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <IconLoader className="animate-spin" /> Loading applicants...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : appsQ.isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Failed to load applicants
                    </TableCell>
                  </TableRow>
                ) : appsQ.data && appsQ.data.length > 0 ? (
                  appsQ.data.map((app) => (
                    <TableRow key={app.application_id}>
                      <TableCell>{app.applicant_name}</TableCell>
                      <TableCell>
                        <Link to="/applicant/$applicantId" params={{ applicantId: app.applicant_id }} className="text-primary underline">
                          /applicant/{app.applicant_id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {app.resume_url ? (
                          <Button variant="link" className="px-0" asChild>
                            <a href={app.resume_url} target="_blank" rel="noreferrer">Resume</a>
                          </Button>
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
                          <SelectTrigger className="w-44">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(["applied", "under review", "shortlisted", "rejected", "hired"] as ApplicationStatus[]).map(
                              (s) => (
                                <SelectItem key={s} value={s}>
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
                    <TableCell colSpan={4} className="text-center">
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