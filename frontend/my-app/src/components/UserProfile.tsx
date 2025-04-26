import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Edit2, Mail, Phone, MapPin, Briefcase } from "lucide-react"

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const userDetails = {
    name: "Simran Sota",
    email: "simran.sota@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    status: "Career Break",
    experience: "5+ years in Product Management",
    about: "Experienced Product Manager transitioning into UX Design. Passionate about creating user-centric solutions and bridging the gap between business needs and user experience."
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Your professional profile information
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-medium">
                  {userDetails.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{userDetails.name}</h3>
              <p className="text-sm text-muted-foreground">{userDetails.status}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{userDetails.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{userDetails.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{userDetails.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{userDetails.experience}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-sm text-muted-foreground">{userDetails.about}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 