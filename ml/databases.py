import sqlite3
import os
from constants import DB_PATH


def initialize_db():
    # Create necessary directories
    os.makedirs("_data", exist_ok=True)
    os.makedirs("_data/files", exist_ok=True)

    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    cursor = conn.cursor()

    # Create knowledge_sources table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS knowledge_sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_urls TEXT,  -- JSON array of uploaded file URLs
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    initialize_db()
    print("Database initialized successfully.")
