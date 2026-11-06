# PROSTUTI (প্রস্তুতি)
### Bangladesh's All-in-One Competitive Job Preparation & Examination Platform
**Tagline:** *Prepare. Practice. Prevail.*

---

## 🇧🇩 Overview
**PROSTUTI (প্রস্তুতি)** is a production-quality, comprehensive competitive examination platform tailored specifically for Bangladesh recruitment examinations, including:
1. **Civil Service:** Bangladesh Civil Service (BCS Preliminary & Written), PSC Non-Cadre
2. **Bank Recruitment:** Bangladesh Bank Assistant Director (AD), Combined 8/9 Banks, Officer
3. **Government Recruitment:** Ministries, Directorates, Departments, Autonomous Bodies
4. **Teaching Recruitment:** Primary Assistant Teacher (DPE), NTRCA (School & College)
5. **Other Competitive Examinations:** Bangladesh Judicial Service (BJS), Railway, Police, Defense

> **Strict Architectural Principle:** Prostuti is **NOT** a study tracker or gamified habit counter. It contains no study streaks, daily goals, progress rings, or productivity analytics. The entire platform is built around **authentic knowledge, verified previous questions, structured study resources, realistic examination simulation, and AI-powered probable questions**.

---

## 🏛️ System Architecture

```
prostuti/
├── backend/                             # Python FastAPI Backend
│   ├── app/
│   │   ├── api/v1/endpoints/            # Modular REST API endpoints
│   │   │   ├── questions.py             # Question Bank search, filtering & reports
│   │   │   ├── exams.py                 # Live Exam Engine & scoring with negative marking
│   │   │   ├── resources.py             # Study Library, Notes & Constitutional Law
│   │   │   ├── probable.py              # AI Probable Question Generation
│   │   │   ├── current_affairs.py       # Current Affairs & instant MCQ generator
│   │   │   ├── ai_assistant.py          # Prostuti AI Study Mentor
│   │   │   ├── collections.py           # User bookmarks and custom question sets
│   │   │   └── admin.py                 # Administrative console & bulk upload
│   │   ├── core/                        # Config, CORS & Database engine
│   │   ├── models/entities.py           # Normalized SQLAlchemy models
│   │   ├── schemas/all_schemas.py       # Pydantic validation schemas
│   │   ├── services/ai_service.py       # Provider-independent AI layer (Gemini + fallback)
│   │   ├── data/seed_data.py            # Authentic previous questions & syllabus database
│   │   └── main.py                      # FastAPI application entrypoint
│   ├── requirements.txt
│   └── run.py
├── frontend/                            # Next.js 16 + React 19 + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                 # Home Portal
│   │   │   ├── question-bank/page.tsx   # Question Bank with continuous practice mode
│   │   │   ├── exam-hall/page.tsx       # Live Exam Hall & Scorecard Review
│   │   │   ├── study-resources/page.tsx # Digital Library & In-App Reader
│   │   │   ├── probable-questions/page.tsx # AI-Powered Probable Question Engine
│   │   │   ├── current-affairs/page.tsx # Current Affairs & Instant MCQ Generator
│   │   │   ├── ai-assistant/page.tsx    # Prostuti AI Interactive Study Assistant
│   │   │   ├── my-collections/page.tsx  # My Collections & Personal Folders
│   │   │   └── admin/page.tsx           # Admin Dashboard, Reports & Bulk Uploader
│   │   ├── components/
│   │   │   ├── layout/                  # Sidebar, Header, MobileNav, Logo
│   │   │   ├── question/                # QuestionCard, OptionButton, FilterBar
│   │   │   └── exam/                    # ExamTimer, QuestionPalette, ExamResultView
│   │   └── lib/                         # API client, TypeScript definitions
│   ├── package.json
│   └── next.config.ts                   # API rewrites & Turbopack config
└── README.md
```

---

## 🚀 Running the Application

### 1. Backend (FastAPI)
The backend runs on `http://127.0.0.1:8000`.

```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
- Interactive Swagger API Documentation: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/health`

### 2. Frontend (Next.js)
The frontend runs on `http://localhost:3000`.

```bash
cd frontend
npm install
npm run dev
# Or production build:
npm run build
npm run start
```

---

## 🌟 Key Features & Capabilities

### 1. Home
- Prominent search bar across all questions, exams, notes, and current affairs.
- Quick navigation across 5 competitive job categories.
- 1-click launch of featured mock exams.
- 10 core subjects with mark distribution.
- Recently added authentic questions and study materials.

### 2. Question Bank
- Multi-facet filters: Category, Organization, Exam, Year, Subject, Topic, Difficulty, Language, Question Type.
- Full-text keyword search across Bengali and English text.
- Option selection with immediate feedback toggle (Practice Mode).
- Reveal Answer with detailed official explanations.
- Continuous Practice Mode (previous / next navigation).
- Question bookmarking and error reporting.

### 3. Exam Hall
- Modes: Full-length mock, Subject-wise, Topic-wise, Custom exam, Random challenge.
- Live distraction-free interface with sticky countdown timer and warning state.
- Interactive Question Palette with Answered, Unanswered, and Marked for Review indicators.
- Automatic submission on timer expiration.
- Configurable negative marking (e.g. 0.5 for BCS, 0.25 for Bank, 0.0 for practice).
- Comprehensive Scorecard & Question Breakdown with candidate answers vs official answers.

### 4. Study Resources
- Structured digital library covering all 10 core BCS & Bank subjects.
- In-app Reader with full markdown rendering, tables, and personal note-taking.
- Bookmarking and search.

### 5. Probable Questions (Signature Feature)
- AI-powered practice question generation based on syllabus frequency and repeated concepts.
- Strict compliance: Clearly labeled as AI-generated practice material, without false claims of authentic previous questions or guarantees.
- Immediate practice mode and 1-click saving to Question Bank.

### 6. Current Affairs
- Category and date filtering for verified national and international news.
- Key exam facts bullet points.
- Instant MCQ generation from current affairs stories.

### 7. Prostuti AI — Study Assistant
- Multi-turn study mentor grounded in BPSC and Bangladesh Bank syllabuses.
- Explains difficult concepts in simple Bengali and English.
- Breaks down MCQ option distractors.
- Step-by-step mathematical problem solver.
- BCS Written question and model answer generator.

### 8. My Collections
- Custom question collections and practice folders.
- Subject-wise bookmarks.

### 9. Administration Console
- System-wide statistics.
- Bulk import of questions via CSV and JSON with duplicate detection.
- User error report review and status resolution.
- Single question creator with provenance metadata.
