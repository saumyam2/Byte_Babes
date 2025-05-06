import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface ReferralResponse {
  subject: string;
  body: string;
}

const Referral: React.FC = () => {
  const [to, setTo] = useState('');
  const [resume, setResume] = useState('');
  const [company, setCompany] = useState('');
  const [jobId, setJobId] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ReferralResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/referral-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          resume,
          company,
          job_id: jobId,
          job_role: jobRole,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate referral email.');
      }
      const data = await response.json();
      const mail = data.email ? data.email : data;
      setResult(mail);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Generate Referral Email</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Your Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={to}
            onChange={e => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Resume (paste text)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={resume}
            onChange={e => setResume(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Company</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Job ID</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={jobId}
            onChange={e => setJobId(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Job Role</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={jobRole}
            onChange={e => setJobRole(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Referral Email'}
        </Button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {result && (
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Subject:</h3>
          <div className="mb-2">{result.subject}</div>
          <h3 className="font-semibold mb-2">Body:</h3>
          <div style={{ whiteSpace: 'pre-line' }}>{result.body}</div>
        </div>
      )}
    </div>
  );
};

export default Referral; 