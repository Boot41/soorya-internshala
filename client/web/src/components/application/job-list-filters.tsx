import { Input } from "@/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Button } from "@/ui/button"
import type { JobListingsFeedParams } from "@/types/job-listing"

type Props = {
  value: JobListingsFeedParams
  onChange: (next: JobListingsFeedParams) => void
  reset: () => void
  searchValue: string
  onSearchChange: (val: string) => void
}

const jobTypes = ["full-time", "part-time", "internship", "contract"] as const
const sortByOptions = [
  { label: "Newest", sort_by: "posted_at", sort_order: "desc" },
  { label: "Recently Updated", sort_by: "updated_at", sort_order: "desc" },
] as const

export default function JobListFilters({ value, onChange, reset, searchValue, onSearchChange }: Props) {
  const update = <K extends keyof JobListingsFeedParams>(k: K, v: JobListingsFeedParams[K]) => {
    onChange({ ...value, [k]: v })
  }

  return (
    <div className="grid gap-3 md:grid-cols-5">
      <div className="md:col-span-2">
        <Input
          placeholder="Search by title, description or location"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-black/20 border-white/10"
        />
      </div>


      <Select value={value.job_type ?? ""} onValueChange={(v) => update("job_type", (v || undefined) as any)}>
        <SelectTrigger className="bg-black/20 border-white/10">
          <SelectValue placeholder="Job type" />
        </SelectTrigger>
        <SelectContent>
          {jobTypes.map((t) => (
            <SelectItem className="capitalize" key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.experience_level ?? ""} onValueChange={(v) => update("experience_level", v || undefined)}>
        <SelectTrigger className="bg-black/20 border-white/10">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Intern">Intern</SelectItem>
          <SelectItem value="Junior">Junior</SelectItem>
          <SelectItem value="Mid">Mid</SelectItem>
          <SelectItem value="Senior">Senior</SelectItem>
          <SelectItem value="Lead">Lead</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Select
          value={`${value.sort_by ?? "posted_at"}|${value.sort_order ?? "desc"}`}
          onValueChange={(v) => {
            const [sort_by, sort_order] = v.split("|") as ["posted_at" | "updated_at", "asc" | "desc"]
            onChange({ ...value, sort_by, sort_order })
          }}
        >
          <SelectTrigger className="bg-black/20 border-white/10">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {sortByOptions.map((o) => (
              <SelectItem key={o.label} value={`${o.sort_by}|${o.sort_order}`}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="secondary" className="bg-white/10 border-white/10" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
