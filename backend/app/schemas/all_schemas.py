from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from datetime import datetime

# ================= USER SCHEMAS =================
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True


# ================= CATEGORY & SUBJECT SCHEMAS =================
class ExamCategoryOut(BaseModel):
    id: int
    name: str
    name_bn: str
    slug: str
    description: Optional[str] = None
    display_order: int
    class Config:
        from_attributes = True

class OrganizationOut(BaseModel):
    id: int
    name: str
    name_bn: str
    code: str
    category_id: Optional[int] = None
    description: Optional[str] = None
    class Config:
        from_attributes = True

class TopicOut(BaseModel):
    id: int
    subject_id: int
    name: str
    name_bn: str
    description: Optional[str] = None
    class Config:
        from_attributes = True

class SubjectOut(BaseModel):
    id: int
    name: str
    name_bn: str
    code: str
    icon: str
    total_marks_default: int
    topics: List[TopicOut] = []
    class Config:
        from_attributes = True

class ExaminationOut(BaseModel):
    id: int
    organization_id: Optional[int] = None
    category_id: Optional[int] = None
    name: str
    name_bn: str
    year: Optional[int] = None
    total_marks: float
    duration_minutes: int
    negative_mark_rate: float
    class Config:
        from_attributes = True


# ================= QUESTION SCHEMAS =================
class QuestionBase(BaseModel):
    question_text: str
    question_text_bn: Optional[str] = None
    options: List[str]
    correct_option_index: int
    explanation: Optional[str] = None
    explanation_bn: Optional[str] = None
    subject_id: int
    topic_id: Optional[int] = None
    examination_id: Optional[int] = None
    organization_id: Optional[int] = None
    category_id: Optional[int] = None
    year: Optional[int] = None
    difficulty: str = "MEDIUM"
    language: str = "BN"
    question_type: str = "AUTHENTIC_PREVIOUS"
    source_reference: Optional[str] = None

class QuestionCreate(QuestionBase):
    pass

class QuestionOut(QuestionBase):
    id: int
    is_verified: bool
    is_active: bool
    report_count: int
    created_at: datetime
    subject_name: Optional[str] = None
    subject_name_bn: Optional[str] = None
    topic_name: Optional[str] = None
    exam_name: Optional[str] = None
    org_name: Optional[str] = None
    category_name: Optional[str] = None
    class Config:
        from_attributes = True

class QuestionListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    questions: List[QuestionOut]


# ================= EXAM SCHEMAS =================
class ExamTemplateOut(BaseModel):
    id: int
    title: str
    title_bn: str
    exam_type: str
    target_exam: str
    duration_minutes: int
    total_questions: int
    total_marks: float
    negative_mark_rate: float
    description: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None
    class Config:
        from_attributes = True

class ExamStartRequest(BaseModel):
    template_id: Optional[int] = None
    mode: str = "FULL_MOCK"  # FULL_MOCK, SUBJECT_WISE, TOPIC_WISE, PREVIOUS_SIMULATION, CUSTOM, RANDOM_CHALLENGE
    title: Optional[str] = None
    subject_ids: Optional[List[int]] = None
    topic_ids: Optional[List[int]] = None
    examination_id: Optional[int] = None
    category_id: Optional[int] = None
    total_questions: int = 50
    duration_minutes: int = 40
    negative_mark_rate: float = 0.5
    difficulty: Optional[str] = None
    question_source: str = "ALL"  # ALL, AUTHENTIC_ONLY, GENERATED_ONLY

class ExamQuestionOut(BaseModel):
    id: int
    question_text: str
    question_text_bn: Optional[str] = None
    options: List[str]
    subject_name: Optional[str] = None
    subject_name_bn: Optional[str] = None
    topic_name: Optional[str] = None
    exam_name: Optional[str] = None
    year: Optional[int] = None
    difficulty: str
    language: str

class ExamSessionOut(BaseModel):
    session_id: str
    title: str
    duration_minutes: int
    total_questions: int
    total_marks: float
    negative_mark_rate: float
    questions: List[ExamQuestionOut]

