import sqlite3
import json
from datetime import datetime
from constants import DB_PATH


class IngestService:
    def __init__(self, db_path=DB_PATH):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.cursor = self.conn.cursor()

    def create_knowledge_source(self, file_urls: list[str]):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        json_urls = json.dumps(file_urls)
        self.cursor.execute(
            """
            INSERT INTO knowledge_sources (file_urls, created_at, updated_at)
            VALUES (?, ?, ?)
        """,
            (json_urls, now, now),
        )
        self.conn.commit()
        return [self.cursor.lastrowid]

    def get_knowledge_sources(self):
        self.cursor.execute("SELECT * FROM knowledge_sources")
        rows = self.cursor.fetchall()
        sources = []
        for row in rows:
            sources.append(
                {
                    "id": row[0],
                    "file_urls": json.loads(row[1]) if row[1] else [],
                    "created_at": row[2],
                    "updated_at": row[3],
                }
            )
        return sources

    def update_knowledge_source(self, source_id: int, file_urls: list[str]):
        if file_urls is None:
            return False  # Don't update if no file_urls provided
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        json_urls = json.dumps(file_urls)
        self.cursor.execute(
            """
            UPDATE knowledge_sources
            SET file_urls = ?, updated_at = ?
            WHERE id = ?
        """,
            (json_urls, current_time, source_id),
        )
        self.conn.commit()
        return self.cursor.rowcount > 0

    def delete_knowledge_source(self, source_id: int):
        self.cursor.execute("DELETE FROM knowledge_sources WHERE id = ?", (source_id,))
        self.conn.commit()
        return self.cursor.rowcount > 0

    def __del__(self):
        self.conn.close()
