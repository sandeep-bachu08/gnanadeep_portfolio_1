"""FastAPI backend powered by Python and SQLite for A. Gnanadeep Sai's Portfolio."""

from __future__ import annotations

import re
import sqlite3
import time
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.database import get_db_connection, init_database
from backend.schemas import (
    CGPACalcRequest,
    CGPACalcResponse,
    ContactMessageCreate,
    ContactMessageOut,
    DSARunRequest,
    DSARunResponse,
    PythonExecutionRecord,
    SQLQueryRequest,
    SQLQueryResponse,
)

app = FastAPI(
    title="A. Gnanadeep Sai — Portfolio Python API",
    description="FastAPI + SQLite backend serving portfolio data, contact persistence, and interactive Python tools.",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_database()


def _log_execution(tool_type: str, input_summary: str, result_summary: str, execution_ms: float) -> None:
    with get_db_connection() as conn:
        conn.execute(
            """
            INSERT INTO python_executions (tool_type, input_summary, result_summary, execution_ms)
            VALUES (?, ?, ?, ?)
            """,
            (tool_type, input_summary[:240], result_summary[:240], round(execution_ms, 3)),
        )


@app.get("/api/health")
def health_check() -> dict[str, Any]:
    with get_db_connection(read_only=True) as conn:
        tables = [
            row["name"]
            for row in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
            ).fetchall()
        ]
    return {
        "status": "ok",
        "runtime": "Python FastAPI",
        "database": "SQLite",
        "tables": tables,
    }


@app.get("/api/profile")
def get_profile_data() -> dict[str, Any]:
    """Return structured education, semester SGPAs, skills, and languages directly from SQLite."""
    with get_db_connection(read_only=True) as conn:
        education = [dict(r) for r in conn.execute("SELECT * FROM education_history ORDER BY id").fetchall()]
        semesters = [
            dict(r) for r in conn.execute("SELECT * FROM academic_semesters ORDER BY semester_number").fetchall()
        ]
        skills = [dict(r) for r in conn.execute("SELECT * FROM skills ORDER BY id").fetchall()]
        languages = [dict(r) for r in conn.execute("SELECT * FROM languages ORDER BY id").fetchall()]

    return {
        "name": "A. Gnanadeep Sai",
        "university": "Jain University, Bangalore",
        "degree": "B.Tech – Artificial Intelligence and Machine Learning",
        "academic_status": "Second Year – Semester 3",
        "professional_status": "Fresher",
        "education": education,
        "semesters": semesters,
        "skills": skills,
        "languages": languages,
    }


@app.get("/api/contact", response_model=list[ContactMessageOut])
def list_contact_messages() -> list[ContactMessageOut]:
    """Fetch stored contact messages from SQLite ordered newest first."""
    with get_db_connection(read_only=True) as conn:
        rows = conn.execute(
            """
            SELECT id, sender_name, sender_email, subject, message, created_at
            FROM contact_messages
            ORDER BY id DESC
            LIMIT 50
            """
        ).fetchall()
    return [ContactMessageOut(**dict(row)) for row in rows]


