import { Button } from "@/components/ui/button"

type SmartChip = {
  id: string
  label: string
  icon: string
  color: string
  action: string
  message: string
}

interface SmartSuggestionChipsProps {
  onChipClick: (action: string, message: string) => void
}

const SMART_CHIPS: SmartChip[] = [
  {
    id: "job_search",
    label: "Find Jobs",
    icon: "🔍",
    color: "#FFE4EC",
    action: "job_search",
    message: "I'd like to search for jobs based on my preferences."
  },
  {
    id: "email",
    label: "Write cold email",
    icon: "📩",
    color: "#D2B6E2",
    action: "cold_email",
    message: "I'd like help writing a cold email to potential employers."
  },
  {
    id: "mentor",
    label: "Mentorship match",
    icon: "👩‍💼",
    color: "#FFE4EC",
    action: "mentor_match",
    message: "I'm looking for a mentor in my field."
  },
  {
    id: "resume",
    label: "Resume feedback",
    icon: "🧑‍💻",
    color: "#DCF1F9",
    action: "resume_feedback",
    message: "I need feedback on my resume to improve it."
  },
  {
    id: "roadmap",
    label: "Career roadmap",
    icon: "📈",
    color: "#D2B6E2",
    action: "career_roadmap",
    message: "I want to create a career development roadmap."
  },
  {
    id: "stories",
    label: "Success stories",
    icon: "❤️‍🔥",
    color: "#FFE4EC",
    action: "success_stories",
    message: "I'd like to read some career success stories for inspiration."
  }
]

export function SmartSuggestionChips({ onChipClick }: SmartSuggestionChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {SMART_CHIPS.map((chip) => (
        <Button
          key={chip.id}
          variant="outline"
          className="whitespace-nowrap flex items-center gap-1"
          size="sm"
          onClick={() => onChipClick(chip.action, chip.message)}
          style={{ backgroundColor: chip.color }}
        >
          <span>{chip.icon}</span>
          {chip.label}
        </Button>
      ))}
    </div>
  )
} 