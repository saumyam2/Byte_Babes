interface ChatError extends Error {
    status?: number;
    statusText?: string;
  }
// Add this as a separate service for the intent classifier
export class IntentClassifierApi {
    private baseUrl: string;
    
    constructor() {
      // Use the correct base URL for your intent classifier service
      this.baseUrl = 'https://jobsforher-bytebabes.onrender.com'; // Adjust this to your intent classifier URL
      console.log('IntentClassifierApi initialized with baseUrl:', this.baseUrl);
    }
    
    async classifyIntent(message: string): Promise<string> {
      const endpoint = `${this.baseUrl}/classify-intent/`;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
        
        if (!response.ok) {
          const error = new Error(`Intent classification failed! status: ${response.status}`) as ChatError;
          error.status = response.status;
          error.statusText = response.statusText;
          throw error;
        }
        
        const data = await response.json();
        return data.intent;
      } catch (error) {
        console.error('Intent Classification Error:', error);
        // Return a default intent if classification fails
        return 'general_chat';
      }
    }
  }
  
  export const intentClassifierApi = new IntentClassifierApi();