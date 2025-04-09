import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from "@/types"
import { MessageSquare, Upload, Target, AlertCircle } from "lucide-react"

interface LeftPaneProps {
  messages: Message[]
  onSelectChat: (chatId: string) => void
}

export function LeftPane({ messages, onSelectChat }: LeftPaneProps) {
  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const date = message.timestamp.toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(message)
    return acc
  }, {} as Record<string, Message[]>)

  return (
    <div className="w-80 border-r p-4 flex flex-col h-screen">
      {/* User Profile Card */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <div className="h-full w-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-medium">SS</span>
            </div>
          </Avatar>
          <div>
            <h3 className="font-medium">Simran Sota</h3>
            <p className="text-sm text-muted-foreground">Career Break</p>
          </div>
        </div>
      </Card>

      {/* Resume Summary */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Resume Summary</h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm">Simran_Sota_Resume.pdf</p>
          <p className="text-xs text-muted-foreground">Last updated: 2 days ago</p>
          <Button className="w-full" size="sm">
            Improve Resume
          </Button>
        </div>
      </Card>

      {/* Session Status */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-sm">Session Active - Ask anything!</p>
        </div>
      </Card>

      {/* Goal Banner */}
      <Card className="p-4 mb-4 bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Your Goal</h3>
        </div>
        <p className="text-sm">Become a UX Designer in 6 months</p>
        <Button variant="ghost" size="sm" className="mt-2">
          Edit Goal
        </Button>
      </Card>

      {/* Recent Topics */}
      <div className="flex-1">
        <h3 className="font-medium mb-2">Recent Topics</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            <Card className="p-3 cursor-pointer hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm">📄</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Resume Help</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 cursor-pointer hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm">💼</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Product Manager Jobs</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </Card>
          </div>
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