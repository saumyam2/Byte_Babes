import { Button } from "@/components/ui/button"

type SuggestionChip = {
  id: string
  label: string
  icon: string
  color: string
}

interface SuggestionChipsProps {
  chips: SuggestionChip[]
  onChipClick: (chip: SuggestionChip) => void
}

export function SuggestionChips({ chips, onChipClick }: SuggestionChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {chips.map((chip) => (
        <Button
          key={chip.id}
          variant="outline"
          className="whitespace-nowrap"
          size="sm"
          onClick={() => onChipClick(chip)}
          style={{ backgroundColor: chip.color }}
        >
          <span className="mr-1">{chip.icon}</span>
          {chip.label}
        </Button>
      ))}
    </div>
  )
} 