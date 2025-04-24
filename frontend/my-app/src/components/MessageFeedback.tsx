import { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chatApi } from '@/services/ChatApi';

interface MessageFeedbackProps {
  messageId: string;
}

export function MessageFeedback({ messageId }: MessageFeedbackProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<'inaccuarte' | 'biased' | 'irrelevant' | null>(null);
  const [details, setDetails] = useState('');

  const handleFeedback = async (isPositive: boolean) => {
    if (isPositive) {
      setFeedbackSubmitted(true);
      return;
    }
    setShowDetailForm(true);
  };

  const submitDetailedFeedback = async () => {
    try {
      await chatApi.submitFeedback(messageId, {
        category: feedbackCategory || undefined,
        details: details
      });
      setFeedbackSubmitted(true);
      setShowDetailForm(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (feedbackSubmitted) {
    return (
      <div className="text-xs text-gray-500 mt-1">
        Thank you for your feedback!
      </div>
    );
  }

  if (showDetailForm) {
    return (
      <div className="mt-2 space-y-2 text-sm">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className={feedbackCategory === 'inaccuarte' ? 'bg-red-50' : ''}
            onClick={() => setFeedbackCategory('inaccuarte')}
          >
            Inaccurate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={feedbackCategory === 'biased' ? 'bg-red-50' : ''}
            onClick={() => setFeedbackCategory('biased')}
          >
            Biased
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={feedbackCategory === 'irrelevant' ? 'bg-red-50' : ''}
            onClick={() => setFeedbackCategory('irrelevant')}
          >
            Irrelevant
          </Button>
        </div>
        <textarea
          className="w-full p-2 text-sm border rounded-md"
          placeholder="Please provide more details about the issue..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={2}
        />
        <div className="space-x-2">
          <Button
            size="sm"
            onClick={submitDetailedFeedback}
            disabled={!feedbackCategory || !details}
          >
            Submit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailForm(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-green-600"
        onClick={() => handleFeedback(true)}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-red-600"
        onClick={() => handleFeedback(false)}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
} 