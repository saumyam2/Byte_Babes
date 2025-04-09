import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Message } from "@/types"

interface ResumeFeedbackProps {
  onUploadResume: (message: Message) => void
}

export function ResumeFeedback({ onUploadResume }: ResumeFeedbackProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Create file upload message
      const fileMessage: Message = {
        id: `user-${Date.now()}`,
        content: `Uploaded resume: ${file.name}`,
        role: "user",
        timestamp: new Date(),
      }
      onUploadResume(fileMessage)

      // Simulate processing the resume
      setTimeout(() => {
        const feedbackMessage: Message = {
          id: `assistant-${Date.now()}`,
          content: (
            <div className="space-y-4">
              <p>Thank you for uploading your resume! Here's my feedback:</p>
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Strengths</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Clear career progression</li>
                      <li>Strong technical skills section</li>
                      <li>Good use of metrics in achievements</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium">Areas for Improvement</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Consider adding more quantifiable achievements</li>
                      <li>Include relevant keywords for ATS optimization</li>
                      <li>Expand on leadership experiences</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Download Feedback</Button>
                    <Button size="sm">Apply Suggestions</Button>
                  </div>
                </div>
              </Card>
            </div>
          ),
          role: "assistant",
          timestamp: new Date(),
        }
        onUploadResume(feedbackMessage)
      }, 2000)
    }
  }

  return (
    <div className="space-y-4">
      <p>Upload your resume for personalized feedback on:</p>
      <Card className="p-4">
        <ul className="list-disc pl-5 space-y-2">
          <li>ATS optimization</li>
          <li>Impactful achievement statements</li>
          <li>Skills alignment with target roles</li>
          <li>Formatting and presentation</li>
        </ul>
        <div className="mt-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="resume-upload"
          />
          <Button
            className="w-full"
            onClick={() => document.getElementById('resume-upload')?.click()}
          >
            Upload Resume
          </Button>
        </div>
      </Card>
    </div>
  )
} 