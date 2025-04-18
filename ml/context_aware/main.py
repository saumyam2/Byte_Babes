# main.py

from inclusive_memory_chat import create_inclusive_context_chatbot

def run_chatbot():
    chatbot = create_inclusive_context_chatbot()
    print("\n--- Inclusive Context-Aware Chatbot ---")
    print("Type 'exit' to quit\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        response = chatbot.run(user_input)
        print("Bot:", response)

if __name__ == "__main__":
    run_chatbot()
