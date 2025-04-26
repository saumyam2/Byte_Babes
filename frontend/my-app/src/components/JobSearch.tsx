import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Message } from "@/types"
import { JobCards } from "./JobCards"

// API base URL
const API_BASE_URL = "https://asha-ai-hackathon-xbkm.onrender.com"

// First, add a type for the job search parameters
interface JobSearchParams {
  skills: string[];
  titles: string[];
  location: string;
  remote: boolean;
  days: number;
}

interface JobSearchProps {
  onSearch: (message: Message) => void
}

export function JobSearch({ onSearch }: JobSearchProps) {
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")
  const [experience, setExperience] = useState("")
  const [skills, setSkills] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobs, setJobs] = useState<any[]>([])

  const handleSearch = async () => {
    if (!role && !skills) {
      setError("Please enter either a job role or skills")
      return
    }

    setIsLoading(true)
    setError(null)
    setJobs([])

    try {
      // Format and clean search parameters
      const skillsArray = skills
        ? skills.split(",")
            .map(s => s.trim().toLowerCase())
            .filter(s => s.length > 2) // Ignore very short terms
        : []
      
      const titlesArray = role
        ? role.split(",")
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 2)
            .map(t => t.replace(/developer/gi, '')) // Remove common terms to broaden search
        : []

      // Use more inclusive search parameters
      const requestBody: JobSearchParams = {
        skills: skillsArray.length > 0 ? skillsArray : [],
        titles: titlesArray.length > 0 ? titlesArray : ["developer", "engineer"], // Default to common titles
        location: location?.trim() || "IN",
        remote: true,
        days: 30 // Increase search window
      }

      console.log("Search parameters:", {
        skillsCount: requestBody.skills.length,
        titlesCount: requestBody.titles.length,
        skills: requestBody.skills,
        titles: requestBody.titles,
        location: requestBody.location,
        days: requestBody.days
      })

      const response = await fetch(`${API_BASE_URL}/jobs/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      console.log("Raw API response:", data)

      if (!response.ok) {
        throw new Error(`Search failed: ${data.message || response.statusText}`)
      }

      if (data.success) {
        if (!Array.isArray(data.data)) {
          console.error("Expected data.data to be an array, got:", typeof data.data)
          throw new Error("Invalid response format from server")
        }

        if (data.data.length === 0) {
          setError("No jobs found matching your criteria. Try broadening your search.")
          return
        }

        // Transform job data
        const formattedJobs = data.data.map((job: any) => ({
          id: job.id?.toString() || String(Math.random()),
          title: job.job_title || job.title || role,
          company: job.company || "Company not specified",
          location: job.remote ? "Remote" : (job.location || "Location not specified"),
          salary: job.salary_string || 
                 (job.min_annual_salary ? `${job.min_annual_salary} - ${job.max_annual_salary} per year` : 
                 "Salary not specified"),
          description: job.description?.replace(/\*\*/g, '') || "No description available",
          posted: job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "Recently posted",
          logo: job.company_object?.logo || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'Company')}&background=random`,
          url: job.url || job.source_url || null
        }))

        console.log(`Found ${formattedJobs.length} jobs after formatting`)
        setJobs(formattedJobs)
      }
    } catch (err) {
      console.error("Search error details:", err)
      setError(
        err instanceof Error 
          ? `Search failed: ${err.message}. Try using broader terms or fewer filters.`
          : "Failed to fetch jobs. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <p>Let's find the perfect job for you! Tell me what you're looking for:</p>
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Role</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder="e.g., Product Manager, Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder="e.g., Remote, San Francisco"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience Level</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder="e.g., 5 years, Entry Level"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Key Skills (comma-separated)</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder="e.g., React, Python, Project Management"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button 
            className="w-full"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search Jobs"}
          </Button>
        </div>
      </Card>

      {error && (
        <div className="text-red-500 text-sm p-4 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {jobs.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Found {jobs.length} matching jobs</h2>
          <JobCards jobs={jobs} />
        </div>
      ) : !isLoading && !error && (
        <div className="mt-8 text-center text-gray-500">
          No jobs found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  )
}