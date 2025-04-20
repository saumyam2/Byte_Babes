import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Bookmark, Building2 } from "lucide-react"

type JobListing = {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  timeAgo: string
  diversityProgram: string
  color: string
  url?: string
  salary?: string
  description?: string
}

interface JobListingsProps {
  jobs: JobListing[]
}

export function JobListings({ jobs }: JobListingsProps) {
  const handleApply = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleSave = (job: JobListing) => {
    // TODO: Implement save functionality
    console.log('Saving job:', job.title)
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                {job.companyLogo ? (
                  <img 
                    src={job.companyLogo} 
                    alt={job.company} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`
                    }}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: job.color || '#f3f4f6' }}
                  >
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg truncate">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50">
                    {job.location}
                  </Badge>
                  {job.salary && (
                    <Badge variant="outline" className="bg-green-50">
                      {job.salary}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {job.timeAgo}
                  </span>
                </div>
                {job.diversityProgram && (
                  <p className="text-sm mt-2 text-gray-600">
                    • {job.diversityProgram}
                  </p>
                )}
                {job.description && (
                  <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSave(job)}
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <Button 
                size="sm"
                onClick={() => handleApply(job.url || '#')}
                className="flex items-center gap-1 whitespace-nowrap"
                disabled={!job.url}
              >
                <ExternalLink className="w-4 h-4" />
                Apply
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 