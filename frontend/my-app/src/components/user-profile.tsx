"use client"

import { useState } from "react"
import { User, Briefcase, GraduationCap, Award, Settings, Bell, Shield, LogOut, Edit, Upload, X, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type UserProfileProps = {
  isOpen: boolean
  onClose: () => void
}

type Skill = {
  name: string
  level: number
}

type Experience = {
  id: string
  title: string
  company: string
  duration: string
  description: string
}

type Education = {
  id: string
  degree: string
  institution: string
  year: string
}

type Achievement = {
  id: string
  title: string
  date: string
  description?: string
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: "Simran Kaur",
    title: "UX Designer",
    location: "Bangalore, India",
    email: "simran.kaur@example.com",
    phone: "+91 98765 43210",
    bio: "Passionate UX Designer with 3+ years of experience creating user-centered digital experiences for fintech and e-commerce products.",
    profileCompletion: 85,
    skills: [
      { name: "UI/UX Design", level: 90 },
      { name: "Figma", level: 95 },
      { name: "User Research", level: 80 },
      { name: "Prototyping", level: 85 },
      { name: "Design Systems", level: 75 },
    ] as Skill[],
    experience: [
      {
        id: "exp1",
        title: "Senior UX Designer",
        company: "TechCorp India",
        duration: "2022 - Present",
        description: "Leading UX design for financial products, managing a team of 3 designers, and implementing design systems."
      },
      {
        id: "exp2",
        title: "UX Designer",
        company: "Digital Solutions",
        duration: "2020 - 2022",
        description: "Designed user interfaces for e-commerce applications and conducted user research."
      }
    ] as Experience[],
    education: [
      {
        id: "edu1",
        degree: "Master's in Interaction Design",
        institution: "National Institute of Design",
        year: "2020"
      },
      {
        id: "edu2",
        degree: "Bachelor's in Computer Science",
        institution: "Delhi University",
        year: "2018"
      }
    ] as Education[],
    achievements: [
      {
        id: "ach1",
        title: "Design Excellence Award",
        date: "2023",
        description: "Recognized for outstanding contribution to product design."
      },
      {
        id: "ach2",
        title: "UX Conference Speaker",
        date: "2022",
        description: "Presented on 'Designing for Inclusivity' at UX India Conference."
      }
    ] as Achievement[],
    preferences: {
      notifications: true,
      emailUpdates: false,
      darkMode: false,
      language: "English",
      privacySettings: {
        profileVisibility: "Public",
        showEmail: false,
        showPhone: false
      }
    }
  })
  
  const [tempUserData, setTempUserData] = useState(userData)
  
  const handleSaveProfile = () => {
    setUserData(tempUserData)
    setEditMode(false)
  }
  
  const handleCancelEdit = () => {
    setTempUserData(userData)
    setEditMode(false)
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div 
        className="bg-white w-full max-w-md h-full overflow-y-auto animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="font-semibold text-lg">Your Profile</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <TabsList className="w-full justify-start px-4 pb-2">
            <TabsTrigger 
              value="profile" 
              onClick={() => setActiveTab("profile")}
              className={activeTab === "profile" ? "bg-[#EDE4F1] text-[#6C5CE7]" : ""}
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="career" 
              onClick={() => setActiveTab("career")}
              className={activeTab === "career" ? "bg-[#EDE4F1] text-[#6C5CE7]" : ""}
            >
              Career
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              onClick={() => setActiveTab("settings")}
              className={activeTab === "settings" ? "bg-[#EDE4F1] text-[#6C5CE7]" : ""}
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-4">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-[#D2B6E2]">
                    <img src="/placeholder.svg?height=80&width=80" alt={userData.name} />
                  </Avatar>
                  {!editMode && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-white border-[#D2B6E2]"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit className="h-3 w-3 text-[#6C5CE7]" />
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  {editMode ? (
                    <div className="space-y-2">
                      <Input 
                        value={tempUserData.name} 
                        onChange={(e) => setTempUserData({...tempUserData, name: e.target.value})}
                        className="font-medium text-lg h-8 bg-[#F7F7FA] border-[#D2B6E2]"
                      />
                      <Input 
                        value={tempUserData.title} 
                        onChange={(e) => setTempUserData({...tempUserData, title: e.target.value})}
                        className="text-sm text-gray-600 h-7 bg-[#F7F7FA] border-[#D2B6E2]"
                      />
                      <Input 
                        value={tempUserData.location} 
                        onChange={(e) => setTempUserData({...tempUserData, location: e.target.value})}
                        className="text-xs text-gray-500 h-6 bg-[#F7F7FA] border-[#D2B6E2]"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-lg">{userData.name}</h3>
                      <p className="text-sm text-gray-600">{userData.title}</p>
                      <p className="text-xs text-gray-500">{userData.location}</p>
                    </>
                  )}
                  
                  <div className="mt-2">
                    <div className="flex items-center gap-1">
                      <p className="text-xs">Profile Completion</p>
                      <span className="text-xs font-medium text-[#6C5CE7]">{userData.profileCompletion}%</span>
                    </div>
                    <Progress value={userData.profileCompletion} className="h-1.5 mt-1" />
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-[#6C5CE7]" />
                  About Me
                </h4>
                
                {editMode ? (
                  <Textarea 
                    value={tempUserData.bio} 
                    onChange={(e) => setTempUserData({...tempUserData, bio: e.target.value})}
                    className="min-h-[100px] bg-[#F7F7FA] border-[#D2B6E2]"
                  />
                ) : (
                  <p className="text-sm">{userData.bio}</p>
                )}
              </div>
              
              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Email</p>
                    {editMode ? (
                      <Input 
                        value={tempUserData.email} 
                        onChange={(e) => setTempUserData({...tempUserData, email: e.target.value})}
                        className="max-w-[200px] h-7 text-sm bg-[#F7F7FA] border-[#D2B6E2]"
                      />
                    ) : (
                      <p className="text-sm">{userData.email}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Phone</p>
                    {editMode ? (
                      <Input 
                        value={tempUserData.phone} 
                        onChange={(e) => setTempUserData({...tempUserData, phone: e.target.value})}
                        className="max-w-[200px] h-7 text-sm bg-[#F7F7FA] border-[#D2B6E2]"
                      />
                    ) : (
                      <p className="text-sm">{userData.phone}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-1.5 text-[#6C5CE7]" />
                  Skills
                </h4>
                
                <div className="space-y-3">
                  {(editMode ? tempUserData.skills : userData.skills).map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        {editMode ? (
                          <div className="flex gap-2 w-full">
                            <Input 
                              value={skill.name} 
                              onChange={(e) => {
                                const updatedSkills = [...tempUserData.skills]
                                updatedSkills[index].name = e.target.value
                                setTempUserData({...tempUserData, skills: updatedSkills})
                              }}
                              className="text-sm h-7 bg-[#F7F7FA] border-[#D2B6E2]"
                            />
                            <Input 
                              type="number"
                              min="0"
                              max="100"
                              value={skill.level} 
                              onChange={(e) => {
                                const updatedSkills = [...tempUserData.skills]
                                updatedSkills[index].level = parseInt(e.target.value) || 0
                                setTempUserData({...tempUserData, skills: updatedSkills})
                              }}
                              className="text-sm h-7 w-16 bg-[#F7F7FA] border-[#D2B6E2]"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{skill.name}</p>
                            <p className="text-xs">{skill.level}%</p>
                          </>
                        )}
                      </div>
                      <Progress value={skill.level} className="h-1.5" />
                    </div>
                  ))}
                  
                  {editMode && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 border-dashed border-[#D2B6E2] text-[#6C5CE7]"
                      onClick={() => {
                        const updatedSkills = [...tempUserData.skills, { name: "New Skill", level: 50 }]
                        setTempUserData({...tempUserData, skills: updatedSkills})
                      }}
                    >
                      + Add Skill
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Edit Mode Buttons */}
              {editMode && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-[#6C5CE7] hover:bg-[#5A4EBF]"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "career" && (
            <div className="space-y-6">
              {/* Experience */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Briefcase className="h-4 w-4 mr-1.5 text-[#6C5CE7]" />
                  Work Experience
                </h4>
                
                <div className="space-y-4">
                  {userData.experience.map((exp) => (
                    <Card key={exp.id} className="p-3 bg-[#F7F7FA] border-[#D2B6E2]">
                      <div className="flex justify-between">
                        <h5 className="font-medium text-sm">{exp.title}</h5>
                        <Badge variant="outline" className="font-normal text-xs bg-white">
                          {exp.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{exp.company}</p>
                      <p className="text-xs mt-2">{exp.description}</p>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-dashed border-[#D2B6E2] text-[#6C5CE7]"
                  >
                    + Add Experience
                  </Button>
                </div>
              </div>
              
              {/* Education */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1.5 text-[#6C5CE7]" />
                  Education
                </h4>
                
                <div className="space-y-4">
                  {userData.education.map((edu) => (
                    <Card key={edu.id} className="p-3 bg-[#F7F7FA] border-[#D2B6E2]">
                      <div className="flex justify-between">
                        <h5 className="font-medium text-sm">{edu.degree}</h5>
                        <Badge variant="outline" className="font-normal text-xs bg-white">
                          {edu.year}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-dashed border-[#D2B6E2] text-[#6C5CE7]"
                  >
                    + Add Education
                  </Button>
                </div>
              </div>
              
              {/* Achievements */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Award className="h-4 w-4 mr-1.5 text-[#6C5CE7]" />
                  Achievements
                </h4>
                
                <div className="space-y-4">
                  {userData.achievements.map((ach) => (
                    <Card key={ach.id} className="p-3 bg-[#F7F7FA] border-[#D2B6E2]">
                      <div className="flex justify-between">
                        <h5 className="font-medium text-sm">{ach.title}</h5>
                        <Badge variant="outline" className="font-normal text-xs bg-white">
                          {ach.date}
                        </Badge>
                      </div>
                      {ach.description && (
                        <p className="text-xs mt-2">{ach.description}</p>
                      )}
                    </Card>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-dashed border-[#D2B6E2] text-[#6C5CE7]"
                  >
                    + Add Achievement
                  </Button>
                </div>
              </div>
              
              {/* Career Goals */}
              <div>
                <h4 className="text-sm font-medium mb-3">Career Goals</h4>
                
                <Card className="p-3 bg-[#F7F7FA] border-[#D2B6E2]">
                  <h5 className="font-medium text-sm">Short-term Goal</h5>
                  <p className="text-xs mt-1">Become a Senior UX Designer and lead a design team within the next year.</p>
                  
                  <h5 className="font-medium text-sm mt-3">Long-term Goal</h5>
                  <p className="text-xs mt-1">Transition into a Design Director role and contribute to shaping product strategy.</p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 text-[#6C5CE7]"
                  >
                    Update Career Goals
                  </Button>
                </Card>
              </div>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Account Settings */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Settings className="h-4 w-4 mr-1.5 text-[#6C5CE7]" />
                  Account Settings
                </h4>
                
                <Card className="p-4 bg-[#F7F7FA] border-[#D2B6E2]">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="email" className="text-sm">Email Address</Label>
                      <Input 
                        id="email" 
                        value={userData.email} 
                        className="bg-white border-[#D2B6E2]" 
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="password" className="text-sm">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value="••••••••" 
                        className="bg-white border-[#D2B6E2]" 
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="language" className="text-sm">Language</Label>
                      <select 
                        id="language" 
                        className="w-full h-9 px-3 py-1 rounded-md border border-[#D2B6E2] bg-white"
                        value={userData.preferences.language}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Notifications */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Bell className="h-4 w-4 mr-1.5 text-[#6C5CE7]" />
                  Notifications
                </h4>
                
                <Card className="p-4 bg-[#F7F7FA] border-[#D2B6E2]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">App Notifications</p>
                        <p className="text-xs text-gray-500">Receive in-app notifications</p>
                      </div>
                      <Switch 
                        checked={userData.preferences.notifications} 
                        onCheckedChange={(checked) => {
                          setUserData({
                            ...userData, 
                            preferences: {
                              ...userData.preferences,
                              notifications: checked
                            }
                          })
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Email Updates</p>
                        <p className="text-xs text-gray-500">Receive updates via email</p>
                      </div>
                      <Switch 
                        checked={userData.preferences.emailUpdates} 
                        onCheckedChange={(checked) => {
                          setUserData({
                            ...userData, 
                            preferences: {
                              ...userData.preferences,
                              emailUpdates: checked
                            }
                          })
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Privacy */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-1.5 text-[#6C5CE7]" />
                  Privacy
                </h4>
                
                <Card className="p-4 bg-[#F7F7FA] border-[#D2B6E2]">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="visibility" className="text-sm">Profile Visibility</Label>
                      <select 
                        id="visibility" 
                        className="w-full h-9 px-3 py-1 rounded-md border border-[#D2B6E2] bg-white"
                        value={userData.preferences.privacySettings.profileVisibility}
                        onChange={(e) => {
                          setUserData({
                            ...userData, 
                            preferences: {
                              ...userData.preferences,
                              privacySettings: {
                                ...userData.preferences.privacySettings,
                                profileVisibility: e.target.value
                              }
                            }
                          })
                        }}
                      >
                        <option value="Public">Public</option>
                        <option value="Connections Only">Connections Only</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Email</p>
                        <p className="text-xs text-gray-500">Display email on your profile</p>
                      </div>
                      <Switch 
                        checked={userData.preferences.privacySettings.showEmail} 
                        onCheckedChange={(checked) => {
                          setUserData({
                            ...userData, 
                            preferences: {
                              ...userData.preferences,
                              privacySettings: {
                                ...userData.preferences.privacySettings,
                                showEmail: checked
                              }
                            }
                          })
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Phone</p>
                        <p className="text-xs text-gray-500">Display phone on your profile</p>
                      </div>
                      <Switch 
                        checked={userData.preferences.privacySettings.showPhone} 
                        onCheckedChange={(checked) => {
                          setUserData({
                            ...userData, 
                            preferences: {
                              ...userData.preferences,
                              privacySettings: {
                                ...userData.preferences.privacySettings,
                                showPhone: checked
                              }
                            }
                          })
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Logout */}
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
