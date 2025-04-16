# # context_aware_memory.py
# import os
# from langchain.memory import CombinedMemory, ConversationBufferMemory
# from langchain.memory import ConversationBufferWindowMemory, ConversationSummaryMemory
# from langchain_groq import ChatGroq

# def create_context_aware_memory():
#     llm = ChatGroq(
#         groq_api_key=os.environ["GROQ_API_KEY"],
#         model_name="llama3-8b-8192"
#     )

#     # window_memory = ConversationBufferWindowMemory(
#     #     k=5,
#     #     memory_key="chat_history",
#     #     return_messages=True
#     # )

#     # summary_memory = ConversationSummaryMemory(
#     #     llm=llm,
#     #     memory_key="summary_chat_history",
#     #     return_messages=True
#     # )
    
#     # combined_memory = CombinedMemory(
#     #     memories=[window_memory, summary_memory]
#     # )

#     window_memory = ConversationBufferMemory(memory_key="chat_history", k=5)
#     summary_memory = ConversationSummaryMemory(memory_key="summary_chat_history")
#     combined_memory = CombinedMemory(
#         memories=[window_memory, summary_memory],
#         input_keys=["human_input"],  # Ensure the input keys are correctly set
#         output_keys=["summary_chat_history"]
#     )

#     return combined_memory
import os
from langchain.memory import CombinedMemory, ConversationBufferMemory
from langchain.memory import ConversationSummaryMemory
from langchain_groq import ChatGroq

def create_context_aware_memory():
    llm = ChatGroq(
        groq_api_key=os.environ["GROQ_API_KEY"],
        model_name="llama3-8b-8192"
    )

    window_memory = ConversationBufferMemory(memory_key="chat_history")
    summary_memory = ConversationSummaryMemory(memory_key="summary_chat_history", llm=llm)

    combined_memory = CombinedMemory(
        memories=[window_memory, summary_memory],
        input_keys=["human_input"],  
        output_keys=["summary_chat_history"]  
    )

    return combined_memory
