"use client"
import { chatApi } from "@/services/ChatApi"
import axios from "axios"
import { useState } from "react"
import { MessageList } from "@/components/MessageList"
import { SuggestionChips } from "@/components/SuggestionChips"
import { JobListings } from "@/components/JobListings"
import { JobCards } from "@/components/JobCards"
import { MentorProfiles } from "@/components/MentorProfiles"
import { ChatInput } from "@/components/ChatInput"
import { SmartSuggestionChips } from "@/components/SmartSuggestionChips"
import { LeftPane } from "@/components/LeftPane"
import { CareerPathwayComponent } from "@/components/CareerRoadmap"
import { SuccessStories } from "@/components/SuccessStories"
import { SkillGapAnalysisComponent } from "@/components/SkillGapAnalysis"
import { LinkedInMessageGenerator } from "@/components/ColdEmailTemplate"
import { useMediaQuery } from "../../../hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Message } from "@/types"
import { JobSearch } from "@/components/JobSearch"
import ResumeFeedback from "@/components/ResumeFeedback"
import EventsComponent from "@/components/EventsDetail"
import { Clock, MapPin, ExternalLink, Briefcase, Box } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const router = useRouter();
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
    { id: "skill", label: "Build Resume", icon: "📄", color: "#FFE4EC" },
    { id: "jobs", label: "Find Jobs", icon: "🚀", color: "#DCF1F9" },
    { id: "mentor", label: "Find Mentor", icon: "🤝", color: "#D2B6E2" },
    { id: "interview", label: "Mock Interview", icon: "🎤", color: "#FFE4EC" },
    { id: "resume", label: "Resume feedback", icon: "📝", color: "#DCF1F9" },
    { id: "events", label: "Find Events", icon: "📅", color: "#D2B6E2" },
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

  const handleSendMessage = async (message: string, file?: File) => {
    if (!message.trim() && !file) return;
  
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);
  
    try {
      // First, classify the intent using the dedicated intent service
      let intent = 'general_chat'; // Default intent
      
      try {
        const intentResponse = await axios.post("https://jobsforher-bytebabes.onrender.com/classify-intent/", {
          message: message,
        });
        // Parse the intent properly - remove any extra quotes
        intent = JSON.parse(intentResponse.data.intent);
        console.log("Received intent from ML model:", intent);
        console.log("Intent type:", typeof intent);
        console.log("Intent exact value:", JSON.stringify(intent));
      } catch (error) {
        console.error("Intent classification failed, using keyword-based routing", error);
        // Continue with keyword-based fallback approach
      }
      
      // Handle based on intent or fallback to keyword matching
      if (intent === "events_search" || 
          message.toLowerCase().includes("event") ||
          message.toLowerCase().includes("meetup") ||
          message.toLowerCase().includes("conference")) {
        
        try {
          const response = await axios.post("https://byte-babes.onrender.com/events/getevents", {
            q: message,
          });
  
          if (response.data.success) {
            const events = response.data.data;
            const botMessage: Message = {
              id: Date.now().toString(),
              content: (
                <div className="space-y-4">
                  <p>Here are some events that might interest you:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        {event.thumbnail && (
                          <div className="relative h-48 overflow-hidden bg-gray-200">
                            <img
                              src={event.thumbnail}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">{event.title}</h3>
                          {event.date?.when && (
                            <p className="text-sm text-gray-600 mb-2">
                              <Clock className="inline-block w-4 h-4 mr-1" />
                              {event.date.when}
                            </p>
                          )}
                          {event.venue?.name && (
                            <p className="text-sm text-gray-600">
                              <MapPin className="inline-block w-4 h-4 mr-1" />
                              {event.venue.name}
                            </p>
                          )}
                          {event.link && (
                            <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
                            >
                              Learn more <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
              role: "assistant",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
          } else {
            throw new Error("Failed to fetch events");
          }
        } catch (error) {
          const errorMessage: Message = {
            id: Date.now().toString(),
            content:
              "I apologize, but I couldn't fetch the events at the moment. Please try again later.",
            role: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
      // LinkedIn/mentor search intent
      else if (intent === "mentor_search" ||
               message.toLowerCase().includes("linkedin") ||
               message.toLowerCase().includes("mentor") ||
               message.toLowerCase().includes("profile")) {
        
        try {
          const response = await axios.post("https://byte-babes.onrender.com/mentors/search", {
            keywords: message,
          });
  
          const profiles = response.data.data?.response;
  
          if (response.data.success && Array.isArray(profiles)) {
            const botMessage: Message = {
              id: Date.now().toString(),
              content: (
                <div className="space-y-4">
                  <p>Here are some LinkedIn profiles that might be relevant:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profiles.map((profile: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex p-4">
                          {profile.profilePicture && (
                            <div className="mr-4">
                              <img
                                src={profile.profilePicture}
                                alt={profile.fullName}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold mb-1">{profile.fullName}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {profile.primarySubtitle}
                            </p>
                            {profile.secondarySubtitle && (
                              <p className="text-sm text-gray-600">
                                <MapPin className="inline-block w-4 h-4 mr-1" />
                                {profile.secondarySubtitle}
                              </p>
                            )}
                            {profile.navigationUrl && (
                              <a
                                href={profile.navigationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
                              >
                                View profile <ExternalLink className="w-4 h-4 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
              role: "assistant",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
          } else {
            throw new Error("Invalid LinkedIn response");
          }
        } catch (error) {
          console.error("LinkedIn search error:", error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            content:
              "I apologize, but I couldn't fetch LinkedIn profiles at the moment. Please try again later.",
            role: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
      // Resume feedback intent
      else if (intent === "resume_feedback") {
        const resumeMessage: Message = {
          id: Date.now().toString(),
          content: <ResumeFeedback onUploadResume={(message: Message) => 
            setMessages((prev) => [...prev, message])} />,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, resumeMessage]);
      }
      // Job search intent
      else if (intent === "job_search") {
        const jobSearchMessage: Message = {
          id: Date.now().toString(),
          content: <JobSearch onSearch={(message) => 
            setMessages((prev) => [...prev, message])} />,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, jobSearchMessage]);
      }
      // Skill gap analysis intent
      else if (intent === "skill_gap_analysis") {
        const skillMessage: Message = {
          id: Date.now().toString(),
          content: <SkillGapAnalysisComponent onUploadResume={(message: Message) => 
            setMessages((prev) => [...prev, message])} />,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, skillMessage]);
      }
      // Cold email intent
      else if (intent === "cold_email") {
        const emailMessage: Message = {
          id: Date.now().toString(),
          content: <LinkedInMessageGenerator />,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, emailMessage]);
      }
      // Career roadmap intent
      else if (intent === "career_roadmap") {
        const roadmapMessage: Message = {
          id: Date.now().toString(),
          content: <CareerPathwayComponent onGeneratePathway={(message: Message) => 
            setMessages((prev) => [...prev, message])} />,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, roadmapMessage]);
      }
      // Success stories intent
      else if (intent === "success_stories") {
        const storiesMessage: Message = {
          id: Date.now().toString(),
          content: <SuccessStories />,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, storiesMessage]);
      }
      // Other messages/intents - use the general chatbot API
      else {
        console.log("No matching intent found, using general chatbot API");
        try {
          const response = await chatApi.sendMessage(message);
          const botMessage: Message = {
            id: Date.now().toString(),
            content: response.botResponse || "Sorry, I didn't quite get that!",
            role: "assistant",
            timestamp: new Date(),
            feedbackId: response.feedbackId,
          };
          setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
          const errorMessage: Message = {
            id: Date.now().toString(),
            content:
              "I'm here to help! While I'm having trouble connecting to some services, I can still assist you with finding events, analyzing resumes, and other tasks. What would you like to know?",
            role: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleSmartChipClick = (action: string, message: string) => {
    const timestamp = Date.now()
    
    // Handle chat messages directly
    if (action === "chat_message") {
      handleSendMessage(message);
      return;
    }

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
          content: <LinkedInMessageGenerator />,
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

      case "skill_gap_analysis":
        response = {
          id: `assistant-${timestamp}`,
          content: <SkillGapAnalysisComponent onUploadResume={(message: Message) => setMessages((prev) => [...prev, message])} />,
          role: "assistant",
          timestamp: new Date(timestamp + 1),
        }
        break

      case "career_roadmap":
        response = {
          id: `assistant-${timestamp}`,
          content: <CareerPathwayComponent onGeneratePathway={(message: Message) => setMessages((prev) => [...prev, message])} />,
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

      case "resume_feedback":
        response = {
          id: `assistant-${timestamp}`,
          content: <ResumeFeedback onUploadResume={(message: Message) => setMessages((prev) => [...prev, message])} />,
          role: "assistant",
          timestamp: new Date(timestamp + 1),
        }
        break
      case "find_event":
        response = {
          id: `assistant-${timestamp}`,
          content: <EventsComponent onSearch={(message) => setMessages((prev) => [...prev, message])} />,
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
          <div className="p-4 border-b flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.push('/3D-chatbot')}
            >
              <Box className="w-4 h-4" />
              Switch to 3D Chat
            </Button>
          </div>
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

