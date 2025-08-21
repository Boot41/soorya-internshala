import { cn } from "@/utils/cn"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Textarea } from "@/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover"
import { Calendar } from "@/ui/calendar"
import { ChevronDownIcon, Plus, X } from "lucide-react"
import { useCreateJob } from "@/hooks/use-create-jobs"
import { Badge } from "@/ui/badge"

export function CreateJobListingForm({ className, ...props }: React.ComponentProps<"div">) {
  const { handleSubmit, register, isSubmitting, errors, setJobType, setStatus, setExpiresAt, skills, addSkill, removeSkill, skillDraft, setSkillDraft, expiresAt } = useCreateJob()
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-md bg-black/15 border-white/10 shadow-xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-xl">Create Job Listing</CardTitle>
          <CardDescription>Provide details for the job posting</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g. Backend Engineer" {...register("title")} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message as string}</p>}
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, team, and impact"
                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message as string}</p>}
            </div>

            {/* Requirements */}
            <div className="grid gap-3">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the key qualifications and requirements"
                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register("requirements")}
              />
              {errors.requirements && <p className="text-sm text-red-500">{errors.requirements.message as string}</p>}
            </div>

            {/* Two columns */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="open" onValueChange={(val) => setStatus(val as any)}>
                  <SelectTrigger className="w-full" id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Remote / Bengaluru" {...register("location")} />
                {errors.location && <p className="text-sm text-red-500">{errors.location.message as string}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Input id="experience_level" placeholder="e.g. Entry-level / Mid / Senior" {...register("experience_level")} />
                {errors.experience_level && (
                  <p className="text-sm text-red-500">{errors.experience_level.message as string}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="job_type">Job Type</Label>
                <Select defaultValue="full-time" onValueChange={(val) => setJobType(val as any)}>
                  <SelectTrigger className="w-full" id="job_type">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input id="salary_range" placeholder="e.g. ₹8L - ₹15L / $80k - $120k" {...register("salary_range")} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="expires_at" className="px-1">Expires At</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="expires_at"
                      className="w-full justify-between font-normal"
                      type="button"
                    >
                      {expiresAt ? new Date(expiresAt).toLocaleDateString() : "Select date"}
                      <ChevronDownIcon className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={expiresAt ?? undefined}
                      onSelect={(d) => setExpiresAt(d ?? undefined)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-3 col-span-2">
                <Label htmlFor="skills_required">Skills</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills_required"
                    placeholder="e.g. Node.js"
                    value={skillDraft}
                    onChange={(e) => setSkillDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSkill(skillDraft)
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={() => addSkill(skillDraft)} disabled={isSubmitting}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(skills ?? []).length > 0 ? (
                    skills.map((s, idx) => (
                      <Badge key={`${s}-${idx}`}>
                        {s}
                        <button type="button" className="ml-1" onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No skills added</span>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="cursor-pointer w-full" disabled={isSubmitting}>
              Save Job Listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

