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
import { useState } from "react"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [userType, setUserType] = useState<"applicant" | "recruiter">("applicant")
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Sign up with your details</CardDescription>

        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex items-center justify-center rounded-md p-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm">Applicant</span>
                  <Switch
                  className="cursor-pointer"
                    checked={userType === "recruiter"}
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
                  <Input id="first_name" type="text" placeholder="John" required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input id="last_name" type="text" placeholder="Doe" required />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required />
              </div>

              <input type="hidden" name="user_type" value={userType} />
              <Button type="submit" className="w-full">
                Sign up
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
