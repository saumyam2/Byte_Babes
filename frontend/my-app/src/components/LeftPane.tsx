"use client"
import { useState, useEffect } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from "@/types"
import { MessageSquare, Upload, Target, AlertCircle, Check, X } from "lucide-react"
import { UserProfile } from "./UserProfile"
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid'; // You may need to install this package

interface ChatSessionPreview {
  sessionId: string;
  preview: string;
  timestamp: Date;
}

interface LeftPaneProps {
  messages: Message[];
  sessions: ChatSessionPreview[];
  selectedSessionId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function LeftPane({ messages, sessions, selectedSessionId, onSelectChat, onNewChat }: LeftPaneProps) {
  const [loading, setLoading] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "Simran Sota",
    status: "Career Break",
    resumeName: "Simran_Sota_Resume.pdf",
    resumeUpdated: "2 days ago",
    goal: "Become a UX Designer in 6 months"
  })

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

  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState("Transition into UX Design role within the next 6 months by completing certification and building a portfolio of 3-5 projects.");
  const [tempGoal, setTempGoal] = useState(goal);

  const handleEdit = () => {
    setTempGoal(goal);
    setIsEditing(true);
  };

  const handleSave = () => {
    setGoal(tempGoal);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  
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

      {/* Session Status */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-sm">Session Active - Ask anything!</p>
        </div>
        <Button className="w-full mt-2" size="sm" onClick={onNewChat}>
          Start New Chat
        </Button>
      </Card>

      {/* Goal Banner */}
      <Card className="p-4 mb-4 bg-primary/5">
      <div className="flex items-center gap-2 mb-2">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="font-medium">Your Goal</h3>
      </div>
      
      {isEditing ? (
        <>
          <Textarea 
            value={tempGoal}
            onChange={(e) => setTempGoal(e.target.value)}
            className="min-h-24 text-sm mb-2"
            placeholder="Enter your career goal..."
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCancel}
              className="flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-1"
            >
              <Check className="h-3 w-3" /> Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm">{goal}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2"
            onClick={handleEdit}
          >
            Edit Goal
          </Button>
        </>
      )}
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
                  className={`p-3 cursor-pointer hover:bg-muted/50${session.sessionId === selectedSessionId ? ' border-2 border-primary' : ''}`}
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