import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Bookmark } from "lucide-react"

type JobCard = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  description: string
  posted: string
  logo: string
  url?: string
}

interface JobCardsProps {
  jobs: JobCard[]
}

export function JobCards({ jobs }: JobCardsProps) {
  const truncateDescription = (desc: string) => {
    // Remove HTML tags and markdown
    const plainText = desc.replace(/<[^>]*>|\\[^\\]*\\|\*\*|\*/g, '')
    return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText
  }

  const handleApply = (url: string) => {
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleSave = (job: JobCard) => {
    // TODO: Implement save functionality
    console.log('Saving job:', job.title)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <Card key={job.id} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {job.logo ? (
                <img 
                  src={job.logo} 
                  alt={job.company} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`
                  }}
                />
              ) : (
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`}
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-50">
                  {job.location}
                </Badge>
                {job.salary !== "Salary not specified" && (
                  <Badge variant="outline" className="bg-green-50">
                    {job.salary}
                  </Badge>
                )}
              </div>
              <p className="text-sm mt-3 text-gray-600 line-clamp-3">
                {truncateDescription(job.description)}
              </p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-muted-foreground">Posted {job.posted}</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSave(job)}
                    className="flex items-center gap-1"
                  >
                    <Bookmark className="w-4 h-4" />
                    Save
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleApply(job.url || '#')}
                    className="flex items-center gap-1"
                    disabled={!job.url}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 