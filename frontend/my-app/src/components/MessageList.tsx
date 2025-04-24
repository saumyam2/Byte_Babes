import { useRef, useEffect } from "react"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { MessageFeedback } from "./MessageFeedback"
import { Message } from "@/types"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Find the last user message for feedback context
  const getLastUserMessage = (upToIndex: number): string => {
    for (let i = upToIndex - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        return messages[i].content?.toString() || "";
      }
    }
    return "";
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <Avatar className="h-8 w-8">
              <div className="h-full w-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                A
              </div>
            </Avatar>
          )}
          <div className="flex flex-col">
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.isTyping ? (
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                </div>
              ) : (
                message.content
              )}
            </div>
            {message.role === "assistant" && !message.isTyping && (
              <MessageFeedback 
                messageId={message.id} 
                userMessage={getLastUserMessage(index)}
              />
            )}
          </div>
          {message.role === "user" && (
            <Avatar className="h-8 w-8">
              <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                U
              </div>
            </Avatar>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
} 