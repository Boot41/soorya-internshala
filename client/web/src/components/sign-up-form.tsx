import { cn } from "@/utils/cn"
import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Link } from "@tanstack/react-router"
import { Switch } from "@/ui/switch"
import { useSignUp } from "@/hooks/use-signup"
import { Loader2 } from "lucide-react"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register, handleSubmit, isSubmitting, errors, setUserType } = useSignUp()
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-md bg-black/15 border-white/10 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Sign up with your details</CardDescription>

        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex items-center justify-center rounded-md p-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm">Applicant</span>
                  <Switch
                  className="cursor-pointer"
                    onCheckedChange={(checked) =>
                      setUserType(checked ? "recruiter" : "applicant")
                    }
                    aria-label="Toggle to register as Recruiter"
                  />
                  <span className="text-sm">Recruiter</span>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="John"
                    disabled={isSubmitting}
                    {...register("first_name")}
                  />
                  {errors?.first_name && (
                    <span className="text-xs text-red-500">{errors.first_name.message as string}</span>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Doe"
                    disabled={isSubmitting}
                    {...register("last_name")}
                  />
                  {errors?.last_name && (
                    <span className="text-xs text-red-500">{errors.last_name.message as string}</span>
                  )}
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  disabled={isSubmitting}
                  {...register("email")}
                />
                {errors?.email && (
                  <span className="text-xs text-red-500">{errors.email.message as string}</span>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  disabled={isSubmitting}
                  {...register("password")}
                />
                {errors?.password && (
                  <span className="text-xs text-red-500">{errors.password.message as string}</span>
                )}
              </div>
              <Button type="submit" className="cursor-pointer w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  "Sign up"
                )}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/auth/login" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
