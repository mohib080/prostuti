import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="student")  # admin, student, moderator
    hashed_password = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    collections = relationship("Collection", back_populates="user", cascade="all, delete-orphan")
    exam_attempts = relationship("ExamAttempt", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")


class ExamCategory(Base):
    __tablename__ = "exam_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # Civil Service, Bank, etc.
    name_bn = Column(String(100), nullable=False)  # সিভিল সার্ভিস (বিসিএস), ব্যাংক, ইত্যাদি
    slug = Column(String(100), unique=True, index=True)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)

    organizations = relationship("Organization", back_populates="category")
    questions = relationship("Question", back_populates="category")


class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    name_bn = Column(String(200), nullable=False)
    code = Column(String(50), index=True)  # BPSC, BB, NTRCA, DPE
    category_id = Column(Integer, ForeignKey("exam_categories.id"), nullable=True)
    description = Column(Text, nullable=True)

    category = relationship("ExamCategory", back_populates="organizations")
    examinations = relationship("Examination", back_populates="organization")
    questions = relationship("Question", back_populates="organization")


class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    name_bn = Column(String(150), nullable=False)
    code = Column(String(50), unique=True, index=True)  # BANGLA, ENGLISH, BD_AFFAIRS, etc.
    icon = Column(String(50), default="book")
    total_marks_default = Column(Integer, default=30)

    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="subject")
    resources = relationship("Resource", back_populates="subject")


class Topic(Base):
    __tablename__ = "topics"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    name = Column(String(200), nullable=False)
    name_bn = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    subject = relationship("Subject", back_populates="topics")
    questions = relationship("Question", back_populates="topic")
    resources = relationship("Resource", back_populates="topic")


class Examination(Base):
    __tablename__ = "examinations"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    category_id = Column(Integer, ForeignKey("exam_categories.id"), nullable=True)
    name = Column(String(255), nullable=False)  # 45th BCS Preliminary
    name_bn = Column(String(255), nullable=False)  # ৪৫তম বিসিএস প্রিলিমিনারি
    year = Column(Integer, index=True, nullable=True)
    total_marks = Column(Float, default=200.0)
    duration_minutes = Column(Integer, default=120)
    negative_mark_rate = Column(Float, default=0.5)

    organization = relationship("Organization", back_populates="examinations")
    questions = relationship("Question", back_populates="examination")


class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    question_text_bn = Column(Text, nullable=True)
    options = Column(JSON, nullable=False)  # list of 4 options: ["Option A", "Option B", "Option C", "Option D"]
    correct_option_index = Column(Integer, nullable=False)  # 0, 1, 2, or 3
    explanation = Column(Text, nullable=True)
    explanation_bn = Column(Text, nullable=True)

    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True, index=True)
    examination_id = Column(Integer, ForeignKey("examinations.id"), nullable=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True, index=True)
    category_id = Column(Integer, ForeignKey("exam_categories.id"), nullable=True, index=True)

    year = Column(Integer, nullable=True, index=True)
    difficulty = Column(String(20), default="MEDIUM", index=True)  # EASY, MEDIUM, HARD
    language = Column(String(10), default="BN", index=True)  # BN, EN
    question_type = Column(String(30), default="AUTHENTIC_PREVIOUS", index=True)  # AUTHENTIC_PREVIOUS, PRACTICE, AI_GENERATED
    source_reference = Column(String(255), nullable=True)

    is_verified = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    report_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    subject = relationship("Subject", back_populates="questions")
    topic = relationship("Topic", back_populates="questions")
    examination = relationship("Examination", back_populates="questions")
    organization = relationship("Organization", back_populates="questions")
    category = relationship("ExamCategory", back_populates="questions")
    collection_items = relationship("CollectionItem", back_populates="question", cascade="all, delete-orphan")
    reports = relationship("ReportedQuestion", back_populates="question", cascade="all, delete-orphan")


