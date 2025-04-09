import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Message } from "@/types"

interface CareerRoadmapProps {
  onGenerateRoadmap: (message: Message) => void
}

export function CareerRoadmap({ onGenerateRoadmap }: CareerRoadmapProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null)
  const [currentRole, setCurrentRole] = useState("")
  const [targetRole, setTargetRole] = useState("")

  const handleGenerateRoadmap = () => {
    if (!currentRole || !targetRole) {
      alert("Please fill in both current and target roles")
      return
    }

    const timelineText = selectedTimeline === "6" ? "6 months" : 
                        selectedTimeline === "12" ? "12 months" : "24 months"

    const roadmapMessage: Message = {
      id: `assistant-${Date.now()}`,
      content: (
        <div className="space-y-4">
          <p>Here's your personalized roadmap to become a {targetRole} in {timelineText}:</p>
          <Card className="p-4">
            <div className="space-y-6">
              {selectedTimeline === "6" && (
                <>
                  {/* Month 1-2 */}
                  <div>
                    <h3 className="font-medium mb-2">Months 1-2: Foundation Building</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Complete advanced product management certification</li>
                      <li>Master data analytics tools (SQL, Tableau)</li>
                      <li>Build a portfolio of 2-3 case studies</li>
                      <li>Network with 5 senior PMs in your target industry</li>
                    </ul>
                  </div>

                  {/* Month 3-4 */}
                  <div>
                    <h3 className="font-medium mb-2">Months 3-4: Skill Enhancement</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Lead a cross-functional project</li>
                      <li>Develop expertise in agile methodologies</li>
                      <li>Create a product strategy document</li>
                      <li>Attend 2 industry conferences</li>
                    </ul>
                  </div>

                  {/* Month 5-6 */}
                  <div>
                    <h3 className="font-medium mb-2">Months 5-6: Leadership & Application</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Mentor a junior PM</li>
                      <li>Publish 2 thought leadership articles</li>
                      <li>Update resume and LinkedIn profile</li>
                      <li>Start applying for senior roles</li>
                    </ul>
                  </div>
                </>
              )}

              {selectedTimeline === "12" && (
                <>
                  {/* Quarter 1 */}
                  <div>
                    <h3 className="font-medium mb-2">Quarter 1: Foundation Building</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Complete product management certification</li>
                      <li>Learn basic data analytics</li>
                      <li>Build first case study</li>
                      <li>Start networking with PMs</li>
                    </ul>
                  </div>

                  {/* Quarter 2 */}
                  <div>
                    <h3 className="font-medium mb-2">Quarter 2: Skill Development</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Work on cross-functional projects</li>
                      <li>Learn agile methodologies</li>
                      <li>Create product documentation</li>
                      <li>Attend industry events</li>
                    </ul>
                  </div>

                  {/* Quarter 3 */}
                  <div>
                    <h3 className="font-medium mb-2">Quarter 3: Advanced Skills</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Lead a small team</li>
                      <li>Develop strategic thinking</li>
                      <li>Create product strategy</li>
                      <li>Build professional network</li>
                    </ul>
                  </div>

                  {/* Quarter 4 */}
                  <div>
                    <h3 className="font-medium mb-2">Quarter 4: Leadership & Application</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Mentor junior team members</li>
                      <li>Publish thought leadership</li>
                      <li>Update professional profiles</li>
                      <li>Start job applications</li>
                    </ul>
                  </div>
                </>
              )}

              {selectedTimeline === "24" && (
                <>
                  {/* Year 1 */}
                  <div>
                    <h3 className="font-medium mb-2">Year 1: Foundation & Growth</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Complete comprehensive PM training</li>
                      <li>Build strong technical foundation</li>
                      <li>Develop core PM skills</li>
                      <li>Create portfolio of work</li>
                      <li>Establish professional network</li>
                    </ul>
                  </div>

                  {/* Year 2 */}
                  <div>
                    <h3 className="font-medium mb-2">Year 2: Leadership & Mastery</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Lead complex projects</li>
                      <li>Develop strategic vision</li>
                      <li>Build leadership skills</li>
                      <li>Create industry presence</li>
                      <li>Prepare for senior role transition</li>
                    </ul>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">Save Roadmap</Button>
                <Button size="sm">Share with Mentor</Button>
              </div>
            </div>
          </Card>
        </div>
      ),
      role: "assistant",
      timestamp: new Date(),
    }
    onGenerateRoadmap(roadmapMessage)
  }

  return (
    <div className="space-y-4">
      <p>Let's create your personalized career roadmap! First, tell me:</p>
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your current role</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder="e.g., Junior Product Manager"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target role</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder="e.g., Senior Product Manager"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Timeline</label>
            <div className="flex gap-2">
              <Button 
                variant={selectedTimeline === "6" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeline("6")}
              >
                6 months
              </Button>
              <Button 
                variant={selectedTimeline === "12" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeline("12")}
              >
                1 year
              </Button>
              <Button 
                variant={selectedTimeline === "24" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeline("24")}
              >
                2 years
              </Button>
            </div>
          </div>
          {selectedTimeline && (
            <div className="pt-4">
              <Button 
                className="w-full"
                onClick={handleGenerateRoadmap}
              >
                Generate Roadmap
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
} 