import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"

export default function JobListSkeleton() {
  return (
    <Card className="bg-black/20 border-white/10 animate-pulse">
      <CardHeader className="gap-2">
        <CardTitle className="h-4 w-1/3 bg-white/20 rounded" />
        <div className="flex gap-2">
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-3 w-3 bg-white/10 rounded" />
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-3 w-3 bg-white/10 rounded" />
          <div className="h-3 w-16 bg-white/10 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-4 w-full bg-white/10 rounded mb-2" />
        <div className="h-4 w-2/3 bg-white/10 rounded" />
      </CardContent>
    </Card>
  )
}
