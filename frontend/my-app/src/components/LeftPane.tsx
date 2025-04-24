"use client"
import { useState, useEffect } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from "@/types"
import { MessageSquare, Upload, Target, AlertCircle } from "lucide-react"
import { UserProfile } from "./UserProfile"

interface LeftPaneProps {
  messages: Message[]
  onSelectChat: (chatId: string) => void
  onNewChat?: () => void
}

type ChatSession = {
  sessionId: string
  preview: string
  timestamp: Date
}

export function LeftPane({ messages, onSelectChat, onNewChat }: LeftPaneProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "Simran Sota",
    status: "Career Break",
    resumeName: "Simran_Sota_Resume.pdf",
    resumeUpdated: "2 days ago",
    goal: "Become a UX Designer in 6 months"
  })

  useEffect(() => {
    // In a real implementation, this would fetch user sessions from the backend
    // For now, we'll create mock sessions based on the current chat
    if (messages.length > 0) {
      // Create a mock session from the current conversation
      const mockSessions = [{
        sessionId: "current-session",
        preview: messages.find(m => m.role === "user")?.content?.toString() || "New conversation",
        timestamp: new Date()
      }]
      
      // Add some demo sessions
      if (mockSessions.length === 1) {
        mockSessions.push(
          {
            sessionId: "session-1",
            preview: "Resume Help",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          },
          {
            sessionId: "session-2",
            preview: "Product Manager Jobs",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
          }
        )
      }
      
      setSessions(mockSessions)
    }
  }, [messages])

  // Calculate time elapsed since session creation
  const getTimeElapsed = (timestamp: Date) => {
    const now = new Date()
    const sessionTime = timestamp
    const diffMs = now.getTime() - sessionTime.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHrs < 1) return "Just now"
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`
    const diffDays = Math.floor(diffHrs / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  // Function to start a new chat session
  const startNewChat = () => {
    if (onNewChat) {
      onNewChat()
    }
  }

  return (
    <div className="w-full h-screen border-r p-4 flex flex-col">
      {/* User Profile Card */}
      <Card className="p-4 mb-4 cursor-pointer hover:bg-muted/50" onClick={() => setIsProfileOpen(true)}>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <div className="h-full w-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-medium">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </Avatar>
          <div>
            <h3 className="font-medium">{userProfile.name}</h3>
            <p className="text-sm text-muted-foreground">{userProfile.status}</p>
          </div>
        </div>
        <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </Card>

      {/* Resume Summary */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Resume Summary</h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm">{userProfile.resumeName}</p>
          <p className="text-xs text-muted-foreground">Last updated: {userProfile.resumeUpdated}</p>
          <Button className="w-full" size="sm">
            Improve Resume
          </Button>
        </div>
      </Card>

      {/* Session Status */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-sm">Session Active - Ask anything!</p>
        </div>
        <Button className="w-full mt-2" size="sm" onClick={startNewChat}>
          Start New Chat
        </Button>
      </Card>

      {/* Goal Banner */}
      <Card className="p-4 mb-4 bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Your Goal</h3>
        </div>
        <p className="text-sm">{userProfile.goal}</p>
        <Button variant="ghost" size="sm" className="mt-2">
          Edit Goal
        </Button>
      </Card>

      {/* Recent Topics */}
      <div className="flex-1">
        <h3 className="font-medium mb-2">Recent Topics</h3>
        <ScrollArea className="h-[200px]">
          {loading ? (
            <div className="flex justify-center py-4">
              <p className="text-sm text-muted-foreground">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex justify-center py-4">
              <p className="text-sm text-muted-foreground">No chat history</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <Card 
                  key={session.sessionId} 
                  className="p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectChat(session.sessionId)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-52">
                        {session.preview}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeElapsed(session.timestamp)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Feedback Section */}
      <div className="mt-auto pt-4 border-t">
        <Button variant="ghost" className="w-full" size="sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
      </div>
    </div>
  )
}