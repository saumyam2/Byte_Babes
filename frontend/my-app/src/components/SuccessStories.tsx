import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function SuccessStories() {
  return (
    <div className="space-y-4">
      <p>Here are some inspiring success stories from people who've achieved their career goals:</p>
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">From Junior PM to Product Lead in 2 Years</h3>
            <p className="text-sm text-muted-foreground mt-1">
              "I started as a junior PM with no technical background. Through consistent learning and mentorship,
              I was able to lead a team of 5 PMs within 2 years..."
            </p>
          </div>
          <div>
            <h3 className="font-medium">Career Switch to Tech</h3>
            <p className="text-sm text-muted-foreground mt-1">
              "After 5 years in marketing, I made the switch to product management. It wasn't easy, but with the
              right guidance and persistence, I landed my dream role..."
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">Read More Stories</Button>
          <Button size="sm">Share Your Story</Button>
        </div>
      </Card>
    </div>
  )
} 