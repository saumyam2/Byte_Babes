import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from deep_translator import GoogleTranslator
from langdetect import detect
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory
from langchain.prompts import PromptTemplate

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

def detect_language(text: str) -> str:
    try:
        return detect(text)
    except:
        return "en"

def translate(text: str, source: str, target: str) -> str:
    try:
        return GoogleTranslator(source=source, target=target).translate(text)
    except:
        return text

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
    You are a vigilant, empathetic assistant. Your job is to:
    1. First check the user's message for harmful, disrespectful, or biased content (especially gender bias or discrimination).
    2. If the message is inappropriate, respond ONLY with this warning: 
    "Your message contains inappropriate or biased language. Please rephrase respectfully."
    3. If the message is safe, continue as an empathetic, inclusive assistant who encourages, empowers, and supports everyone—especially women. 
    Promote respect, equity, and strength through your words. Be kind, supportive, and thoughtful.
                                      
    Always respond in the language of the user's message.

    Context: {history}
    User: {input}

    Your task:
    - If message is unsafe, respond with a warning and tell the user to re-phrase their query.
    - If message is appropriate, respond empathetically.
""")

conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True,
    prompt=prompt
)

def get_chat_response(user_message: str) -> str:
    user_lang = detect_language(user_message)

    translated_input = translate(user_message, source=user_lang, target="en")
    english_response = conversation.run(translated_input)
    final_response = translate(english_response, source="en", target=user_lang)

    return final_response