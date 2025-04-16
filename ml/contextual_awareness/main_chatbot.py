# import os
# from langchain.chains import LLMChain
# from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
# from langchain_core.messages import SystemMessage
# from langchain.chains.conversation.memory import ConversationBufferWindowMemory
# from langchain_groq import ChatGroq
# from history_persistance import load_chat_history, save_chat_history
# from context_aware_memory import create_context_aware_memory
# from dotenv import load_dotenv

# load_dotenv()

# groq_api_key = os.environ.get("GROQ_API_KEY") 
# model = "llama3-8b-8192"

# groq_chat = ChatGroq(
#     groq_api_key=groq_api_key,
#     model_name=model,
# )

# system_prompt = "You are a friendly AI assistant that remembers the user's context and gives helpful answers."

# prompt_template = ChatPromptTemplate.from_messages(
#     [
#         SystemMessage(content=system_prompt),
#         MessagesPlaceholder(variable_name="chat_history"),
#         HumanMessagePromptTemplate.from_template("{human_input}"),
#     ]
# )

# user_id = input("Enter your username or ID: ").strip()

# memory = create_context_aware_memory()
# window_memory = memory.memories[0] 

# load_chat_history(window_memory, user_id)

# conversation = LLMChain(
#     llm=groq_chat,
#     prompt=prompt_template,
#     memory=memory,
#     verbose=False,
# )

# print("Hi! Ask me anything. Type 'exit' to quit.")
# while True:
#     user_question = input("You: ")
#     if user_question.lower() in ["exit", "quit"]:
#         break

#     response = conversation.predict(human_input=user_question)
#     print("Chatbot:", response)

#     save_chat_history(window_memory, user_id)

import os
from langchain.chains import LLMChain
from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_groq import ChatGroq
from history_persistance import load_chat_history, save_chat_history

groq_api_key = os.environ.get("GROQ_API_KEY") 
model = "llama3-8b-8192"

groq_chat = ChatGroq(
    groq_api_key=groq_api_key,
    model_name=model,
)

system_prompt = "You are a friendly AI assistant that remembers the user's context and gives helpful answers."

prompt_template = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content=system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        HumanMessagePromptTemplate.from_template("{human_input}"),
    ]
)

user_id = input("Enter your username or ID: ").strip()

memory = ConversationBufferWindowMemory(k=5, memory_key="chat_history", return_messages=True)
load_chat_history(memory, user_id)

conversation = LLMChain(
    llm=groq_chat,
    prompt=prompt_template,
    memory=memory,
    verbose=False,
)

print("Hi! Ask me anything. Type 'exit' to quit.")
while True:
    user_question = input("You: ")
    if user_question.lower() in ["exit", "quit"]:
        break

    response = conversation.predict(human_input=user_question)
    print("Chatbot:", response)

    save_chat_history(memory, user_id)
