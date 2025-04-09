import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Message } from "@/types"

interface JobSearchProps {
  onSearch: (message: Message) => void
}

export function JobSearch({ onSearch }: JobSearchProps) {
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")
  const [experience, setExperience] = useState("")
  const [skills, setSkills] = useState("")

  const handleSearch = () => {
    if (!role) {
      alert("Please enter a job role")
      return
    }

    const searchMessage: Message = {
      id: `user-${Date.now()}`,
      content: `Searching for ${role} jobs${location ? ` in ${location}` : ""}${experience ? ` with ${experience} experience` : ""}${skills ? ` requiring ${skills}` : ""}`,
      role: "user",
      timestamp: new Date(),
    }
    onSearch(searchMessage)

    // Simulate job search results
    setTimeout(() => {
      const resultsMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: (
          <div className="space-y-4">
            <p>Here are some relevant job opportunities and what you need in your resume:</p>
            <Card className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Job Opportunities</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Senior {role}</span> at TechCorp
                      <p className="text-sm text-gray-600">Location: {location || "Remote"}</p>
                      <p className="text-sm text-gray-600">Experience: {experience || "5+ years"}</p>
                    </li>
                    <li>
                      <span className="font-medium">{role} Lead</span> at InnovateX
                      <p className="text-sm text-gray-600">Location: {location || "Hybrid"}</p>
                      <p className="text-sm text-gray-600">Experience: {experience || "3+ years"}</p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Resume Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Skills to Highlight:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Technical expertise in {skills || "relevant technologies"}</li>
                        <li>Project management experience</li>
                        <li>Team leadership abilities</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-medium">Experience to Include:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>{experience || "Relevant"} years of industry experience</li>
                        <li>Successful project implementations</li>
                        <li>Cross-functional team collaboration</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-medium">Achievements to Showcase:</span>
                      <ul className="list-disc pl-5 mt-1">
                        <li>Quantifiable results and metrics</li>
                        <li>Problem-solving examples</li>
                        <li>Innovation and process improvements</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Save Job List</Button>
                  <Button size="sm">Update Resume</Button>
                </div>
              </div>
            </Card>
          </div>
        ),
        role: "assistant",
        timestamp: new Date(),
      }
      onSearch(resultsMessage)
    }, 1500)
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder="e.g., Remote, San Francisco"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience Level</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder="e.g., 5 years, Entry Level"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Key Skills</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder="e.g., React, Python, Project Management"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <Button 
            className="w-full"
            onClick={handleSearch}
          >
            Search Jobs
          </Button>
        </div>
      </Card>
    </div>
  )
} 