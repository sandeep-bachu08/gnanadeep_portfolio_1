"""SQLite database initialization and helper functions for A. Gnanadeep Sai's portfolio."""

from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from typing import Iterator

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "portfolio.db")


@contextmanager
def get_db_connection(read_only: bool = False) -> Iterator[sqlite3.Connection]:
    """Yield a SQLite connection configured with Row access."""
    if read_only:
        conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True, check_same_thread=False)
    else:
        conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        if not read_only:
            conn.commit()
    finally:
        conn.close()


def init_database() -> None:
    """Create tables if they do not exist and seed factual portfolio records."""
    with get_db_connection() as conn:
        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS education_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stage_code TEXT UNIQUE NOT NULL,
                degree TEXT NOT NULL,
                branch TEXT,
                institution TEXT NOT NULL,
                duration TEXT,
                current_status TEXT
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS academic_semesters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                semester_number INTEGER UNIQUE NOT NULL,
                semester_label TEXT NOT NULL,
                sgpa REAL,
                status TEXT NOT NULL
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                description TEXT NOT NULL
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS languages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                language TEXT UNIQUE NOT NULL,
                proficiency TEXT NOT NULL
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_name TEXT NOT NULL,
                sender_email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS python_executions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tool_type TEXT NOT NULL,
                input_summary TEXT NOT NULL,
                result_summary TEXT NOT NULL,
                execution_ms REAL NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )

        education_seed = [
            (
                "btech",
                "B.Tech – Artificial Intelligence and Machine Learning",
                "Artificial Intelligence and Machine Learning",
                "Jain University, Bangalore",
                "2025–2029",
                "Second Year – Semester 3",
            ),
            (
                "intermediate",
                "Intermediate",
                None,
                "Sri Chaitanya Junior College",
                None,
                "Completed",
            ),
            (
                "tenth",
                "10th Standard",
                None,
                "Keshava Reddy EM School",
                None,
                "Completed",
            ),
        ]
        cursor.executemany(
            """
            INSERT OR IGNORE INTO education_history
            (stage_code, degree, branch, institution, duration, current_status)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            education_seed,
        )

        semester_seed = [
            (1, "Semester 1", 6.75, "Completed"),
            (2, "Semester 2", 6.60, "Completed"),
            (3, "Semester 3", None, "Current Semester"),
        ]
        cursor.executemany(
            """
            INSERT OR IGNORE INTO academic_semesters
            (semester_number, semester_label, sgpa, status)
            VALUES (?, ?, ?, ?)
            """,
            semester_seed,
        )

        skills_seed = [
            (
                "python",
                "Python",
                "Core language for structured programming, algorithmic problem-solving, object-oriented design, and Artificial Intelligence and Machine Learning coursework.",
            ),
            (
                "sql",
                "SQL",
                "Structured Query Language for designing relational database schemas, managing structured records, writing joins, and performing analytical queries.",
            ),
            (
                "data-structures",
                "Data Structures",
                "Organization and manipulation of data using linear and non-linear structures to write efficient, well-structured algorithms.",
            ),
        ]
        cursor.executemany(
            """
            INSERT OR IGNORE INTO skills (slug, name, description)
            VALUES (?, ?, ?)
            """,
            skills_seed,
        )

        languages_seed = [
            ("Telugu", "Native"),
            ("English", "Professional"),
            ("Tamil", "Conversational"),
        ]
        cursor.executemany(
            """
            INSERT OR IGNORE INTO languages (language, proficiency)
            VALUES (?, ?)
            """,
            languages_seed,
        )
