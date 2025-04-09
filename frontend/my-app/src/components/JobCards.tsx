import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type JobCard = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  description: string
  posted: string
  logo: string
}

interface JobCardsProps {
  jobs: JobCard[]
}

export function JobCards({ jobs }: JobCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <Card key={job.id} className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <img src={job.logo} alt={job.company} className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{job.location}</Badge>
                <Badge variant="outline">{job.salary}</Badge>
              </div>
              <p className="text-sm mt-2 line-clamp-2">{job.description}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-muted-foreground">Posted {job.posted}</p>
                <Button size="sm">Apply</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 