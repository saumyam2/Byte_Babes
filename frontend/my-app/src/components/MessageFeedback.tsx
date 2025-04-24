import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notSatisfiedApi } from '@/services/NotSatisfiedApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessageFeedbackProps {
  messageId: string;
  userMessage: string;  // the text the user just sent
}

export function MessageFeedback({
  messageId,
  userMessage,
}: MessageFeedbackProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [botReply, setBotReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handlePositiveFeedback = () => {
    console.log('Positive feedback for', messageId);
    setFeedbackSubmitted(true);
  };

  const handleNegativeFeedback = () => {
    setShowFeedbackDialog(true);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      return;
    }

    setLoading(true);
    try {
      const reply = await notSatisfiedApi.notSatisfied(feedbackText);
      setBotReply(reply);
      setShowFeedbackDialog(false);
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Error fetching not_satisfied reply:', err);
      setBotReply('Sorry, something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // After feedback, show either the ALT reply or a generic thanks
  if (feedbackSubmitted) {
    return (
      <div>
       
        <div className="flex flex-col p-4">
          <div className={cn(
            "max-w-[80%] rounded-lg p-4 bg-muted"
          )}>
            {loading
              ? 'Loading…'
              : botReply
              ? <div className="whitespace-pre-wrap">{botReply}</div>
              : 'Thank you for your feedback!'}
          </div>
        </div>
      </div>
    );
  }

  // Before feedback: show thumbs up/down
  return (
    <>
      <div className="flex items-center gap-2 mt-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-green-600"
          onClick={handlePositiveFeedback}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-red-600"
          onClick={handleNegativeFeedback}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What wasn't helpful?</DialogTitle>
            <DialogDescription>
              Please let us know what wasn't satisfactory about the response so we can improve.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Tell us what wasn't helpful..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFeedback} disabled={!feedbackText.trim()}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