@app.post("/api/contact", response_model=ContactMessageOut, status_code=201)
def create_contact_message(payload: ContactMessageCreate) -> ContactMessageOut:
    """Validate and persist a contact inquiry in SQLite."""
    email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    if not re.match(email_pattern, payload.sender_email.strip()):
        raise HTTPException(status_code=422, detail="Please enter a valid email address.")

    with get_db_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO contact_messages (sender_name, sender_email, subject, message)
            VALUES (?, ?, ?, ?)
            """,
            (
                payload.sender_name.strip(),
                payload.sender_email.strip(),
                payload.subject.strip(),
                payload.message.strip(),
            ),
        )
        new_id = cursor.lastrowid
        row = conn.execute(
            """
            SELECT id, sender_name, sender_email, subject, message, created_at
            FROM contact_messages
            WHERE id = ?
            """,
            (new_id,),
        ).fetchone()

    if not row:
        raise HTTPException(status_code=500, detail="Failed to save contact message.")
    return ContactMessageOut(**dict(row))


@app.delete("/api/contact/{message_id}")
def delete_contact_message(message_id: int) -> dict[str, Any]:
    """Delete a saved contact message by ID from SQLite."""
    with get_db_connection() as conn:
        cursor = conn.execute("DELETE FROM contact_messages WHERE id = ?", (message_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Message not found.")
    return {"deleted": True, "id": message_id}


def _merge_sort_trace(arr: list[int], steps: list[str]) -> list[int]:
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = _merge_sort_trace(arr[:mid], steps)
    right = _merge_sort_trace(arr[mid:], steps)
    merged: list[int] = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    steps.append(f"Merged {left} + {right} -> {merged}")
    return merged


def _quick_sort_trace(arr: list[int], steps: list[str]) -> list[int]:
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    less = [x for x in arr if x < pivot]
    equal = [x for x in arr if x == pivot]
    greater = [x for x in arr if x > pivot]
    steps.append(f"Pivot {pivot}: left={less}, mid={equal}, right={greater}")
    return _quick_sort_trace(less, steps) + equal + _quick_sort_trace(greater, steps)


@app.post("/api/python/dsa", response_model=DSARunResponse)
def run_python_dsa(payload: DSARunRequest) -> DSARunResponse:
    """Execute classic Python Data Structures & Algorithms routines with step-by-step traces."""
    start = time.perf_counter()
    steps: list[str] = []

    if payload.algorithm in ("merge_sort", "quick_sort"):
        nums = payload.numbers if payload.numbers is not None else [38, 27, 43, 3, 9, 82, 10]
        if len(nums) == 0:
            raise HTTPException(status_code=422, detail="Please provide at least one integer.")
        if payload.algorithm == "merge_sort":
            result: Any = _merge_sort_trace(nums, steps)
            complexity = "Time: O(n log n) | Space: O(n)"
        else:
            result = _quick_sort_trace(nums, steps)
            complexity = "Time: O(n log n) average | Space: O(log n)"
        input_summary = f"{payload.algorithm}({nums})"
        result_summary = f"Sorted -> {result}"

    elif payload.algorithm == "binary_search":
        nums = sorted(payload.numbers if payload.numbers is not None else [4, 11, 19, 27, 35, 48, 62])
        if len(nums) == 0:
            raise HTTPException(status_code=422, detail="Please provide at least one integer.")
        target = payload.target if payload.target is not None else nums[len(nums) // 2]
        steps.append(f"Sorted input array: {nums} | Target: {target}")
        low, high = 0, len(nums) - 1
        found_idx = -1
        while low <= high:
            mid = (low + high) // 2
            steps.append(f"Check index {mid} (value={nums[mid]}) within range [{low}, {high}]")
            if nums[mid] == target:
                found_idx = mid
                steps.append(f"Found target {target} at index {mid}")
                break
            elif nums[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        if found_idx == -1:
            steps.append(f"Target {target} not present in array.")
        result = {"found": found_idx != -1, "index": found_idx, "sorted_array": nums, "target": target}
        complexity = "Time: O(log n) | Space: O(1)"
        input_summary = f"binary_search({nums}, target={target})"
        result_summary = f"Index {found_idx}" if found_idx != -1 else "Not found"

    else:  # balanced_brackets
        expr = (payload.expression or "{[()()]}").strip()
        pairs = {")": "(", "]": "[", "}": "{"}
        opening = set(pairs.values())
        stack: list[str] = []
        balanced = True
        for idx, ch in enumerate(expr):
            if ch in opening:
                stack.append(ch)
                steps.append(f"Pos {idx}: push '{ch}' -> stack={stack}")
            elif ch in pairs:
                if not stack or stack[-1] != pairs[ch]:
                    steps.append(f"Pos {idx}: mismatch for '{ch}' (stack={stack})")
                    balanced = False
                    break
                popped = stack.pop()
                steps.append(f"Pos {idx}: pop '{popped}' matching '{ch}' -> stack={stack}")
        if balanced and stack:
            steps.append(f"End of input: unclosed brackets remain -> {stack}")
            balanced = False
        elif balanced:
            steps.append("Stack empty at end of expression -> Valid balanced brackets")
        result = {"balanced": balanced, "expression": expr, "remaining_stack": stack}
        complexity = "Time: O(n) | Space: O(n)"
        input_summary = f"balanced_brackets('{expr}')"
        result_summary = "Balanced" if balanced else "Unbalanced"

    elapsed_ms = (time.perf_counter() - start) * 1000
    _log_execution("Python DSA", input_summary, result_summary, elapsed_ms)

    return DSARunResponse(
        algorithm=payload.algorithm,
        result=result,
        steps=steps,
        complexity=complexity,
        execution_ms=round(elapsed_ms, 3),
    )


@app.post("/api/python/sql-query", response_model=SQLQueryResponse)
def execute_readonly_sql(payload: SQLQueryRequest) -> SQLQueryResponse:
    """Safely run a read-only SELECT query against the SQLite portfolio database."""
    raw_query = payload.query.strip().rstrip(";")
    normalized = re.sub(r"\s+", " ", raw_query).strip()

    if not re.match(r"^SELECT\b", normalized, re.IGNORECASE):
        raise HTTPException(
            status_code=400,
            detail="Only read-only SELECT queries are permitted in the SQLite query console.",
        )

    forbidden_pattern = r"\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|ATTACH|DETACH|PRAGMA|VACUUM|REINDEX)\b"
    if ";" in raw_query or re.search(forbidden_pattern, normalized, re.IGNORECASE):
        raise HTTPException(
            status_code=400,
            detail="Only single read-only SELECT statements are allowed.",
        )

    start = time.perf_counter()
    try:
        with get_db_connection(read_only=True) as conn:
            cursor = conn.execute(raw_query)
            columns = [desc[0] for desc in cursor.description] if cursor.description else []
            rows = [dict(row) for row in cursor.fetchmany(100)]
    except sqlite3.Error as exc:
        raise HTTPException(status_code=400, detail=f"SQLite error: {exc}") from exc

    elapsed_ms = (time.perf_counter() - start) * 1000
    _log_execution("SQLite Query", normalized, f"{len(rows)} row(s) returned", elapsed_ms)

    return SQLQueryResponse(
        columns=columns,
        rows=rows,
        row_count=len(rows),
        execution_ms=round(elapsed_ms, 3),
    )


@app.post("/api/python/cgpa", response_model=CGPACalcResponse)
def calculate_cgpa(payload: CGPACalcRequest) -> CGPACalcResponse:
    """Compute CGPA and target SGPA requirements using SQLite semester records."""
    start = time.perf_counter()

    with get_db_connection(read_only=True) as conn:
        rows = conn.execute(
            "SELECT semester_number, semester_label, sgpa, status FROM academic_semesters ORDER BY semester_number"
        ).fetchall()

    recorded = [dict(r) for r in rows]
    completed_sgpas = [float(r["sgpa"]) for r in recorded if r["sgpa"] is not None]
    if not completed_sgpas:
        raise HTTPException(status_code=500, detail="No completed semester records found in SQLite.")

    current_cgpa = sum(completed_sgpas) / len(completed_sgpas)

    valid_projected = [g for g in payload.projected_semesters if 0.0 <= g <= 10.0]
    combined = completed_sgpas + valid_projected
    projected_cgpa = sum(combined) / len(combined)

    remaining_count = max(0, payload.total_semesters - len(combined))
    required_avg: float | None = None
    target_achievable: bool | None = None

    if payload.target_cgpa is not None:
        if remaining_count > 0:
            required_total = payload.target_cgpa * payload.total_semesters
            needed = (required_total - sum(combined)) / remaining_count
            required_avg = round(needed, 2)
            target_achievable = 0.0 <= needed <= 10.0
        else:
            required_avg = None
            target_achievable = projected_cgpa >= payload.target_cgpa

    elapsed_ms = (time.perf_counter() - start) * 1000
    _log_execution(
        "Python CGPA",
        f"projected={valid_projected}, target={payload.target_cgpa}",
        f"Current={current_cgpa:.2f}, Projected={projected_cgpa:.2f}",
        elapsed_ms,
    )

    return CGPACalcResponse(
        recorded_semesters=recorded,
        current_cgpa=round(current_cgpa, 2),
        projected_cgpa=round(projected_cgpa, 2),
        required_avg_sgpa_for_target=required_avg,
        target_achievable=target_achievable,
        remaining_semesters_count=remaining_count,
        execution_ms=round(elapsed_ms, 3),
    )


@app.get("/api/python/history", response_model=list[PythonExecutionRecord])
def get_python_execution_history() -> list[PythonExecutionRecord]:
    """Return recent Python backend executions stored in SQLite."""
    with get_db_connection(read_only=True) as conn:
        rows = conn.execute(
            """
            SELECT id, tool_type, input_summary, result_summary, execution_ms, created_at
            FROM python_executions
            ORDER BY id DESC
            LIMIT 12
            """
        ).fetchall()
    return [PythonExecutionRecord(**dict(r)) for r in rows]


@app.delete("/api/python/history")
def clear_python_execution_history() -> dict[str, Any]:
    """Clear stored Python execution history from SQLite."""
    with get_db_connection() as conn:
        conn.execute("DELETE FROM python_executions")
    return {"cleared": True}
