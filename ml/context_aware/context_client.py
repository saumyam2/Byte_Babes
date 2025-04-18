import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory
from langchain.prompts import PromptTemplate

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    temperature=0.5,
    model_name="llama3-8b-8192",
    api_key=groq_api_key
)

memory = ConversationSummaryBufferMemory(
    llm=llm,
    max_token_limit=1000,
    return_messages=True
)

prompt = PromptTemplate.from_template("""
    You are an empathetic, inclusive assistant dedicated to encouraging, empowering, and supporting everyone—
    especially women. Always promote respect, equity, and strength through your words. Keep context in mind.

    Context: {history}
    User: {input}
    Response:
""")

conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True,
    prompt=prompt
)

def get_chat_response(user_message: str) -> str:
    return conversation.run(user_message)
