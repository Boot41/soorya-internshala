import { cn } from "@/utils/cn"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Textarea } from "@/ui/textarea"
import * as React from "react"
import { useCreateCompany } from "@/hooks/use-create-company"

export function CreateCompanyForm({ className, ...props }: React.ComponentProps<"div">) {
  const { register, handleSubmit, errors, isSubmitting } = useCreateCompany()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-md bg-black/15 border-white/10 shadow-xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-xl">Manage your Company</CardTitle>
          <CardDescription>Keep your company profile up to date</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="grid gap-3">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Acme Inc."
                disabled={isSubmitting}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message as string}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="company-description">Description</Label>
              <Textarea
                id="company-description"
                placeholder="Tell us about your company"
                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message as string}</p>
              )}
            </div>

            {/* Grid fields */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Website URL */}
              <div className="grid gap-3">
                <Label htmlFor="company-website">Website URL</Label>
                <Input
                  id="company-website"
                  placeholder="https://www.acme.com"
                  disabled={isSubmitting}
                  {...register("website_url")}
                />
                {errors.website_url && (
                  <p className="text-xs text-red-500">{errors.website_url.message as string}</p>
                )}
              </div>

              {/* Industry */}
              <div className="grid gap-3">
                <Label htmlFor="company-industry">Industry</Label>
                <Input
                  id="company-industry"
                  placeholder="e.g. Software, Fintech"
                  disabled={isSubmitting}
                  {...register("industry")}
                />
                {errors.industry && (
                  <p className="text-xs text-red-500">{errors.industry.message as string}</p>
                )}
              </div>
            </div>

            {/* Headquarters */}
            <div className="grid gap-3">
              <Label htmlFor="company-headquarters">Headquarters</Label>
              <Input
                id="company-headquarters"
                placeholder="e.g. San Francisco, CA"
                disabled={isSubmitting}
                {...register("headquarters")}
              />
              {errors.headquarters && (
                <p className="text-xs text-red-500">{errors.headquarters.message as string}</p>
              )}
            </div>

            {/* Logo URL (optional manual entry) */}
            <div className="grid gap-3">
              <Label htmlFor="company-logo-url">Logo URL</Label>
              <Input
                id="company-logo-url"
                placeholder="https://cdn.example.com/logo.png"
                disabled={isSubmitting}
                {...register("logo_url")}
              />
              {errors.logo_url && (
                <p className="text-xs text-red-500">{errors.logo_url.message as string}</p>
              )}
            </div>

            <Button
              type="submit"
              className="cursor-pointer w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Company"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
