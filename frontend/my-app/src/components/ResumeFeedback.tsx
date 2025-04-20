import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { analyzeSkillGap } from '@/services/skillGapService';
import { Message } from "@/types";

export const SkillGapAnalysis = ({ onUploadResume }: { onUploadResume?: (message: Message) => void }) => {
  return (
    <div>
      {/* Component implementation */}
      {onUploadResume && (
        <button onClick={() => onUploadResume({ id: "1", content: "Resume uploaded", role: "user", timestamp: new Date() })}>
          Upload Resume
        </button>
      )}
    </div>
  )
}

export function SkillGapAnalysisComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysis = await analyzeSkillGap(file, jobDescription);
      setResults(analysis);
    } catch (err) {
      setError('Failed to analyze skill gap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Job Description</label>
            <Input
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              className="min-h-[150px]"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Skills'}
          </Button>
        </form>
      </Card>

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded">
          {error}
        </div>
      )}

      {results && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Skill Gap Analysis Results</h2>
          {Object.entries(results).map(([skill, details]: [string, any]) => (
            <div key={skill} className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{skill}</h3>
              <div className="pl-4">
                <p><strong>Difficulty:</strong> {details.difficulty}</p>
                <p><strong>Timeline:</strong> {details.timeline}</p>
                <div className="mt-2">
                  <strong>Prerequisites:</strong>
                  <ul className="list-disc pl-5">
                    {details.prerequisites.map((prereq: string, i: number) => (
                      <li key={i}>{prereq}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <strong>Learning Resources:</strong>
                  <ul className="list-disc pl-5">
                    {details.resources.map((resource: string, i: number) => (
                      <li key={i}>{resource}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}