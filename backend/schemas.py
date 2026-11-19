"""Pydantic request and response schemas for the FastAPI backend."""

from __future__ import annotations

from typing import Any, Literal, Optional
from pydantic import BaseModel, Field


class ContactMessageCreate(BaseModel):
    sender_name: str = Field(..., min_length=2, max_length=120)
    sender_email: str = Field(..., min_length=5, max_length=180)
    subject: str = Field(..., min_length=2, max_length=180)
    message: str = Field(..., min_length=5, max_length=2000)


class ContactMessageOut(BaseModel):
    id: int
    sender_name: str
    sender_email: str
    subject: str
    message: str
    created_at: str


class DSARunRequest(BaseModel):
    algorithm: Literal["merge_sort", "quick_sort", "binary_search", "balanced_brackets"]
    numbers: Optional[list[int]] = Field(default=None, max_length=32)
    target: Optional[int] = None
    expression: Optional[str] = Field(default=None, max_length=200)


class DSARunResponse(BaseModel):
    algorithm: str
    result: Any
    steps: list[str]
    complexity: str
    execution_ms: float


class SQLQueryRequest(BaseModel):
    query: str = Field(..., min_length=6, max_length=1000)


class SQLQueryResponse(BaseModel):
    columns: list[str]
    rows: list[dict[str, Any]]
    row_count: int
    execution_ms: float


class CGPACalcRequest(BaseModel):
    projected_semesters: list[float] = Field(default_factory=list, max_length=6)
    target_cgpa: Optional[float] = Field(default=None, ge=0.0, le=10.0)
    total_semesters: int = Field(default=8, ge=3, le=8)


class CGPACalcResponse(BaseModel):
    recorded_semesters: list[dict[str, Any]]
    current_cgpa: float
    projected_cgpa: float
    required_avg_sgpa_for_target: Optional[float]
    target_achievable: Optional[bool]
    remaining_semesters_count: int
    execution_ms: float


class PythonExecutionRecord(BaseModel):
    id: int
    tool_type: str
    input_summary: str
    result_summary: str
    execution_ms: float
    created_at: str
