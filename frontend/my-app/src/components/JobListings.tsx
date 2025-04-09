import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type JobListing = {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  timeAgo: string
  diversityProgram: string
  color: string
}

interface JobListingsProps {
  jobs: JobListing[]
}

export function JobListings({ jobs }: JobListingsProps) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-semibold text-base">{job.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: job.color }}
                >
                  {job.company.charAt(0)}
                </div>
                <span className="text-sm">{job.company}</span>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="font-normal">
                {job.location}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">{job.timeAgo}</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm">• {job.diversityProgram}</p>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm">
              Save
            </Button>
            <Button size="sm">Apply</Button>
          </div>
        </Card>
      ))}
    </div>
  )
} 