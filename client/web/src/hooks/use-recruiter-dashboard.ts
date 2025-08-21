import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRecruiterCompany } from "./use-recruiter-company"
import { useState } from "react"
import { listJobListings } from "@/api/job-listing"
import { listApplicationsByJob, updateApplicationStatus } from "@/api/applications"
import type { ApplicationStatus, JobApplicationItem } from "@/types/application"
import { toast } from "sonner"

export const useRecruiterDashboard = ()=> {
    const qc = useQueryClient()
    const { recruiterCompanyId } = useRecruiterCompany()
  
    const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined)
  
    const jobsQ = useQuery({
      queryKey: ["recruiter", "jobs", recruiterCompanyId ?? null],
      queryFn: () => listJobListings(recruiterCompanyId ? { companyId: recruiterCompanyId } : undefined),
      enabled: !!recruiterCompanyId,
    })
  
    const appsQ = useQuery<JobApplicationItem[], Error>({
      queryKey: ["applications", selectedJobId ?? null],
      queryFn: () => listApplicationsByJob(selectedJobId!),
      enabled: !!selectedJobId,
    })
  
    const { mutateAsync: changeStatus, isPending: isUpdatingStatus } = useMutation({
      mutationFn: ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) =>
        updateApplicationStatus(applicationId, status),
      onSuccess: async () => {
        toast.success("Application status updated")
        await qc.invalidateQueries({ queryKey: ["applications", selectedJobId ?? null] })
      },
      onError: (err) => toast.error(err?.message ?? "Failed to update status"),
    })
  
    return {
      selectedJobId,
      setSelectedJobId,
      jobsQ,
      appsQ,
      changeStatus,
      isUpdatingStatus,
    }
  }