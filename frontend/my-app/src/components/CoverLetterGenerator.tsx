import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Download, AlertCircle } from "lucide-react";

export default function CoverLetterGenerator() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleJobDescFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJobDescriptionFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPdfUrl(null);
    if (!resume || !company || (!jobDescriptionFile && !jobDescriptionText)) {
      setError("Please provide all required fields.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      if (jobDescriptionFile) {
        formData.append("job_description_file", jobDescriptionFile);
      } else if (jobDescriptionText) {
        formData.append("job_description_text", jobDescriptionText);
      }
      formData.append("company", company);
      const response = await fetch("http://127.0.0.1:8000/cover-letter", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to generate cover letter.");
      }
      // Blob download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-2">Cover Letter Generator</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Upload Your Resume (PDF/DOC/DOCX)</Label>
            <div className="mt-1 flex items-center gap-3">
              <label className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 cursor-pointer">
                <Upload className="mr-2 h-5 w-5" />
                <span>{resume ? "Change File" : "Select File"}</span>
                <input
                  type="file"
                  onChange={handleResumeChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
              {resume && (
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <FileText className="h-4 w-4" /> {resume.name}
                </span>
              )}
            </div>
          </div>

          <div>
            <Label>Job Description</Label>
            <div className="flex flex-col gap-2 mt-1">
              <label className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 cursor-pointer w-fit">
                <Upload className="mr-2 h-5 w-5" />
                <span>{jobDescriptionFile ? "Change File" : "Upload File (optional)"}</span>
                <input
                  type="file"
                  onChange={handleJobDescFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
              {jobDescriptionFile && (
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <FileText className="h-4 w-4" /> {jobDescriptionFile.name}
                </span>
              )}
              <span className="text-xs text-gray-500">Or paste the job description below:</span>
              <Textarea
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                placeholder="Paste job description here..."
                rows={4}
                disabled={!!jobDescriptionFile}
              />
            </div>
          </div>

          <div>
            <Label>Company Name</Label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating..." : "Generate Cover Letter"}
          </Button>
        </form>
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded mt-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        {pdfUrl && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <a
              href={pdfUrl}
              download="cover_letter.pdf"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Download className="h-5 w-5" /> Download Cover Letter (PDF)
            </a>
            <Button variant="outline" size="sm" onClick={() => setPdfUrl(null)}>
              Clear
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
} 