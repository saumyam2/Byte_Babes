"use client"

import { useState } from "react"
import { MessageList } from "@/components/MessageList"
import { SuggestionChips } from "@/components/SuggestionChips"
import { JobListings } from "@/components/JobListings"
import { JobCards } from "@/components/JobCards"
import { MentorProfiles } from "@/components/MentorProfiles"
import { ChatInput } from "@/components/ChatInput"
import { SmartSuggestionChips } from "@/components/SmartSuggestionChips"
import { LeftPane } from "@/components/LeftPane"
import { CareerRoadmap } from "@/components/CareerRoadmap"
import { SuccessStories } from "@/components/SuccessStories"
import { ResumeFeedback } from "@/components/ResumeFeedback"
import { ColdEmailTemplate } from "@/components/ColdEmailTemplate"
import { useMediaQuery } from "../../../hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Message } from "@/types"
import { JobSearch } from "@/components/JobSearch"

// Types
type SuggestionChip = {
  id: string
  label: string
  icon: string
  color: string
}

type JobListing = {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  timeAgo: string
  diversityProgram: string
  color: string
}

type JobCard = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  description: string
  posted: string
  logo: string
}

type MentorProfile = {
  id: string
  name: string
  role: string
  company: string
  expertise: string[]
  availability: string
  avatar: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm Asha, your career companion. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])

  const [isTyping, setIsTyping] = useState(false)
  const [language, setLanguage] = useState("EN")
  const [activeSidebar, setActiveSidebar] = useState<"jobs" | "mentors" | null>(null)
  const [showLeftPane, setShowLeftPane] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const suggestionChips: SuggestionChip[] = [
    { id: "job_search", label: "Search Jobs", icon: "🔍", color: "#D2B6E2" },
    { id: "resume", label: "Build Resume", icon: "📄", color: "#FFE4EC" },
    { id: "jobs", label: "Find Jobs", icon: "🚀", color: "#DCF1F9" },
    { id: "mentor", label: "Find Mentor", icon: "🤝", color: "#D2B6E2" },
    { id: "interview", label: "Mock Interview", icon: "🎤", color: "#FFE4EC" },
    { id: "skills", label: "Skill Gap Analysis", icon: "📊", color: "#DCF1F9" },
  ]

  const jobListings: JobListing[] = [
    {
      id: "job1",
      title: "Senior Product Manager",
      company: "FinBank",
      companyLogo: "#6366F1",
      location: "Remote",
      timeAgo: "3 days ago",
      diversityProgram: "Returnship program for women restarting careers",
      color: "#6366F1",
    },
    {
      id: "job2",
      title: "Product Manager, Payment Solutions",
      company: "Innovate Finance",
      companyLogo: "#06B6D4",
      location: "Remote",
      timeAgo: "1 week ago",
      diversityProgram: "Promote gender diversity in the workplace",
      color: "#06B6D4",
    },
  ]

  const jobCards: JobCard[] = [
    {
      id: "1",
      title: "UX Designer",
      company: "Acme Inc",
      location: "Remote",
      salary: "$90,000 - $120,000",
      description: "We're looking for a talented UX Designer to join our product team...",
      posted: "2 days ago",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      title: "Product Manager",
      company: "TechCorp",
      location: "San Francisco, CA",
      salary: "$110,000 - $140,000",
      description: "Join our team as a Product Manager to lead exciting initiatives...",
      posted: "1 week ago",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  const mentorProfiles: MentorProfile[] = [
    {
      id: "1",
      name: "Maya Johnson",
      role: "Senior Product Designer",
      company: "Google",
      expertise: ["UX Research", "Design Systems", "Mentorship"],
      availability: "2 slots available this week",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Raj Patel",
      role: "Engineering Manager",
      company: "Microsoft",
      expertise: ["Career Growth", "Technical Leadership", "Interview Prep"],
      availability: "Available next Tuesday",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  const handleSendMessage = (message: string, file?: File) => {
    if (!message.trim() && !file) return

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])

    // Show typing indicator
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false)

      let botResponse: Message

      if (message.toLowerCase().includes("remote") && message.toLowerCase().includes("product manager")) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: (
            <div className="space-y-4">
              <p>Here are remote product manager roles in fintech with diversity hiring programs:</p>
              <JobListings jobs={jobListings} />
              <p>What else can I do for you?</p>
              <SuggestionChips chips={suggestionChips} onChipClick={() => {}} />
            </div>
          ),
          role: "assistant",
          timestamp: new Date(),
        }
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "I'm here to help you with your career journey. What would you like to do?",
          role: "assistant",
          timestamp: new Date(),
        }
      }

      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleSmartChipClick = (action: string, message: string) => {
    const timestamp = Date.now()
    
    // Add user message
    const userMessage: Message = {
      id: `user-${timestamp}`,
      content: message,
      role: "user",
      timestamp: new Date(timestamp),
    }
    setMessages((prev) => [...prev, userMessage])

    let response: Message

    switch (action) {
      case "job_search":
        response = {
          id: `assistant-${timestamp}`,
          content: <JobSearch onSearch={(message) => setMessages((prev) => [...prev, message])} />,
          role: "assistant",
          timestamp: new Date(timestamp + 1),
        }
        break

      case "cold_email":
        response = {
          id: `assistant-${timestamp}`,
          content: <ColdEmailTemplate />,
          role: "assistant",
          timestamp: new Date(timestamp + 1),
        }
        break

      case "mentor_match":
        response = {
          id: `assistant-${timestamp}`,
          content: (
            <div className="space-y-4">
              <p>Let's find you the perfect mentor! Here are some top mentors in your field:</p>
              <MentorProfiles mentors={mentorProfiles} />
              <p>Would you like to:</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Filter by expertise</Button>
                <Button variant="outline" size="sm">Schedule a call</Button>
              </div>
            </div>
          ),
          role: "assistant",
          timestamp: new Date(timestamp + 1),
        }
        break

      case "resume_feedback":
        response = {
          id: `assistant-${timestamp}`,
          content: <ResumeFeedback onUploadResume={(message) => setMessages((prev) => [...prev, message])} />,
          role: "assistant",
          timestamp: new Date(timestamp + 1),
        }
        break

      case "career_roadmap":
        response = {
          id: `assistant-${timestamp}`,
          content: <CareerRoadmap onGenerateRoadmap={(message) => setMessages((prev) => [...prev, message])} />,
          role: "assistant",
          timestamp: new Date(timestamp + 1),
        }
        break

      case "success_stories":
        response = {
          id: `assistant-${timestamp}`,
          content: <SuccessStories />,
          role: "assistant",
          timestamp: new Date(timestamp + 1),
        }
        break

      default:
        response = {
          id: `assistant-${timestamp}`,
          content: "I'm here to help you with that! What specific assistance do you need?",
          role: "assistant",
          timestamp: new Date(timestamp + 1),
        }
    }

    setMessages((prev) => [...prev, response])
  }

  const handleSelectChat = (chatId: string) => {
    // In a real app, this would load the selected chat
    console.log("Selected chat:", chatId)
  }

  const handleNewChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hi there! I'm Asha, your career companion. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {showLeftPane && (
        <div className="w-80 border-r h-screen fixed left-0 top-0">
          <LeftPane messages={messages} onSelectChat={handleSelectChat} />
        </div>
      )}
      <div className={`flex-1 flex flex-col ${showLeftPane ? 'ml-80' : ''}`}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} />
          </div>
          <div className="border-t p-4 space-y-4">
            <SmartSuggestionChips onChipClick={handleSmartChipClick} />
            <ChatInput
              onSendMessage={handleSendMessage}
              onLanguageChange={setLanguage}
              currentLanguage={language}
            />
          </div>
        </div>
        {!isMobile && activeSidebar && (
          <div className="w-80 border-l p-4 overflow-y-auto">
            {activeSidebar === "jobs" && <JobCards jobs={jobCards} />}
            {activeSidebar === "mentors" && <MentorProfiles mentors={mentorProfiles} />}
          </div>
        )}
      </div>
    </div>
  )
}
// "use client"

