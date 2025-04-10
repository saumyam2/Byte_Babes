import os

# Database paths
DB_PATH = os.path.join("_data", "database.db")

# Prompt for LLM
PROMPT = (
    "You are an LLM designed for continuous self-improvement through structured session feedback and conversation history.\n"
    "The following data has negative feedback, use it to identify weaknesses and guide your next learning cycle.\n"
    "Your goal is to enhance performance, align with user expectations and reduce incorrect, biased and irrelavant responses.\n\n"
)
