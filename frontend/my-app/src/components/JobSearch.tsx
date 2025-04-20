import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Message } from "@/types"
import { JobCards } from "./JobCards"

// API base URL
const API_BASE_URL = "http://localhost:8086"

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
    if (!role) {
      alert("Please enter a job role")
      return
    }

    setIsLoading(true)
    setError(null)
    setJobs([]) // Clear previous results

    const searchMessage: Message = {
      id: `user-${Date.now()}`,
      content: `Searching for ${role} jobs${location ? ` in ${location}` : ""}${experience ? ` with ${experience} experience` : ""}${skills ? ` requiring ${skills}` : ""}`,
      role: "user",
      timestamp: new Date(),
    }
    onSearch(searchMessage)

    try {
      // Format skills as array
      const skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean)
      
      // Format titles as array - ensure it's not empty
      const titlesArray = role.split(",").map(t => t.trim()).filter(Boolean)
      if (titlesArray.length === 0) {
        titlesArray.push(role.trim())
      }

      const requestBody = {
        skills: skillsArray,
        titles: titlesArray,
        location: location || "IN",
        remote: true,
        days: 14
      }

      console.log("Making API request to:", `${API_BASE_URL}/jobs/search`)
      console.log("Request body:", requestBody)

      const response = await fetch(`${API_BASE_URL}/jobs/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${data.message || response.statusText}`)
      }
      
      if (data.success && Array.isArray(data.data)) {
        // Transform job data to match JobCards interface
        const formattedJobs = data.data.map((job: any) => ({
          id: job.id.toString(),
          title: job.job_title,
          company: job.company,
          location: job.remote ? "Remote" : job.location,
          salary: job.salary_string || "Salary not specified",
          description: job.description,
          posted: new Date(job.date_posted).toLocaleDateString(),
          logo: job.company_object?.logo || "",
          url: job.url || job.source_url || null
        }))
        
        console.log("Formatted jobs:", formattedJobs)
        setJobs(formattedJobs)

        const resultsMessage: Message = {
          id: `assistant-${Date.now()}`,
          content: `Found ${formattedJobs.length} matching jobs`,
          role: "assistant",
          timestamp: new Date(),
        }
        onSearch(resultsMessage)
      } else {
        console.error("Invalid response format:", data)
        throw new Error(data.message || "No jobs found or invalid response format")
      }
    } catch (err) {
      console.error("Search error:", err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred while searching for jobs"
      setError(errorMessage)
      const errorMsg: Message = {
        id: `assistant-${Date.now()}`,
        content: `Error: ${errorMessage}`,
        role: "assistant",
        timestamp: new Date(),
      }
      onSearch(errorMsg)
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