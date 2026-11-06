import {
  QuestionListResponse, Question, FilterMetadata,
  ExamTemplate, ExamSession, ExamResult, AnswerSubmissionItem,
  ResourceItem, CurrentAffairItem, ProbableQuestion,
  AIChatMessage, AIChatResponse, CollectionItem, AdminStats
} from "./types";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  return process.env.INTERNAL_API_URL || "http://127.0.0.1:8000/api/v1";
};

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = url.startsWith("http") ? url : `${getBaseUrl()}${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const err = await res.json();
      if (err.detail) errorDetail = typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail);
    } catch (_) {}
    throw new Error(errorDetail);
  }

  return res.json();
}

// ================= QUESTION BANK APIS =================
export async function getFilterMetadata(): Promise<FilterMetadata> {
  return fetchJson<FilterMetadata>("/questions/meta/filters");
}

export async function getQuestions(params: {
  page?: number;
  page_size?: number;
  q?: string;
  category_id?: number | string;
  organization_id?: number | string;
  examination_id?: number | string;
  subject_id?: number | string;
  topic_id?: number | string;
  year?: number | string;
  difficulty?: string;
  language?: string;
  question_type?: string;
}): Promise<QuestionListResponse> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== "" && val !== "ALL") {
      searchParams.append(key, String(val));
    }
  });
  return fetchJson<QuestionListResponse>(`/questions?${searchParams.toString()}`);
}

export async function getQuestionById(id: number): Promise<Question> {
  return fetchJson<Question>(`/questions/${id}`);
}

export async function reportQuestion(id: number, reason: string, details?: string) {
  return fetchJson(`/questions/${id}/report`, {
    method: "POST",
    body: JSON.stringify({ reason, details }),
  });
}

// ================= EXAM HALL APIS =================
export async function getExamTemplates(): Promise<ExamTemplate[]> {
  return fetchJson<ExamTemplate[]>("/exams/templates");
}

export async function startExam(config: {
  template_id?: number;
  mode?: string;
  title?: string;
  subject_ids?: number[];
  topic_ids?: number[];
  examination_id?: number;
  category_id?: number;
  total_questions?: number;
  duration_minutes?: number;
  negative_mark_rate?: number;
  difficulty?: string;
  question_source?: string;
}): Promise<ExamSession> {
  return fetchJson<ExamSession>("/exams/start", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function submitExam(submission: {
  session_id: string;
  title: string;
  duration_minutes: number;
  time_taken_seconds: number;
  negative_mark_rate: number;
  answers: AnswerSubmissionItem[];
}): Promise<ExamResult> {
  return fetchJson<ExamResult>("/exams/submit", {
    method: "POST",
    body: JSON.stringify(submission),
  });
}

// ================= STUDY RESOURCES APIS =================
export async function getResources(params?: {
  subject_id?: number | string;
  topic_id?: number | string;
  resource_type?: string;
  q?: string;
}): Promise<ResourceItem[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && val !== "ALL") {
        searchParams.append(key, String(val));
      }
    });
  }
  return fetchJson<ResourceItem[]>(`/resources?${searchParams.toString()}`);
}

export async function getResourceById(id: number): Promise<ResourceItem> {
  return fetchJson<ResourceItem>(`/resources/${id}`);
}

// ================= PROBABLE QUESTIONS APIS =================
export async function generateProbableQuestions(data: {
  target_exam: string;
  subject_id: number;
  topic_id?: number;
  topic_name?: string;
  difficulty?: string;
  language?: string;
  question_count?: number;
  additional_instructions?: string;
}): Promise<ProbableQuestion[]> {
  return fetchJson<ProbableQuestion[]>("/probable/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function saveProbableToBank(payload: any) {
  return fetchJson("/probable/save-to-bank", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ================= CURRENT AFFAIRS APIS =================
export async function getCurrentAffairs(params?: {
  category?: string;
  q?: string;
}): Promise<CurrentAffairItem[]> {
  const searchParams = new URLSearchParams();
  if (params) {
    if (params.category && params.category !== "ALL") searchParams.append("category", params.category);
    if (params.q) searchParams.append("q", params.q);
  }
  return fetchJson<CurrentAffairItem[]>(`/current-affairs?${searchParams.toString()}`);
}

export async function getCurrentAffairById(id: number): Promise<CurrentAffairItem> {
  return fetchJson<CurrentAffairItem>(`/current-affairs/${id}`);
}

export async function generateCurrentAffairsMcqs(id: number) {
  return fetchJson(`/current-affairs/${id}/generate-mcqs`, {
    method: "POST",
  });
}

// ================= AI ASSISTANT APIS =================
export async function chatProstutiAI(data: {
  messages: AIChatMessage[];
  context_type?: string;
  context_data?: any;
}): Promise<AIChatResponse> {
  return fetchJson<AIChatResponse>("/ai/chat", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ================= COLLECTIONS & BOOKMARKS =================
export async function getCollections(): Promise<CollectionItem[]> {
  return fetchJson<CollectionItem[]>("/collections");
}

export async function createCollection(name: string, description?: string): Promise<CollectionItem> {
  return fetchJson<CollectionItem>("/collections", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function getCollectionQuestions(collectionId: number): Promise<Question[]> {
  return fetchJson<Question[]>(`/collections/${collectionId}/questions`);
}

export async function addQuestionToCollection(collectionId: number, questionId: number) {
  return fetchJson(`/collections/${collectionId}/items?question_id=${questionId}`, {
    method: "POST",
  });
}

export async function removeQuestionFromCollection(collectionId: number, questionId: number) {
  return fetchJson(`/collections/${collectionId}/items/${questionId}`, {
    method: "DELETE",
  });
}

export async function getBookmarks(): Promise<any[]> {
  return fetchJson<any[]>("/collections/bookmarks/all");
}

export async function addBookmark(item_type: string, item_id: number, notes?: string) {
  return fetchJson("/collections/bookmarks", {
    method: "POST",
    body: JSON.stringify({ item_type, item_id, notes }),
  });
}

export async function removeBookmark(id: number) {
  return fetchJson(`/collections/bookmarks/${id}`, {
    method: "DELETE",
  });
}

// ================= ADMIN APIS =================
export async function getAdminStats(): Promise<AdminStats> {
  return fetchJson<AdminStats>("/admin/stats");
}

export async function getReportedQuestions(): Promise<any[]> {
  return fetchJson<any[]>("/admin/reports");
}

export async function updateReportStatus(id: number, status: string) {
  return fetchJson(`/admin/reports/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