class AnswerSubmissionItem(BaseModel):
    question_id: int
    selected_option_index: Optional[int] = None  # None if skipped
    time_spent_seconds: Optional[int] = 0
    marked_for_review: Optional[bool] = False

class ExamSubmissionRequest(BaseModel):
    session_id: str
    title: str
    duration_minutes: int
    time_taken_seconds: int
    negative_mark_rate: float
    answers: List[AnswerSubmissionItem]

class ExamQuestionReviewItem(BaseModel):
    question_id: int
    question_text: str
    options: List[str]
    selected_option_index: Optional[int]
    correct_option_index: int
    is_correct: bool
    is_unanswered: bool
    explanation: Optional[str] = None
    explanation_bn: Optional[str] = None
    source_reference: Optional[str] = None
    subject_name: Optional[str] = None
    topic_name: Optional[str] = None

class ExamResultOut(BaseModel):
    attempt_id: int
    title: str
    total_questions: int
    total_marks: float
    obtained_marks: float
    correct_count: int
    incorrect_count: int
    unanswered_count: int
    negative_marks_deducted: float
    percentage: float
    passed: bool
    time_taken_seconds: int
    reviews: List[ExamQuestionReviewItem]


# ================= RESOURCE SCHEMAS =================
class ResourceOut(BaseModel):
    id: int
    title: str
    title_bn: str
    subject_id: int
    topic_id: Optional[int] = None
    resource_type: str
    summary: Optional[str] = None
    content_markdown: Optional[str] = None
    file_url: Optional[str] = None
    author: str
    tags: Optional[str] = None
    is_featured: bool
    created_at: datetime
    subject_name: Optional[str] = None
    subject_name_bn: Optional[str] = None
    class Config:
        from_attributes = True


# ================= CURRENT AFFAIRS SCHEMAS =================
class CurrentAffairOut(BaseModel):
    id: int
    title: str
    title_bn: str
    category: str
    summary: str
    full_content: Optional[str] = None
    important_facts: List[str] = []
    source_name: Optional[str] = None
    source_url: Optional[str] = None
    publish_date: datetime
    mcqs: List[Dict[str, Any]] = []
    class Config:
        from_attributes = True


# ================= PROBABLE QUESTIONS SCHEMAS =================
class ProbableGenerateRequest(BaseModel):
    target_exam: str = "47th BCS Preliminary"
    subject_id: int
    topic_id: Optional[int] = None
    topic_name: Optional[str] = None
    difficulty: str = "MEDIUM"
    language: str = "BN"
    question_count: int = 5
    additional_instructions: Optional[str] = None

class ProbableQuestionItem(BaseModel):
    question_text: str
    options: List[str]
    correct_option_index: int
    explanation: str
    subject_name: str
    topic_name: str
    difficulty: str
    curriculum_relevance: str
    frequently_repeated_concept: bool = True
    is_ai_generated: bool = True


# ================= AI ASSISTANT SCHEMAS =================
class AIChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str

class AIChatRequest(BaseModel):
    messages: List[AIChatMessage]
    context_type: Optional[str] = "GENERAL"  # GENERAL, QUESTION_EXPLANATION, MATH_SOLVER, WRITTEN_PREP, RAG_DOCUMENT
    context_data: Optional[Dict[str, Any]] = None

class AIChatResponse(BaseModel):
    reply: str
    suggested_followups: List[str] = []
    grounding_references: List[str] = []


# ================= COLLECTIONS & BOOKMARKS =================
class CollectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = False

class CollectionOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_public: bool
    question_count: int = 0
    created_at: datetime
    class Config:
        from_attributes = True

class BookmarkCreate(BaseModel):
    item_type: str  # QUESTION, RESOURCE, CURRENT_AFFAIR
    item_id: int
    notes: Optional[str] = None

class BookmarkOut(BaseModel):
    id: int
    item_type: str
    item_id: int
    notes: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class ReportQuestionCreate(BaseModel):
    question_id: int
    reason: str
    details: Optional[str] = None