// import { Gravity, MatterBody } from "../components/Gravity"

// export default function Home() {
//   return (
//     <div className="w-full h-full min-h-[500px] flex flex-col relative font-azeretMono">
//       <div className="pt-20 text-6xl sm:text-7xl md:text-8xl text-black w-full text-center font-calendas italic">
//         fancy
//       </div>
//       <p className="pt-4 text-base sm:text-xl md:text-2xl text-black w-full text-center">
//         components made with:
//       </p>
//       <Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
//         <MatterBody
//           matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
//           x="30%"
//           y="10%"
//         >
//           <div className="text-xl sm:text-2xl md:text-3xl bg-[#0015ff] text-white rounded-full hover:cursor-pointer px-8 py-4">
//             react
//           </div>
//         </MatterBody>
//         <MatterBody
//           matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
//           x="30%"
//           y="30%"
//         >
//           <div className="text-xl sm:text-2xl md:text-3xl bg-[#E794DA] text-white rounded-full hover:cursor-grab px-8 py-4 ">
//             typescript
//           </div>
//         </MatterBody>
//         <MatterBody
//           matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
//           x="40%"
//           y="20%"
//           angle={10}
//         >
//           <div className="text-xl sm:text-2xl md:text-3xl bg-[#1f464d]  text-white rounded-full hover:cursor-grab px-8 py-4 ">
//             motion
//           </div>
//         </MatterBody>
//         <MatterBody
//           matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
//           x="75%"
//           y="10%"
//         >
//           <div className="text-xl sm:text-2xl md:text-3xl bg-[#ff5941]  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 ">
//             tailwind
//           </div>
//         </MatterBody>
//         <MatterBody
//           matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
//           x="80%"
//           y="20%"
//         >
//           <div className="text-xl sm:text-2xl md:text-3xl bg-orange-500  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 ">
//             drei
//           </div>
//         </MatterBody>
//         <MatterBody
//           matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
//           x="50%"
//           y="10%"
//         >
//           <div className="text-xl sm:text-2xl md:text-3xl bg-[#ffd726]  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 ">
//             matter-js
//           </div>
//         </MatterBody>
//       </Gravity>
//     </div>
//   )
// }

