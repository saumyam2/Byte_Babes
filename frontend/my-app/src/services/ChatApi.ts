interface ChatResponse {
  sessionId: string;
  botResponse: string;
  feedbackId?: string;
}

interface ChatError extends Error {
  status?: number;
  statusText?: string;
}

export class ChatApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8086';
    console.log('ChatApi initialized with baseUrl:', this.baseUrl);
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    const endpoint = `${this.baseUrl}/chatbot/message`;
    console.log('Sending message to endpoint:', endpoint);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`) as ChatError;
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw this.handleError(error);
    }
  }

  async uploadFile(file: File, message: string): Promise<ChatResponse> {
    const endpoint = `${this.baseUrl}/chatbot/upload`;
    console.log('Uploading file to endpoint:', endpoint);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', message);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = new Error(`Upload failed! status: ${response.status}`) as ChatError;
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('File Upload Error:', error);
      throw this.handleError(error);
    }
  }

  async submitFeedback(feedbackId: string, feedback: { category?: string, details?: string }): Promise<void> {
    const endpoint = `${this.baseUrl}/feedback`;
    console.log('Submitting feedback to endpoint:', endpoint);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'feedback-id': feedbackId,
        },
        credentials: 'include',
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        const error = new Error(`Feedback submission failed! status: ${response.status}`) as ChatError;
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }
    } catch (error) {
      console.error('Feedback Submission Error:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unexpected error occurred');
  }
}

export const chatApi = new ChatApi();