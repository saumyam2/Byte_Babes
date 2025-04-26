# Asha AI Chatbot - JobsForHer Foundation

## Overview
Asha AI Chatbot is an intelligent virtual assistant designed to enhance user engagement on the JobsForHer Foundation platform. The chatbot provides seamless access to information about women's careers, job listings, community events, mentorship programs, and session details.

## Problem Statement
The project addresses the need for an accessible, intelligent, and bias-aware virtual assistant that can help women navigate career opportunities and professional development resources effectively.

## Key Features

### 1. Contextual Conversations
- Multi-turn conversation handling
- Context-aware responses
- Session-based interaction management
- Smart suggestion chips for guided navigation

### 2. Core Functionalities
- Job search and recommendations
- Event discovery and registration
- Mentor matching and profile viewing
- Resume feedback and analysis
- Career roadmap generation
- Skill gap analysis
- Cold email/LinkedIn message generation
- Success stories sharing

### 3. Technical Implementation
- **Frontend**: Next.js with TypeScript
- **Real-time Updates**: Dynamic content retrieval
- **UI Components**: Modern, responsive design
- **Integration**: Public APIs for jobs, events, and mentorship data
- **Search**: Semantic search capabilities
- **RAG (Retrieval-Augmented Generation)**: Enhanced response accuracy

### 4. Ethical AI & Privacy
- Gender bias detection and mitigation
- Privacy-conscious design
- Secure data handling
- Compliance with AI ethics frameworks

### 5. System Architecture
- **Frontend**: React/Next.js components
- **Backend Services**:
  - Intent classification
  - Chat API
  - Events service
  - Mentor search
  - Resume analysis
  - Job search service

## Getting Started

### Prerequisites
- Node.js
- npm/yarn
- Python (for backend services)

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install frontend dependencies
```bash
cd frontend/my-app
npm install
```

3. Start the development server
```bash
npm run dev
```
4. Install ml dependencies
```bash
cd ml
python -m venv venv     
source venv/bin/activate
pip install -r requirements.txt
```
5. Start ml server
```bash
uvicorn main:app --reload
```
6.Install backend dependencies and start server
```bash
cd backend
npm start
```
### Endpoints 

<img width="665" alt="Screenshot 2025-04-26 at 5 44 10 PM" src="https://github.com/user-attachments/assets/f74479a8-cebe-4b29-9692-61e85c3594b8" />

## Project Structure

```
frontend/my-app/
├── src/
│   ├── app/
│   │   ├── chatbot/         # Main chatbot interface
│   │   └── components/      # Reusable UI components
│   ├── services/           # API services
│   ├── types/             # TypeScript definitions
│   └── hooks/             # Custom React hooks
```

## Key Components

1. **ChatBot Interface**
   - Message handling
   - Real-time responses
   - Smart suggestions
   - File upload capabilities

2. **Specialized Features**
   - Resume analysis
   - Job search
   - Event discovery
   - Mentor matching
   - Career pathway visualization

3. **UI Elements**
   - Responsive design
   - Mobile-friendly interface
   - Accessibility features
   - Interactive components

## Performance & Monitoring

- Analytics tracking for user engagement
- Response accuracy metrics
- Bias detection monitoring
- Continuous learning framework
- User feedback collection

## Error Handling

- Graceful degradation
- Fallback mechanisms
- Human support redirection
- Feedback loop for improvements

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments
- JobsForHer Foundation
- Contributors and maintainers
- Open source community 