class ExamTemplate(Base):
    __tablename__ = "exam_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_bn = Column(String(255), nullable=False)
    exam_type = Column(String(50), default="FULL_MOCK")  # FULL_MOCK, SUBJECT_WISE, TOPIC_WISE, PREVIOUS_SIMULATION, CUSTOM, RANDOM_CHALLENGE
    target_exam = Column(String(100), default="BCS Preliminary")
    duration_minutes = Column(Integer, default=120)
    total_questions = Column(Integer, default=200)
    total_marks = Column(Float, default=200.0)
    negative_mark_rate = Column(Float, default=0.5)
    description = Column(Text, nullable=True)
    configuration = Column(JSON, nullable=True)  # list of subjects and weights, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ExamAttempt(Base):
    __tablename__ = "exam_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    template_id = Column(Integer, ForeignKey("exam_templates.id"), nullable=True)
    title = Column(String(255), nullable=False)
    
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, default=0)

    total_questions = Column(Integer, default=0)
    total_marks = Column(Float, default=0.0)
    obtained_marks = Column(Float, default=0.0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    unanswered_count = Column(Integer, default=0)
    negative_marks_deducted = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)
    passed = Column(Boolean, default=False)

    answers_data = Column(JSON, nullable=True)  # dict/list of question_id -> {selected_option, is_correct, time_spent}
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="exam_attempts")


class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_bn = Column(String(255), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True, index=True)
    resource_type = Column(String(50), default="NOTES")  # NOTES, SUMMARY, FORMULAS, GRAMMAR, VOCABULARY, CONSTITUTION, PDF_DOCUMENT
    summary = Column(Text, nullable=True)
    content_markdown = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)  # PDF URL or local link
    author = Column(String(100), default="Prostuti Editorial Board")
    tags = Column(String(255), nullable=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    subject = relationship("Subject", back_populates="resources")
    topic = relationship("Topic", back_populates="resources")


class CurrentAffair(Base):
    __tablename__ = "current_affairs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_bn = Column(String(255), nullable=False)
    category = Column(String(50), index=True)  # BANGLADESH, INTERNATIONAL, ECONOMY, GOVERNANCE, SCIENCE_TECH, APPOINTMENTS, AWARDS, SPORTS
    summary = Column(Text, nullable=False)
    full_content = Column(Text, nullable=True)
    important_facts = Column(JSON, default=list)  # list of key takeaway bullet points
    source_name = Column(String(100), nullable=True)
    source_url = Column(String(500), nullable=True)
    publish_date = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    mcqs = Column(JSON, default=list)  # generated MCQs from this current affairs article
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Collection(Base):
    __tablename__ = "collections"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="collections")
    items = relationship("CollectionItem", back_populates="collection", cascade="all, delete-orphan")


class CollectionItem(Base):
    __tablename__ = "collection_items"
    
    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    collection = relationship("Collection", back_populates="items")
    question = relationship("Question", back_populates="collection_items")


class Bookmark(Base):
    __tablename__ = "bookmarks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    item_type = Column(String(30), nullable=False)  # QUESTION, RESOURCE, CURRENT_AFFAIR
    item_id = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="bookmarks")


class ReportedQuestion(Base):
    __tablename__ = "reported_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    reason = Column(String(100), nullable=False)  # WRONG_ANSWER, TYPO, OUTDATED, INCORRECT_EXPLANATION, OTHER
    details = Column(Text, nullable=True)
    status = Column(String(30), default="PENDING")  # PENDING, RESOLVED, REJECTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    question = relationship("Question", back_populates="reports")


class AIGenerationLog(Base):
    __tablename__ = "ai_generation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    prompt = Column(Text, nullable=True)
    target_exam = Column(String(100), nullable=False)
    subject_id = Column(Integer, nullable=True)
    topic_id = Column(Integer, nullable=True)
    difficulty = Column(String(20), default="MEDIUM")
    language = Column(String(10), default="BN")
    question_count = Column(Integer, default=5)
    generated_questions = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
