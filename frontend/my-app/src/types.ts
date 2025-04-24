

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

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  description: string
  posted: string
  logo: string
  url: string
}

// types.ts - Add or update these types in your types file

export interface Message {
  id: string;
  content: string | React.ReactNode;
  role: "user" | "assistant";
  timestamp: Date;
  isTyping?: boolean
  feedbackId?: string
}

export interface ChatSession {
  sessionId: string;
  userId?: string;
  conversation: Message[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  name: string;
  status: string;
  resumeName?: string;
  resumeUpdated?: string;
  goal?: string;
  avatar?: string;
}