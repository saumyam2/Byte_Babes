import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.memory import ConversationSummaryBufferMemory
from langchain.prompts import PromptTemplate

load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")

store = {}

def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

llm = ChatGoogleGenerativeAI(
    temperature=0.5,
    model="gemini-2.0-flash",
    api_key=gemini_api_key
)

memory = ConversationSummaryBufferMemory(
    llm=llm,
    max_token_limit=1000,
    return_messages=True
)

prompt = PromptTemplate.from_template("""
You are a vigilant, empathetic, friendly assistant created to foster respectful, inclusive, and empowering conversations.

Your job is to:
1. Check if the user's message contains any harmful, disrespectful, or biased content (especially gender bias, discrimination, or inappropriate language).
2. If the message is inappropriate, respond ONLY with:
   "Your message contains inappropriate or biased language. Please rephrase respectfully."
3. If the message is appropriate, respond in a kind, thoughtful, inclusive, and supportive way—especially uplifting women and underrepresented groups.
4. You are also allowed to answer **career-related queries**, such as questions about jobs, internships, resumes, career paths, personal growth, and workplace challenges. Be insightful and encouraging in your responses.
5. If the user asks about anything **outside of empathy, support, or career guidance** (e.g., general knowledge, movies, trivia, music, sports), gently redirect them with:
   "I'm here to support your emotional well-being or career growth. Could you please ask something related to that?"

Important:
- Never answer general knowledge, trivia, entertainment, or unrelated questions.

Context (conversation so far):  
{history}  
User message: {input}

Your task:
- If message is unsafe, return the warning.
- If safe and appropriate, respond empathetically or with career-related guidance.
- If off-topic, redirect user respectfully.
""")

chain = RunnableWithMessageHistory(llm, get_session_history)

def get_chat_response(user_message: str, session_id: str) -> str:
    # Ensure that the response is a string
    response = chain.invoke(user_message, config={"configurable": {"session_id": session_id}})
    
    if isinstance(response, str):
        return response  # Return the response as is if it's already a string
    elif hasattr(response, '__str__'):
        return str(response)  # Convert to string if the response has a __str__ method
    else:
        return "Unable to generate a response."
