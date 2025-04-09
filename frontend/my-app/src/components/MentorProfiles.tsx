import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

type MentorProfile = {
  id: string
  name: string
  role: string
  company: string
  expertise: string[]
  availability: string
  avatar: string
}

interface MentorProfilesProps {
  mentors: MentorProfile[]
}

export function MentorProfiles({ mentors }: MentorProfilesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {mentors.map((mentor) => (
        <Card key={mentor.id} className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-16 w-16">
              <img src={mentor.avatar} alt={mentor.name} />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground">
                {mentor.role} at {mentor.company}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {mentor.expertise.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">{mentor.availability}</p>
                <Button size="sm">Connect</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 