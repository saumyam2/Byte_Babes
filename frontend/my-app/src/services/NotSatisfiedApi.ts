interface NotSatisfiedError extends Error {
  status?: number;
  statusText?: string;
}

export class NotSatisfiedApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://127.0.0.1:8000';
    console.log('NotSatisfiedApi initialized with baseUrl:', this.baseUrl);
  }

  async notSatisfied(message: string): Promise<string> {
    if (!message || message.trim() === '') {
      throw new Error('Message cannot be empty');
    }

    const endpoint = `${this.baseUrl}/chat/not_satisfied`;
    console.log('Calling not_satisfied endpoint:', endpoint, { message });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ message: message }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('not_satisfied failed:', text);
      const error = new Error(`not_satisfied failed: ${text}`) as NotSatisfiedError;
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const data = await response.json();
    return data.response;
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unexpected error occurred');
  }
}

export const notSatisfiedApi = new NotSatisfiedApi(); 