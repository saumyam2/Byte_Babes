export type Message = {
  id: string
  content: string | React.ReactNode
  role: "user" | "assistant"
  timestamp: Date
}

export type SuggestionChip = {
  id: string
  label: string
  icon: string
  color: string
}

export type JobListing = {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  timeAgo: string
  diversityProgram: string
  color: string
}

export type JobCard = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  description: string
  posted: string
  logo: string
}

export type MentorProfile = {
  id: string
  name: string
  role: string
  company: string
  expertise: string[]
  availability: string
  avatar: string
} 