import { createFileRoute } from '@tanstack/react-router'
import GlobalHeader from '@/components/global-header'
import GradientLayout from '@/layouts/gradient-layout'
import GlassLayout from '@/layouts/glass-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Row } from '@/ui/row'
import { Button } from '@/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { useRestriction } from '@/hooks/use-restriction'
import { useRecruiterCompany } from '@/hooks/use-recruiter-company'

export const Route = createFileRoute('/company/')({
  component: RouteComponent,
})

function RouteComponent() {
  useRestriction('recruiter')
  const {
    meLoading,
    meIsError,
    meError,
    recruiterCompanyId,
    company,
    companyLoading,
    companyIsError,
    companyError,
    companies,
    companiesLoading,
    companiesIsError,
    companiesError,
    selectedCompanyId,
    setSelectedCompanyId,
    handleSetCompany,
    goCreateCompany,
    isUpdating,
  } = useRecruiterCompany()

  return (
    <GradientLayout className='!pt-0 !px-0 justify-start'>
      <GlobalHeader className='w-full' />
      <GlassLayout className='flex-1 justify-center' hideBrand>
        {/* If recruiter has a company, show the company details (same UI as /company/$companyId) */}
        {recruiterCompanyId ? (
          <Card className="backdrop-blur-md bg-black/15 border-white/10 shadow-xl">
            <CardHeader className="items-center text-center gap-2">
              {/* Logo */}
              {!companyLoading && !companyIsError && (
                <div className="flex items-center justify-center pb-2">
                  <Avatar className="h-20 w-20 border border-white/20">
                    <AvatarImage className="object-cover" alt="Company logo" src={company?.logo_url ?? undefined} />
                    <AvatarFallback className="text-lg">{(company?.name?.[0] ?? 'C')}</AvatarFallback>
                  </Avatar>
                </div>
              )}
              <CardTitle className="text-xl">
                {companyLoading ? 'Loading company…' : companyIsError ? (companyError?.message ?? 'Failed to load company') : (company?.name || 'Company')}
              </CardTitle>
              {!companyLoading && !companyIsError && company?.website_url && (
                <CardDescription>
                  <a
                    href={company.website_url as unknown as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-white"
                  >
                    {company.website_url as unknown as string}
                  </a>
                </CardDescription>
              )}
            </CardHeader>
            {!companyLoading && !companyIsError && company && (
              <CardContent>
                <div className="grid gap-6">
                  <Row label="Description" value={company.description ?? undefined} />
                  <div className="grid gap-6 md:grid-cols-2">
                    <Row label="Industry" value={company.industry ?? undefined} />
                    <Row label="Headquarters" value={company.headquarters ?? undefined} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ) : (
          // Otherwise, allow recruiter to select an existing company or create a new one
          <Card className="backdrop-blur-md bg-black/15 border-white/10 shadow-xl mx-auto w-full max-w-xl">
            <CardHeader className="items-center text-center gap-1">
              <CardTitle className="text-xl">Select your Company</CardTitle>
              <CardDescription>
                {meLoading
                  ? 'Loading profile…'
                  : meIsError
                    ? (meError?.message ?? 'Failed to load profile')
                    : 'Choose an existing company or create a new one'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {companiesLoading ? (
                <div>Loading companies…</div>
              ) : companiesIsError ? (
                <div className="text-red-500">{companiesError?.message ?? 'Failed to load companies'}</div>
              ) : (
                <div className="grid gap-4">
                  <Select onValueChange={(v) => setSelectedCompanyId(v)} value={selectedCompanyId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c: import('@/types/company').Company) => (
                        <SelectItem key={(c as any).company_id ?? c.id} value={((c as any).company_id ?? c.id) as string}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-3 justify-center">
                    <Button className="px-6" onClick={handleSetCompany} disabled={!selectedCompanyId || isUpdating}>
                      {isUpdating ? 'Setting…' : 'Set Company'}
                    </Button>
                    <Button variant="secondary" className="px-6" onClick={goCreateCompany}>
                      Create new Company
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </GlassLayout>
    </GradientLayout>
  )
}
