from constants import PROMPT


def format_prompt_for_continuous_learning(sessions):
    lines = [PROMPT, "Here are recent Continuous Learning Sessions:\n"]

    for idx, session in enumerate(sessions, 1):
        category = session.get("category", "N/A")
        feedback = session.get("details", "N/A")
        conversation = session.get("conversation", [])

        lines.append(f"Session {idx}:")
        lines.append(f"- Category: {category}")
        lines.append(f"- Feedback: {feedback}")
        lines.append("Conversation:")

        for entry in conversation:
            sender = entry.get("sender", "Unknown")
            message = entry.get("message", "").strip()
            if message:
                lines.append(f"  {sender}: {message}")

        lines.append("")  # Add a blank line after each session

    return "\n".join(lines).strip()


if __name__ == "__main__":
    sessions = [
        {
            "category": "Feedback",
            "details": "User expressed satisfaction with the response speed.",
            "conversation": [
                {"sender": "User", "message": "How fast are you?"},
                {"sender": "AI", "message": "I can respond almost instantly."},
            ],
        },
        {
            "category": "Feedback",
            "details": "User requested more detailed explanations.",
            "conversation": [
                {"sender": "User", "message": "Can you explain that in detail?"},
                {"sender": "AI", "message": "Sure, here's a detailed explanation."},
            ],
        },
    ]

    formatted_prompt = format_prompt_for_continuous_learning(sessions)
    print(formatted_prompt)
