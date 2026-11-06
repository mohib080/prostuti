export interface ExamCategory {
  id: number;
  name: string;
  name_bn: string;
  slug: string;
  description?: string;
  display_order: number;
}

export interface Organization {
  id: number;
  name: string;
  name_bn: string;
  code: string;
  category_id?: number;
  description?: string;
}

export interface Topic {
  id: number;
  subject_id: number;
  name: string;
  name_bn: string;
  description?: string;
}

export interface Subject {
  id: number;
  name: string;
  name_bn: string;
  code: string;
  icon: string;
  total_marks_default: number;
  topics?: Topic[];
}

export interface Examination {
  id: number;
  name: string;
  name_bn: string;
  year?: number;
  total_marks: number;
  duration_minutes: number;
  negative_mark_rate: number;
}

export interface Question {
  id: number;
  question_text: string;
  question_text_bn?: string;
  options: string[];
  correct_option_index: number;
  explanation?: string;
  explanation_bn?: string;
  subject_id: number;
  topic_id?: number;
  examination_id?: number;
  organization_id?: number;
  category_id?: number;
  year?: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  language: "BN" | "EN";
  question_type: "AUTHENTIC_PREVIOUS" | "PRACTICE" | "AI_GENERATED";
  source_reference?: string;
  is_verified: boolean;
  is_active: boolean;
  report_count: number;
  created_at: string;
  subject_name?: string;
  subject_name_bn?: string;
  topic_name?: string;
  exam_name?: string;
  org_name?: string;
  category_name?: string;
}

export interface QuestionListResponse {
  total: number;
  page: number;
  page_size: number;
  questions: Question[];
}

export interface FilterMetadata {
  categories: ExamCategory[];
  organizations: Organization[];
  examinations: Examination[];
  subjects: Subject[];
  years: number[];
}

export interface ExamTemplate {
  id: number;
  title: string;
  title_bn: string;
  exam_type: string;
  target_exam: string;
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
  negative_mark_rate: number;
  description?: string;
  configuration?: Record<string, any>;
}

export interface ExamQuestion {
  id: number;
  question_text: string;
  question_text_bn?: string;
  options: string[];
  subject_name?: string;
  subject_name_bn?: string;
  topic_name?: string;
  exam_name?: string;
  year?: number;
  difficulty: string;
  language: string;
}

export interface ExamSession {
  session_id: string;
  title: string;
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
  negative_mark_rate: number;
  questions: ExamQuestion[];
}

export interface AnswerSubmissionItem {
  question_id: number;
  selected_option_index: number | null;
  time_spent_seconds?: number;
  marked_for_review?: boolean;
}

export interface ExamQuestionReviewItem {
  question_id: number;
  question_text: string;
  options: string[];
  selected_option_index: number | null;
  correct_option_index: number;
  is_correct: boolean;
  is_unanswered: boolean;
  explanation?: string;
  explanation_bn?: string;
  source_reference?: string;
  subject_name?: string;
  topic_name?: string;
}

export interface ExamResult {
  attempt_id: number;
  title: string;
  total_questions: number;
  total_marks: number;
  obtained_marks: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  negative_marks_deducted: number;
  percentage: number;
  passed: boolean;
  time_taken_seconds: number;
  reviews: ExamQuestionReviewItem[];
}

export interface ResourceItem {
  id: number;
  title: string;
  title_bn: string;
  subject_id: number;
  topic_id?: number;
  resource_type: string;
  summary?: string;
  content_markdown?: string;
  file_url?: string;
  author: string;
  tags?: string;
  is_featured: boolean;
  created_at: string;
  subject_name?: string;
  subject_name_bn?: string;
}

export interface CurrentAffairItem {
  id: number;
  title: string;
  title_bn: string;
  category: string;
  summary: string;
  full_content?: string;
  important_facts: string[];
  source_name?: string;
  source_url?: string;
  publish_date: string;
  mcqs: Array<{
    question_text: string;
    options: string[];
    correct_option_index: number;
    explanation?: string;
  }>;
}

export interface ProbableQuestion {
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
  subject_name: string;
  topic_name: string;
  difficulty: string;
  curriculum_relevance: string;
  frequently_repeated_concept: boolean;
  is_ai_generated: boolean;
}

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIChatResponse {
  reply: string;
  suggested_followups: string[];
  grounding_references: string[];
}

export interface CollectionItem {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
  question_count: number;
  created_at: string;
}

export interface AdminStats {
  total_questions: number;
  authentic_questions: number;
  ai_questions: number;
  practice_questions: number;
  total_exams: number;
  total_subjects: number;
  total_resources: number;
  total_current_affairs: number;
  pending_reports: number;
}
