import { useState, useRef } from "react"
import { Send, Paperclip, Mic, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void
  onLanguageChange: (language: string) => void
  currentLanguage: string
}

const LANGUAGES = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Spanish" },
  { code: "FR", name: "French" },
  { code: "DE", name: "German" },
  { code: "HI", name: "Hindi" },
]

export function ChatInput({ onSendMessage, onLanguageChange, currentLanguage }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = () => {
    if (inputValue.trim() || uploadedFile) {
      onSendMessage(inputValue, uploadedFile || undefined)
      setInputValue("")
      setUploadedFile(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
  }

  return (
    <div className="space-y-2">
      {uploadedFile && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          <Paperclip className="h-4 w-4" />
          <span className="text-sm truncate flex-1">{uploadedFile.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={handleRemoveFile}
          >
            Remove
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleFileClick}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1"
        />

        <DropdownMenu open={showLanguageDropdown} onOpenChange={setShowLanguageDropdown}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code)
                  setShowLanguageDropdown(false)
                }}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleSendMessage} disabled={!inputValue.trim() && !uploadedFile}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 