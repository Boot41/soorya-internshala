import { cn } from "@/utils/cn"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Textarea } from "@/ui/textarea"
import { Pencil, FileText, Plus, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { useApplicantForm } from "@/hooks/use-applicant-form"

export function ApplicantForm({ className, ...props }: React.ComponentProps<"div">) {
  const {
    experiences,
    educations,
    avatarUrl,
    isUploadingAvatar,
    isUploadingResume,
    isLoadingProfile,
    isSavingProfile,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    uploadAvatar,
    uploadResume,
    saveProfile,
    profile
  } = useApplicantForm()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-md bg-black/15 border-white/10 shadow-xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-xl">Update Applicant Profile</CardTitle>
          <CardDescription>Keep your profile up to date</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Avatar with edit (pencil) that triggers file upload */}
          <div className="flex items-center justify-center pb-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border border-white/20">
                <AvatarImage className="object-cover" alt="Profile photo" src={avatarUrl} />
                <AvatarFallback className="text-lg">{profile?.first_name?.[0] ?? 'A'}</AvatarFallback>
              </Avatar>
              {/* Hidden file input */}
              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={async (e) => {
                  const file = e.currentTarget.files?.[0]
                  if (!file) return
                  await uploadAvatar(file)
                  // reset input value to allow re-uploading same file if needed
                  e.currentTarget.value = ""
                }}
              />
              <label
                htmlFor="avatar-upload"
                className={cn(
                  "absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow ring-2 ring-background cursor-pointer hover:opacity-90",
                  (isUploadingAvatar || isLoadingProfile) && "opacity-60 pointer-events-none"
                )}
                aria-label="Edit avatar"
                title="Edit avatar"
                aria-disabled={isUploadingAvatar || isLoadingProfile}
              >
                <Pencil className="h-4 w-4" />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-center pb-2">
            <div className="flex gap-2">
              {profile?.resume_url ? (
                <>
                  {/* Hidden input to replace resume */}
                  <input
                    id="resume-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.currentTarget.files?.[0]
                      if (!file) return
                      await uploadResume(file)
                      e.currentTarget.value = ""
                    }}
                  />
                  <a
                    href={(profile.resume_url as unknown as string) ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-fit inline-flex items-center gap-2 rounded-md border border-dashed border-white/15 bg-white/5 px-3 py-2 text-xs text-white/90 shadow-sm hover:bg-white/10"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Download your resume</span>
                  </a>
                  <label
                    htmlFor="resume-upload"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow ring-2 ring-background cursor-pointer hover:opacity-90",
                      (isUploadingResume || isLoadingProfile) && "opacity-60 pointer-events-none"
                    )}
                    aria-label="Replace resume"
                    title="Replace resume"
                    aria-disabled={isUploadingResume || isLoadingProfile}
                  >
                    <Pencil className="h-4 w-4" />
                  </label>
                </>
              ) : (
                <>
                  <input
                    id="resume-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.currentTarget.files?.[0]
                      if (!file) return
                      await uploadResume(file)
                      e.currentTarget.value = ""
                    }}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={cn(
                      "w-fit inline-flex items-center gap-2 rounded-md border border-dashed border-white/15 bg-white/5 px-3 py-2 text-xs text-white/90 shadow-sm hover:bg-white/10 cursor-pointer",
                      (isUploadingResume || isLoadingProfile) && "opacity-60 pointer-events-none"
                    )}
                    aria-disabled={isUploadingResume || isLoadingProfile}
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{isUploadingResume ? "Uploading Resume..." : "Upload your Resume"}</span>
                  </label>
                </>
              )}
            </div>
          </div>

          <form className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" placeholder="Aspiring Frontend Developer" disabled={isLoadingProfile || isSavingProfile} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue=""
                disabled={isLoadingProfile || isSavingProfile}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Experience</Label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    title="Add experience"
                    onClick={() => addExperience()}
                    disabled={isLoadingProfile || isSavingProfile}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {experiences.map((exp, idx) => (
                  <div key={idx} className="grid gap-3 rounded-md border border-white/10 bg-black/10 p-3">
                    <div className="flex items-center justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 rounded-full text-red-500 hover:text-red-500/90"
                        title="Remove experience"
                        onClick={() => removeExperience(idx)}
                        aria-label={`Remove experience ${idx + 1}`}
                        disabled={isLoadingProfile || isSavingProfile}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor={`exp-title-${idx}`}>Title / Role</Label>
                      <Input
                        id={`exp-title-${idx}`}
                        placeholder="e.g. Frontend Intern"
                        value={exp.title ?? ""}
                        onChange={(e) => updateExperience(idx, { title: e.target.value })}
                        disabled={isLoadingProfile || isSavingProfile}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor={`exp-company-${idx}`}>Company</Label>
                      <Input
                        id={`exp-company-${idx}`}
                        placeholder="e.g. Acme Inc."
                        value={exp.company ?? ""}
                        onChange={(e) => updateExperience(idx, { company: e.target.value })}
                        disabled={isLoadingProfile || isSavingProfile}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Education</Label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    title="Add education"
                    onClick={() => addEducation()}
                    disabled={isLoadingProfile || isSavingProfile}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {educations.map((edu, idx) => (
                  <div key={idx} className="grid gap-3 rounded-md border border-white/10 bg-black/10 p-3">
                    <div className="flex items-center justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 rounded-full text-red-500 hover:text-red-500/90"
                        title="Remove education"
                        onClick={() => removeEducation(idx)}
                        aria-label={`Remove education ${idx + 1}`}
                        disabled={isLoadingProfile || isSavingProfile}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor={`edu-degree-${idx}`}>Degree</Label>
                      <Input
                        id={`edu-degree-${idx}`}
                        placeholder="e.g. BSc Computer Science"
                        value={edu.degree ?? ""}
                        onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                        disabled={isLoadingProfile || isSavingProfile}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor={`edu-university-${idx}`}>University</Label>
                      <Input
                        id={`edu-university-${idx}`}
                        placeholder="e.g. State University"
                        value={edu.university ?? ""}
                        onChange={(e) => updateEducation(idx, { university: e.target.value })}
                        disabled={isLoadingProfile || isSavingProfile}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              className="cursor-pointer w-full"
              onClick={() => saveProfile()}
              disabled={isLoadingProfile || isSavingProfile}
            >
              {isSavingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
