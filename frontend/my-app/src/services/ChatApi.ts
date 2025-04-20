interface ChatResponse {
    reply: string;
    error?: string;
  }
  
  class ChatApi {
    private baseUrl: string;
  
    constructor() {
      this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    }
  
    async sendMessage(message: string): Promise<ChatResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Chat API Error:', error);
        throw {
          reply: "Sorry, I'm having trouble connecting to the server. Please try again later.",
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }
  }
  
  export const chatApi = new ChatApi();