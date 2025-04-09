import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ColdEmailTemplate() {
  return (
    <div className="space-y-4">
      <p>Let's craft a compelling cold email! Here's a template you can customize:</p>
      <Card className="p-4">
        <p className="font-medium mb-2">Dear [Hiring Manager],</p>
        <p className="mb-2">
          I came across the [Position] role at [Company] and was immediately drawn to [specific aspect of the company/role].
          With my experience in [relevant skill/experience], I believe I could make a significant contribution to your team.
        </p>
        <p className="mb-2">
          In my current role at [Current Company], I [specific achievement with metrics]. I'm particularly excited about
          [specific project/initiative at target company] and would love to discuss how my skills could support this effort.
        </p>
        <p>
          Would you be available for a brief conversation next week? I'm flexible and can work around your schedule.
        </p>
        <p className="mt-2">
          Best regards,
          <br />
          [Your Name]
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">Customize</Button>
          <Button size="sm">Copy to Clipboard</Button>
        </div>
      </Card>
    </div>
  )
} 