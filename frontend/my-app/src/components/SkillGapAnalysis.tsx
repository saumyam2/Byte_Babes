import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types";
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle } from "lucide-react";

// Define types based on the JSON structure
interface Course {
  url: string;
  certification: boolean;
}

interface LearningPathStep {
  title: string;
  recommended_courses: Course[];
}

interface LearningData {
  [skill: string]: {
    steps: LearningPathStep[];
  };
}

interface AnalysisResponse {
  message?: string;
  [skill: string]: any;
}

// Service function to communicate with the backend
const analyzeSkillGap = async (file: string | Blob, jobDescription: string | Blob | null) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  if (typeof jobDescription === 'string') {
    formData.append('job_description_text', jobDescription);
  } else if (jobDescription instanceof File) {
    formData.append('job_description_file', jobDescription);
  }

  const response = await fetch('https://jobsforher-bytebabes.onrender.com/skill-gap-analysis', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze skill gap');
  }

  return response.json();
};

interface SkillGapAnalysisProps {
  onUploadResume?: (message: Message) => void;
}

export function SkillGapAnalysisComponent({ onUploadResume }: SkillGapAnalysisProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [LearningPath, setLearningPath] = useState<LearningData | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMethod, setInputMethod] = useState('text'); // 'text' or 'file'
  const [expandedSteps, setExpandedSteps] = useState<number[]>([0]); // First step expanded by default

  const toggleExpand = (index: number) => {
    setExpandedSteps(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const formatUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!file || (!jobDescription && !jobDescriptionFile)) {
      setError('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setLearningPath(null);

    try {
      const analysis: AnalysisResponse = await analyzeSkillGap(
        file, 
        inputMethod === 'text' ? jobDescription : jobDescriptionFile
      );
      
      console.log('Received analysis data:', analysis);

      if (analysis.message === "No missing skills found.") {
        setSuccessMessage("Great news! Your skills match well with the job requirements.");
      } else {
        setLearningPath(analysis as LearningData);
      }
      
      // If onUploadResume callback exists, call it with a message
      if (onUploadResume) {
        onUploadResume({ 
          id: Date.now().toString(), 
          content: "Resume and job description analyzed", 
          role: "user", 
          timestamp: new Date() 
        });
      }
    } catch (err) {
      console.error('Error in skill gap analysis:', err);
      setError('Failed to analyze skill gap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Skill Gap Analysis</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Job Description</label>
            <div className="flex space-x-4 mb-2">
              <Button 
                type="button" 
                onClick={() => setInputMethod('text')} 
                variant={inputMethod === 'text' ? 'default' : 'outline'}
              >
                Paste Text
              </Button>
              <Button 
                type="button" 
                onClick={() => setInputMethod('file')} 
                variant={inputMethod === 'file' ? 'default' : 'outline'}
              >
                Upload File
              </Button>
            </div>
            
            {inputMethod === 'text' ? (
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
                className="min-h-[150px] w-full"
              />
            ) : (
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setJobDescriptionFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
              />
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Analyzing...' : 'Analyze Skills'}
          </Button>
        </form>
      </Card>

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <Card className="p-6">
          <div className="flex items-center text-green-600 gap-2">
            <CheckCircle className="h-5 w-5" />
            <p className="text-lg font-medium">{successMessage}</p>
          </div>
        </Card>
      )}

      {LearningPath && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Learning Path</h2>
          <div className="space-y-4">
            {Object.entries(LearningPath).map(([skill, data]) => (
              <div key={skill} className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">{skill.toUpperCase()}</h3>
                {data?.steps?.map((step, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden mb-3">
                    <div 
                      className="bg-blue-50 p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <Button variant="ghost" size="sm">
                        {expandedSteps.includes(index) ? 
                          <ChevronUp className="h-5 w-5" /> : 
                          <ChevronDown className="h-5 w-5" />
                        }
                      </Button>
                    </div>
                    
                    {expandedSteps.includes(index) && (
                      <div className="p-4 space-y-3">
                        <p className="font-medium">Recommended Courses:</p>
                        <div className="space-y-2">
                          {step.recommended_courses?.map((course, courseIndex) => (
                            <div key={courseIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <a 
                                  href={course.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  {formatUrl(course.url)}
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </div>
                              {course.certification && (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  <span className="text-sm">Certification Available</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {(!data?.steps || data.steps.length === 0) && (
                  <div className="text-gray-500 italic">
                    No learning path available for this skill.
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}