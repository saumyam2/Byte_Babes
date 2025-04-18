# inclusive_memory_chatbot.py

import os
from dotenv import load_dotenv
# from langchain.chat_models import ChatGroq
from langchain_groq import ChatGroq
from langchain.memory import ConversationSummaryBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import PromptTemplate

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

def create_inclusive_context_chatbot():
    llm = ChatGroq(groq_api_key=groq_api_key, model_name="llama3-8b-8192")

    # Memory that maintains summary + recent history
    memory = ConversationSummaryBufferMemory(
        llm=llm,
        max_token_limit=1000,
        return_messages=True
    )

    # Prompt to enforce inclusivity and empowerment
    prompt = PromptTemplate.from_template("""
    You are an empathetic, inclusive assistant dedicated to encouraging, empowering, and supporting everyone—
    especially women. Always promote respect, equity, and strength through your words. Keep context in mind.

    Context: {history}
    User: {input}
    Response:
    """)

    chatbot = ConversationChain(
        llm=llm,
        prompt=prompt,
        memory=memory,
        verbose=True
    )

    return chatbot
