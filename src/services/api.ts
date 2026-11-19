export interface ContactMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface ContactMessagePayload {
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
}

export type DSAAlgorithm =
  | 'merge_sort'
  | 'quick_sort'
  | 'binary_search'
  | 'balanced_brackets';

export interface DSARunPayload {
  algorithm: DSAAlgorithm;
  numbers?: number[];
  target?: number;
  expression?: string;
}

export interface DSARunResult {
  algorithm: string;
  result: unknown;
  steps: string[];
  complexity: string;
  execution_ms: number;
}

export interface SQLQueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  row_count: number;
  execution_ms: number;
}

export interface CGPACalcPayload {
  projected_semesters: number[];
  target_cgpa?: number | null;
  total_semesters?: number;
}

export interface CGPACalcResult {
  recorded_semesters: {
    semester_number: number;
    semester_label: string;
    sgpa: number | null;
    status: string;
  }[];
  current_cgpa: number;
  projected_cgpa: number;
  required_avg_sgpa_for_target: number | null;
  target_achievable: boolean | null;
  remaining_semesters_count: number;
  execution_ms: number;
}

export interface PythonExecutionRecord {
  id: number;
  tool_type: string;
  input_summary: string;
  result_summary: string;
  execution_ms: number;
  created_at: string;
}

async function handleJsonResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      typeof data?.detail === 'string'
        ? data.detail
        : Array.isArray(data?.detail)
          ? data.detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(', ')
          : 'Request to Python FastAPI backend failed.';
    throw new Error(detail);
  }
  return data as T;
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch('/api/contact');
  return handleJsonResponse<ContactMessage[]>(res);
}

export async function submitContactMessage(
  payload: ContactMessagePayload
): Promise<ContactMessage> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<ContactMessage>(res);
}

export async function deleteContactMessage(id: number): Promise<{ deleted: boolean; id: number }> {
  const res = await fetch(`/api/contact/${id}`, {
    method: 'DELETE',
  });
  return handleJsonResponse<{ deleted: boolean; id: number }>(res);
}

export async function runPythonDSA(payload: DSARunPayload): Promise<DSARunResult> {
  const res = await fetch('/api/python/dsa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<DSARunResult>(res);
}

export async function runReadOnlySQL(query: string): Promise<SQLQueryResult> {
  const res = await fetch('/api/python/sql-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return handleJsonResponse<SQLQueryResult>(res);
}

export async function runCGPACalculator(payload: CGPACalcPayload): Promise<CGPACalcResult> {
  const res = await fetch('/api/python/cgpa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<CGPACalcResult>(res);
}

export async function fetchPythonHistory(): Promise<PythonExecutionRecord[]> {
  const res = await fetch('/api/python/history');
  return handleJsonResponse<PythonExecutionRecord[]>(res);
}

export async function clearPythonHistory(): Promise<{ cleared: boolean }> {
  const res = await fetch('/api/python/history', {
    method: 'DELETE',
  });
  return handleJsonResponse<{ cleared: boolean }>(res);
}
