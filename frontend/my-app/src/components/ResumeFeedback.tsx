import { useState } from "react";
import { Upload, Send, Loader2 } from "lucide-react";
import { Message } from "@/types";
import ReactMarkdown from "react-markdown";

type ResumeFeedbackProps = {
  onUploadResume?: (message: Message) => void;
};

export default function ResumeFeedback({ onUploadResume }: ResumeFeedbackProps) {
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState("");
  const [improvements, setImprovements] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please upload a resume file");
      return;
    }
    
    if (!keywords.trim()) {
      setError("Please enter job role keywords");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("keywords", keywords);
      
      const response = await fetch("http://127.0.0.1:8000/optimize-resume/", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to optimize resume");
      }
      
      setImprovements(data.improvements);
      
      // If onUploadResume prop is provided, call it with the improvements
      if (onUploadResume) {
        onUploadResume({
            role: "assistant",
            content: `Resume improvements for keywords: ${keywords}`,
            id: Date.now().toString(),
            timestamp: new Date()
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Resume Optimization</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Your Resume
          </label>
          <div className="mt-1 flex items-center">
            <label className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 cursor-pointer">
              <Upload className="mr-2 h-5 w-5" />
              <span>{file ? "Change File" : "Select File"}</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </label>
            {file && (
              <span className="ml-3 text-sm text-gray-600">{file.name}</span>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            Job Keywords (comma-separated)
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. project management, agile, leadership"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Optimize Resume
            </>
          )}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {improvements && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Suggested Improvements:</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            {Array.isArray(improvements) ? (
              <div className="space-y-4">
                {improvements.map((improvement, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="prose prose-blue max-w-none" {...props} />,
                      }}
                    >
                      {improvement}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => <p className="prose prose-blue max-w-none" {...props} />,
                }}
              >
                {improvements}
              </ReactMarkdown>
            )}
          </div>
        </div>
      )}
    </div>
  );
}