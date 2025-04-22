import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function LinkedInMessageGenerator() {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-linkedin-message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, job_title: jobTitle, purpose }),
      });
      
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error generating message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">LinkedIn Message Generator</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Recipient's Name</Label>
          <Input 
            id="name"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Jane Doe" 
          />
        </div>
        
        <div>
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input 
            id="jobTitle"
            value={jobTitle} 
            onChange={(e) => setJobTitle(e.target.value)} 
            placeholder="Marketing Director" 
          />
        </div>
        
        <div>
          <Label htmlFor="purpose">Purpose of Connection</Label>
          <Textarea 
            id="purpose"
            value={purpose} 
            onChange={(e) => setPurpose(e.target.value)} 
            placeholder="I'm interested in learning more about marketing strategies in your industry"
            rows={3}
          />
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={loading || !name || !jobTitle || !purpose}
        >
          {loading ? "Generating..." : "Generate Message"}
        </Button>
      </div>
      
      {message && (
        <Card className="p-4">
          <p className="font-medium mb-4">Generated LinkedIn Message:</p>
          <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded mb-4">
            {message}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setMessage("")}>
              Clear
            </Button>
            <Button size="sm" onClick={handleCopy}>
              Copy to Clipboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}