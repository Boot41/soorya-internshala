export type JobListingRequestPayload = {
    title: string;
    description: string;
    requirements: string;
    location: string;
    experience_level: string;
    job_type: "full-time" | "part-time" | "internship" | "contract";
    status: "open" | "closed" | "draft";
    skills_required?: string | undefined;
    salary_range?: string | undefined;
    expires_at?: Date | undefined;
}

export type JobListingUpdatePayload = {
  title?: string;
  description?: string;
  requirements?: string;
  skills_required?: string;
  location?: string;
  experience_level?: string;
  job_type?: "full-time" | "part-time" | "internship" | "contract";
  salary_range?: string;
  expires_at?: Date;
  status?: "open" | "closed" | "draft";
}

export type JobListing = {
  job_id: string;
  company_id: string;
  company_name: string;
  recruiter_id: string;
  title: string;
  description: string;
  requirements: string;
  skills_required: string | null;
  location: string;
  experience_level: string | null;
  job_type: "full-time" | "part-time" | "internship" | "contract";
  salary_range: string | null;
  expires_at: string | null; // ISO string from API
  status: "open" | "closed" | "draft";
  posted_at: string; // ISO
  updated_at: string; // ISO
}
