import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";

// Service function to communicate with the backend
const generateCareerPathway = async (
  currentRole: string,
  dreamRole: string,
  timeFrameYears: number,
  targetIndustry: string,
  targetCompanies: string[]
) => {
  const response = await fetch('https://jobsforher-bytebabes.onrender.com/generate-career-pathway/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current_role: currentRole,
      dream_role: dreamRole,
      time_frame_years: timeFrameYears,
      target_industry: targetIndustry,
      target_companies: targetCompanies
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate career pathway');
  }

  return response.json();
};

interface CareerPathwayProps {
  onGeneratePathway?: (message: Message) => void;
}

export function CareerPathwayComponent({ onGeneratePathway }: CareerPathwayProps) {
  const [currentRole, setCurrentRole] = useState("");
  const [dreamRole, setDreamRole] = useState("");
  const [timeFrameYears, setTimeFrameYears] = useState<number>(2);
  const [targetIndustry, setTargetIndustry] = useState("");
  const [targetCompanies, setTargetCompanies] = useState("");
  const [loading, setLoading] = useState(false);
  const [pathwayData, setPathwayData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(["year1", "year2"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      if (prev.includes(section)) {
        return prev.filter(s => s !== section);
      } else {
        return [...prev, section];
      }
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!currentRole || !dreamRole || !targetIndustry) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const companies = targetCompanies.split(',')
        .map(company => company.trim())
        .filter(company => company !== "");
      
      const pathwayResponse = await generateCareerPathway(
        currentRole,
        dreamRole,
        timeFrameYears,
        targetIndustry,
        companies
      );
      
      setPathwayData(pathwayResponse.career_pathway);
      
      // If onGeneratePathway callback exists, call it with a message
      if (onGeneratePathway) {
        onGeneratePathway({ 
          id: Date.now().toString(), 
          content: `Generated career pathway from ${currentRole} to ${dreamRole}`, 
          role: "user", 
          timestamp: new Date() 
        });
      }
    } catch (err) {
      setError('Failed to generate career pathway. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderPathwayContent = () => {
    if (!pathwayData) return null;

    const paragraphs = pathwayData.split('\n\n');
    let processedContent: JSX.Element[] = [];

    const createYearSection = (yearNum: string) => (
      <div key={`year${yearNum}-heading`} className="mt-4">
        <div 
          className="flex items-center justify-between cursor-pointer bg-blue-50 p-3 rounded"
          onClick={() => toggleSection(`year${yearNum}`)}
        >
          <h3 className="text-lg font-semibold">Year {yearNum}</h3>
          <Button variant="ghost" size="sm">
            {expandedSections.includes(`year${yearNum}`) ? 
              <ChevronUp className="h-5 w-5" /> : 
              <ChevronDown className="h-5 w-5" />
            }
          </Button>
        </div>
        {expandedSections.includes(`year${yearNum}`) && (
          <div className="pl-4 pt-2">
            <div className="space-y-4"></div>
          </div>
        )}
      </div>
    );

    const addContentToYear = (yearSection: JSX.Element, content: JSX.Element) => {
      const children = yearSection.props.children;
      const expandedContent = children[1];
      
      if (!expandedContent || !expandedContent.props || !expandedContent.props.children) {
        return yearSection;
      }

      return {
        ...yearSection,
        props: {
          ...yearSection.props,
          children: [
            children[0],
            {
              ...expandedContent,
              props: {
                ...expandedContent.props,
                children: {
                  ...expandedContent.props.children,
                  props: {
                    ...expandedContent.props.children.props,
                    children: [
                      ...(expandedContent.props.children.props.children || []),
                      content
                    ]
                  }
                }
              }
            }
          ]
        }
      };
    };

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      
      if (paragraph.startsWith('**Year 1:**')) {
        processedContent.push(createYearSection('1'));
      } else if (paragraph.startsWith('**Year 2:**')) {
        processedContent.push(createYearSection('2'));
      } else if (paragraph.startsWith('**Skills')) {
        const currentYear = processedContent.length > 0 && 
                           processedContent[processedContent.length - 1].key === 'year2-heading' ? 
                           'year2' : 'year1';
        
        if (expandedSections.includes(currentYear)) {
          const content = (
            <div key={`${currentYear}-skills`} className="mt-3 mb-4">
              <h4 className="font-medium mb-2">Skills to learn:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {paragraphs[i+1]?.split('\n').map((item, idx) => (
                  <li key={idx}>{item.replace(/^\d+\.\s*\*\*|\*\*:\s*/, '').replace(/\*\*/g, '')}</li>
                ))}
              </ul>
            </div>
          );

          const lastIndex = processedContent.length - 1;
          if (lastIndex >= 0) {
            processedContent[lastIndex] = addContentToYear(processedContent[lastIndex], content);
          }
          i++;
        }
      }
      // ... handle other sections similarly ...
    }

    return processedContent;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Career Pathway Generator</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Current Role</label>
            <Input
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g., Junior Software Engineer"
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Dream Role</label>
            <Input
              value={dreamRole}
              onChange={(e) => setDreamRole(e.target.value)}
              placeholder="e.g., AI Research Scientist"
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Timeline (Years)</label>
            <div className="flex space-x-4">
              <Button 
                type="button" 
                onClick={() => setTimeFrameYears(1)} 
                variant={timeFrameYears === 1 ? "default" : "outline"}
                size="sm"
              >
                1 Year
              </Button>
              <Button 
                type="button" 
                onClick={() => setTimeFrameYears(2)} 
                variant={timeFrameYears === 2 ? "default" : "outline"}
                size="sm"
              >
                2 Years
              </Button>
              <Button 
                type="button" 
                onClick={() => setTimeFrameYears(5)} 
                variant={timeFrameYears === 5 ? "default" : "outline"}
                size="sm"
              >
                5 Years
              </Button>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Target Industry</label>
            <Input
              value={targetIndustry}
              onChange={(e) => setTargetIndustry(e.target.value)}
              placeholder="e.g., Artificial Intelligence"
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Target Companies (comma-separated)</label>
            <Input
              value={targetCompanies}
              onChange={(e) => setTargetCompanies(e.target.value)}
              placeholder="e.g., OpenAI, Google, Microsoft"
              className="w-full"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Generating...' : 'Generate Career Pathway'}
          </Button>
        </form>
      </Card>

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded">
          {error}
        </div>
      )}

      {pathwayData && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Career Pathway</h2>
          <div className="space-y-2">
            {renderPathwayContent()}
          </div>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" size="sm">Save Pathway</Button>
            <Button size="sm">Share with Mentor</Button>
          </div>
        </Card>
      )}
    </div>
  );
}