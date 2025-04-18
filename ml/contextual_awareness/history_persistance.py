import json
import os
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

HISTORY_DIR = "chat_histories"
os.makedirs(HISTORY_DIR, exist_ok=True)

def get_history_path(user_id):
    return os.path.join(HISTORY_DIR, f"{user_id}_history.json")

def save_chat_history(memory, user_id):
    """Save conversation memory to file based on user ID."""
    messages = memory.chat_memory.messages
    serialized = [{"type": m.type, "content": m.content} for m in messages]
    with open(get_history_path(user_id), "w") as f:
        json.dump(serialized, f)

def load_chat_history(memory, user_id):
    """Load conversation memory from file (if exists) for a specific user."""
    path = get_history_path(user_id)
    if not os.path.exists(path):
        return

    with open(path, "r") as f:
        serialized = json.load(f)

    message_map = {
        "human": HumanMessage,
        "ai": AIMessage,
        "system": SystemMessage,
    }

    for msg in serialized:
        msg_class = message_map.get(msg["type"])
        if msg_class:
            memory.chat_memory.add_message(msg_class(content=msg["content"]))
