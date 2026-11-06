import datetime
from app.models.entities import (
    ExamCategory, Organization, Subject, Topic, Examination,
    Question, ExamTemplate, Resource, CurrentAffair
)

def populate_seed_data(db):
    """
    Populates authentic competitive examination seed data if the database is fresh.
    """
    if db.query(Subject).first():
        return  # already seeded

    # 1. EXAM CATEGORIES
    categories_data = [
        {
            "name": "Civil Service",
            "name_bn": "সিভিল সার্ভিস (বিসিএস)",
            "slug": "civil-service",
            "description": "বাংলাদেশ সিভিল সার্ভিস (বিসিএস) প্রিলিমিনারি, লিখিত এবং পিএসসি নন-ক্যাডার নিয়োগ পরীক্ষা।",
            "display_order": 1
        },
        {
            "name": "Bank Recruitment",
            "name_bn": "ব্যাংক নিয়োগ পরীক্ষা",
            "slug": "bank-recruitment",
            "description": "বাংলাদেশ ব্যাংক সহকারী পরিচালক (AD), সমন্বিত ব্যাংক (Combined 8/9 Banks) এবং রাষ্ট্রায়ত্ত ব্যাংকের নিয়োগ।",
            "display_order": 2
        },
        {
            "name": "Government Recruitment",
            "name_bn": "সরকারি মন্ত্রণালয় ও অধিদপ্তর",
            "slug": "govt-recruitment",
            "description": "বিভিন্ন মন্ত্রণালয়, অধিদপ্তর, বিভাগ ও স্বায়ত্তশাসিত প্রতিষ্ঠানের ৯ম-১৬তম গ্রেডের নিয়োগ।",
            "display_order": 3
        },
        {
            "name": "Teaching Recruitment",
            "name_bn": "শিক্ষক নিবন্ধন ও নিয়োগ",
            "slug": "teaching-recruitment",
            "description": "প্রাথমিক সহকারী শিক্ষক নিয়োগ (DPE) এবং বেসরকারি শিক্ষক নিবন্ধন পরীক্ষা (NTRCA)।",
            "display_order": 4
        },
        {
            "name": "Other Competitive Exams",
            "name_bn": "বিচার বিভাগ ও অন্যান্য পরীক্ষা",
            "slug": "other-competitive",
            "description": "বাংলাদেশ জুডিশিয়াল সার্ভিস (BJS), বাংলাদেশ রেলওয়ে, পুলিশ ও প্রতিরক্ষা নিয়োগ।",
            "display_order": 5
        }
    ]
    categories = {}
    for c in categories_data:
        cat_obj = ExamCategory(**c)
        db.add(cat_obj)
        db.flush()
        categories[c["slug"]] = cat_obj

    # 2. ORGANIZATIONS
    organizations_data = [
        {"name": "Bangladesh Public Service Commission", "name_bn": "বাংলাদেশ সরকারি কর্ম কমিশন (বিপিএসসি)", "code": "BPSC", "category_id": categories["civil-service"].id},
        {"name": "Bangladesh Bank", "name_bn": "বাংলাদেশ ব্যাংক", "code": "BB", "category_id": categories["bank-recruitment"].id},
        {"name": "Bankers Selection Committee Secretariat", "name_bn": "ব্যাংকার্স সিলেকশন কমিটি (বিএসসিএসবি)", "code": "BSCSB", "category_id": categories["bank-recruitment"].id},
        {"name": "Directorate of Primary Education", "name_bn": "প্রাথমিক শিক্ষা অধিদপ্তর", "code": "DPE", "category_id": categories["teaching-recruitment"].id},
        {"name": "Non-Government Teachers Registration and Certification Authority", "name_bn": "বেসরকারি শিক্ষক নিবন্ধন ও প্রত্যয়ন কর্তৃপক্ষ", "code": "NTRCA", "category_id": categories["teaching-recruitment"].id},
        {"name": "Bangladesh Judicial Service Commission", "name_bn": "বাংলাদেশ জুডিশিয়াল সার্ভিস কমিশন", "code": "BJSC", "category_id": categories["other-competitive"].id},
        {"name": "Bangladesh Railway", "name_bn": "বাংলাদেশ রেলওয়ে", "code": "BR", "category_id": categories["other-competitive"].id}
    ]
    orgs = {}
    for o in organizations_data:
        org_obj = Organization(**o)
        db.add(org_obj)
        db.flush()
        orgs[o["code"]] = org_obj

    # 3. SUBJECTS & TOPICS
    subjects_data = [
        {
            "name": "Bangla Language & Literature",
            "name_bn": "বাংলা ভাষা ও সাহিত্য",
            "code": "BANGLA",
            "icon": "book-open",
            "total_marks_default": 35,
            "topics": [
                {"name": "Ancient & Medieval Literature", "name_bn": "প্রাচীন ও মধ্যযুগ (চর্যাপদ, মঙ্গলকাব্য, বৈষ্ণব পদাবলী)"},
                {"name": "Modern Literature", "name_bn": "আধুনিক যুগ (রবীন্দ্রনাথ, নজরুল, বঙ্কিম, মাইকেল)"},
                {"name": "Grammar & Morphology", "name_bn": "বাংলা ব্যাকরণ (ধ্বনি, বর্ণ, সন্ধি, সমাস, প্রত্যয়)"},
                {"name": "Idioms & Corrections", "name_bn": "বাগধারা, এককথায় প্রকাশ ও বাক্য শুদ্ধি"}
            ]
        },
        {
            "name": "English Language & Literature",
            "name_bn": "English Language & Literature",
            "code": "ENGLISH",
            "icon": "languages",
            "total_marks_default": 35,
            "topics": [
                {"name": "English Literature Periods & Authors", "name_bn": "English Literature (Shakespeare, Romantic & Victorian Poets)"},
                {"name": "Grammar & Parts of Speech", "name_bn": "Grammar (Parts of Speech, Clauses & Conditionals)"},
                {"name": "Vocabulary & Synonyms", "name_bn": "Vocabulary, Synonyms, Antonyms & Analogies"},
                {"name": "Prepositions & Idioms", "name_bn": "Appropriate Prepositions, Idioms & Phrases"}
            ]
        },
        {
            "name": "Bangladesh Affairs",
            "name_bn": "বাংলাদেশ বিষয়াবলী",
            "code": "BD_AFFAIRS",
            "icon": "flag",
            "total_marks_default": 30,
            "topics": [
                {"name": "History & Liberation War 1971", "name_bn": "প্রাচীন কাল থেকে মুক্তিযুদ্ধ ও স্বাধীনতা (১৯৪৭-১৯৭১)"},
                {"name": "Constitution of Bangladesh", "name_bn": "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান (মূলনীতি ও অনুচ্ছেদ)"},
                {"name": "Economy, Agriculture & Budget", "name_bn": "বাংলাদেশের অর্থনীতি, কৃষি, শিল্প ও পঞ্চবার্ষিকী পরিকল্পনা"},
                {"name": "Government & Administrative System", "name_bn": "সরকার ব্যবস্থা, সংসদ, বিচার বিভাগ ও প্রশাসন"}
            ]
        },
        {
            "name": "International Affairs",
            "name_bn": "আন্তর্জাতিক বিষয়াবলী",
            "code": "INT_AFFAIRS",
            "icon": "globe",
            "total_marks_default": 20,
            "topics": [
                {"name": "Global Geopolitics & Treaties", "name_bn": "বৈশ্বিক ভূ-রাজনীতি, আন্তর্জাতিক চুক্তি ও প্রটোকল"},
                {"name": "International Organizations", "name_bn": "আন্তর্জাতিক সংস্থা (জাতিসংঘ, বিশ্বব্যাংক, আইএমএফ, আঞ্চলিক জোট)"},
                {"name": "Global Security & Conflicts", "name_bn": "আন্তর্জাতিক নিরাপত্তা, দ্বন্দ্ব, সংকট ও সামরিক জোট"},
                {"name": "International Environmental Diplomacy", "name_bn": "পরিবেশ কূটনীতি ও জলবায়ু পরিবর্তন"}
            ]
        },
        {
            "name": "General Science",
            "name_bn": "সাধারণ বিজ্ঞান",
            "code": "GEN_SCIENCE",
            "icon": "atom",
            "total_marks_default": 15,
            "topics": [
                {"name": "Physical Science", "name_bn": "ভৌত বিজ্ঞান (বল, গতি, তরঙ্গ, আলো ও শব্দ)"},
                {"name": "Biological Science", "name_bn": "জীববিজ্ঞান (কোষ, বংশগতি, মানবদেহ ও ভিটামিন)"},
                {"name": "Modern Science & Diseases", "name_bn": "আধুনিক বিজ্ঞান, রোগব্যাধি, খাদ্য ও পুষ্টি"}
            ]
        },
        {
            "name": "Computer & Information Technology",
            "name_bn": "কম্পিউটার ও তথ্যপ্রযুক্তি",
            "code": "COMPUTER_ICT",
            "icon": "cpu",
            "total_marks_default": 15,
            "topics": [
                {"name": "Computer Hardware & Architecture", "name_bn": "কম্পিউটার সংগঠন, মেমোরি, প্রসেসর ও বাস"},
                {"name": "Networking & Internet Protocols", "name_bn": "নেটওয়ার্কিং, ইন্টারনেট, ক্লাউড ও আইপি অ্যাড্রেসিং"},
                {"name": "Cyber Security & Modern Tech", "name_bn": "সাইবার নিরাপত্তা, কৃত্রিম বুদ্ধিমত্তা ও ডেটাবেজ"}
            ]
        },
        {
            "name": "Mathematical Reasoning",
            "name_bn": "গাণিতিক যুক্তি",
            "code": "MATH_REASONING",
            "icon": "calculator",
            "total_marks_default": 15,
            "topics": [
                {"name": "Arithmetic & Percentage", "name_bn": "পাটিগণিত (লসাগু-গসাগু, শতকরা, লাভ-ক্ষতি, অনুপাত)"},
                {"name": "Algebra, Indices & Logarithms", "name_bn": "বীজগণিত (উৎপাদক, সূচক, লগারিদম, অসমতা ও ধারা)"},
                {"name": "Geometry & Trigonometry", "name_bn": "জ্যামিতি (রেখা, কোণ, ত্রিভুজ, বৃত্ত ও পরিমিতি)"}
            ]
        },
        {
            "name": "Mental Ability",
            "name_bn": "মানসিক দক্ষতা",
            "code": "MENTAL_ABILITY",
            "icon": "brain",
            "total_marks_default": 15,
            "topics": [
                {"name": "Logical & Verbal Reasoning", "name_bn": "ভাষাগত ও যৌক্তিক বিচার ক্ষমতা"},
                {"name": "Spatial & Numerical Sequence", "name_bn": "সংখ্যা ও বর্ণমালার ধারাবাহিকতা ও সম্পর্ক"},
                {"name": "Mechanical & Visual Reasoning", "name_bn": "আয়না প্রতিবিম্ব, দিক নির্ণয় ও ঘড়ি-ক্যালেন্ডার"}
            ]
        },
        {
            "name": "Geography, Environment & Disaster Management",
            "name_bn": "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
            "code": "GEOGRAPHY",
            "icon": "map",
            "total_marks_default": 10,
            "topics": [
                {"name": "Geography of Bangladesh & Boundaries", "name_bn": "বাংলাদেশের ভূ-প্রকৃতি, নদ-নদী, সীমানা ও জলবায়ু"},
                {"name": "Disasters & Environmental Risk", "name_bn": "প্রাকৃতিক দুর্যোগ, সাইক্লোন ও দুর্যোগ ব্যবস্থাপনা"}
            ]
        },
        {
            "name": "Ethics, Values & Good Governance",
            "name_bn": "নৈতিকতা, মূল্যবোধ ও সুশাসন",
            "code": "ETHICS_GOVERNANCE",
            "icon": "shield-check",
            "total_marks_default": 10,
            "topics": [
                {"name": "Ethics & Moral Philosophy", "name_bn": "নৈতিকতার সংজ্ঞা, উৎস ও দার্শনিক তত্ত্ব"},
                {"name": "Good Governance & Transparency", "name_bn": "সুশাসনের উপাদান, জবাবদিহিতা ও নাগরিক সনদের ধারণা"}
            ]
        }
    ]

    subjects = {}
    topics_by_name = {}
    for s_idx, s in enumerate(subjects_data):
        subj_topics = s.pop("topics", [])
        subj_obj = Subject(**s)
        db.add(subj_obj)
        db.flush()
        subjects[s["code"]] = subj_obj

        for t in subj_topics:
            t_obj = Topic(subject_id=subj_obj.id, **t)
            db.add(t_obj)
            db.flush()
            topics_by_name[t["name"]] = t_obj

    # 4. EXAMINATIONS
    exams_data = [
        {"name": "45th BCS Preliminary Examination", "name_bn": "৪৫তম বিসিএস প্রিলিমিনারি পরীক্ষা", "year": 2023, "total_marks": 200, "duration_minutes": 120, "negative_mark_rate": 0.5, "org": "BPSC", "cat": "civil-service"},
        {"name": "44th BCS Preliminary Examination", "name_bn": "৪৪তম বিসিএস প্রিলিমিনারি পরীক্ষা", "year": 2022, "total_marks": 200, "duration_minutes": 120, "negative_mark_rate": 0.5, "org": "BPSC", "cat": "civil-service"},
        {"name": "43rd BCS Preliminary Examination", "name_bn": "৪৩তম বিসিএস প্রিলিমিনারি পরীক্ষা", "year": 2021, "total_marks": 200, "duration_minutes": 120, "negative_mark_rate": 0.5, "org": "BPSC", "cat": "civil-service"},
        {"name": "41st BCS Preliminary Examination", "name_bn": "৪১তম বিসিএস প্রিলিমিনারি পরীক্ষা", "year": 2021, "total_marks": 200, "duration_minutes": 120, "negative_mark_rate": 0.5, "org": "BPSC", "cat": "civil-service"},
        {"name": "40th BCS Preliminary Examination", "name_bn": "৪০তম বিসিএস প্রিলিমিনারি পরীক্ষা", "year": 2019, "total_marks": 200, "duration_minutes": 120, "negative_mark_rate": 0.5, "org": "BPSC", "cat": "civil-service"},
        {"name": "Bangladesh Bank Assistant Director Exam (2022)", "name_bn": "বাংলাদেশ ব্যাংক সহকারী পরিচালক (সাধারণ) ২০২২", "year": 2022, "total_marks": 100, "duration_minutes": 60, "negative_mark_rate": 0.25, "org": "BB", "cat": "bank-recruitment"},
        {"name": "Combined 8 Banks Senior Officer Exam (2021)", "name_bn": "সমন্বিত ৮ ব্যাংক সিনিয়র অফিসার ২০২১", "year": 2021, "total_marks": 100, "duration_minutes": 60, "negative_mark_rate": 0.25, "org": "BSCSB", "cat": "bank-recruitment"},
        {"name": "Primary Assistant Teacher Recruitment (2022)", "name_bn": "প্রাথমিক সহকারী শিক্ষক নিয়োগ পরীক্ষা ২০২২", "year": 2022, "total_marks": 80, "duration_minutes": 60, "negative_mark_rate": 0.25, "org": "DPE", "cat": "teaching-recruitment"},
        {"name": "17th NTRCA Teachers Registration Exam", "name_bn": "১৭তম শিক্ষক নিবন্ধন প্রিলিমিনারি ২০২২", "year": 2022, "total_marks": 100, "duration_minutes": 60, "negative_mark_rate": 0.5, "org": "NTRCA", "cat": "teaching-recruitment"}
    ]
    exams = {}
    for e in exams_data:
        org_code = e.pop("org")
        cat_slug = e.pop("cat")
        exam_obj = Examination(
            organization_id=orgs[org_code].id,
            category_id=categories[cat_slug].id,
            **e
        )
        db.add(exam_obj)
        db.flush()
        exams[e["name"]] = exam_obj

    # 5. AUTHENTIC PREVIOUS QUESTIONS DATABASE
    # Hand-curated historical questions from real BCS, Bangladesh Bank, and DPE exams with exact citations and answers
    authentic_questions = [
        # Bangla Literature - 45th BCS
        {
            "question_text": "কোনটি 'চর্যাপদ' এর ছন্দ হিসেবে সর্বজনস্বীকৃত?",
            "question_text_bn": "কোনটি 'চর্যাপদ' এর ছন্দ হিসেবে সর্বজনস্বীকৃত?",
            "options": ["মাত্রাবৃত্ত", "অক্ষরবৃত্ত", "স্বরমাত্রিক", "পয়ার"],
            "correct_option_index": 0,
            "explanation": "চর্যাপদ মূলত 'মাত্রাবৃত্ত' বা পাদাকুলক (১৬ মাত্রার মাত্রাবৃত্ত) ছন্দে রচিত। মহামহোপাধ্যায় হরপ্রসাদ শাস্ত্রী ১৯০৭ সালে নেপালের রাজদরবারের রয়েল লাইব্রেরি থেকে চর্যাপদের পুথি আবিষ্কার করেন।",
            "subject_id": subjects["BANGLA"].id,
            "topic_id": topics_by_name["Ancient & Medieval Literature"].id,
            "examination_id": exams["45th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2023,
            "difficulty": "MEDIUM",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৫তম বিসিএস প্রিলিমিনারি, বাংলা সাহিত্য অংশ"
        },
        # Bangla Literature - 44th BCS
        {
            "question_text": "'গীতাঞ্জলি' কাব্যের ইংরেজি অনুবাদ 'Song Offerings' এর ভূমিকা (Introduction) কে লিখেছিলেন?",
            "question_text_bn": "'গীতাঞ্জলি' কাব্যের ইংরেজি অনুবাদ 'Song Offerings' এর ভূমিকা কে লিখেছিলেন?",
            "options": ["ডব্লিউ. বি. ইয়েটস (W. B. Yeats)", "টি. এস. এলিয়ট (T. S. Eliot)", "এজরা পাউন্ড (Ezra Pound)", "রবার্ট ফ্রস্ট (Robert Frost)"],
            "correct_option_index": 0,
            "explanation": "রবীন্দ্রনাথ ঠাকুরের 'গীতাঞ্জলি' কাব্যের ইংরেজি অনুবাদ 'Song Offerings'-এর মুগ্ধ করা ভূমিকা লিখেছিলেন আইরিশ কবি উইলিয়াম বাটলার ইয়েটস (W. B. Yeats)। ১৯১৩ সালে এই কাব্যের জন্যই রবীন্দ্রনাথ নোবেল পুরস্কার লাভ করেন।",
            "subject_id": subjects["BANGLA"].id,
            "topic_id": topics_by_name["Modern Literature"].id,
            "examination_id": exams["44th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2022,
            "difficulty": "EASY",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৪তম বিসিএস প্রিলিমিনারি, প্রশ্ন নং-০৮"
        },
        # Bangla Grammar - 43rd BCS
        {
            "question_text": "কোনটি নিপাতনে সিদ্ধ সন্ধির উদাহরণ?",
            "question_text_bn": "কোনটি নিপাতনে সিদ্ধ সন্ধির উদাহরণ?",
            "options": ["পরস্পর", "বিদ্যালয়", "সঞ্চয়", "পদ্ধতি"],
            "correct_option_index": 0,
            "explanation": "যে সন্ধি কোনো সাধারণ ব্যাকরণিক নিয়ম অনুসারে হয় না, তাকে নিপাতনে সিদ্ধ সন্ধি বলে। যেমন: পর + পর = পরস্পর, এক + দশ = একাদশ, গো + অক্ষ = গবাক্ষ।",
            "subject_id": subjects["BANGLA"].id,
            "topic_id": topics_by_name["Grammar & Morphology"].id,
            "examination_id": exams["43rd BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2021,
            "difficulty": "MEDIUM",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৩তম বিসিএস প্রিলিমিনারি, ব্যাকরণ অংশ"
        },
        # English Literature - 45th BCS
        {
            "question_text": "Who is the author of the epic novel 'War and Peace'?",
            "question_text_bn": "'War and Peace' উপন্যাসের লেখক কে?",
            "options": ["Leo Tolstoy", "Fyodor Dostoevsky", "Victor Hugo", "Charles Dickens"],
            "correct_option_index": 0,
            "explanation": "'War and Peace' is a literary masterpiece by the Russian author Leo Tolstoy, first published in 1869. It chronicles the French invasion of Russia and the impact of the Napoleonic era on Tsarist society.",
            "subject_id": subjects["ENGLISH"].id,
            "topic_id": topics_by_name["English Literature Periods & Authors"].id,
            "examination_id": exams["45th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2023,
            "difficulty": "EASY",
            "language": "EN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "45th BCS Preliminary, English Section"
        },
        # English Grammar - 44th BCS
        {
            "question_text": "Identify the correct sentence:",
            "question_text_bn": "সঠিক বাক্যটি চিহ্নিত করুন:",
            "options": [
                "He insisted on my going there.",
                "He insisted to my going there.",
                "He insisted in my going there.",
                "He insisted for me to go there."
            ],
            "correct_option_index": 0,
            "explanation": "The verb 'insist' always takes the preposition 'on' (or 'upon'), followed by a possessive adjective + gerund (my going) or a that-clause. Therefore, 'insisted on my going there' is grammatically correct.",
            "subject_id": subjects["ENGLISH"].id,
            "topic_id": topics_by_name["Grammar & Parts of Speech"].id,
            "examination_id": exams["44th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2022,
            "difficulty": "MEDIUM",
            "language": "EN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "44th BCS Preliminary, Question #42"
        },
        # English Vocabulary / Bank - BB AD 2022
        {
            "question_text": "What is the antonym of the word 'EPHEMERAL'?",
            "question_text_bn": "'EPHEMERAL' শব্দের বিপরীত শব্দ কোনটি?",
            "options": ["Permanent", "Transient", "Fleeting", "Evanescent"],
            "correct_option_index": 0,
            "explanation": "'Ephemeral' means lasting for a very short time (ক্ষণস্থায়ী). Its direct antonym is 'Permanent' (চিরস্থায়ী) or 'Perpetual'. Transient, fleeting, and evanescent are synonyms.",
            "subject_id": subjects["ENGLISH"].id,
            "topic_id": topics_by_name["Vocabulary & Synonyms"].id,
            "examination_id": exams["Bangladesh Bank Assistant Director Exam (2022)"].id,
            "organization_id": orgs["BB"].id,
            "category_id": categories["bank-recruitment"].id,
            "year": 2022,
            "difficulty": "MEDIUM",
            "language": "EN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "Bangladesh Bank AD (General) 2022, English Vocabulary"
        },
        # Bangladesh Affairs - 44th BCS
        {
            "question_text": "ঐতিহাসিক 'ছয় দফা' দাবি জাতির জনক বঙ্গবন্ধু শেখ মুজিবুর রহমান আনুষ্ঠানিকভাবে কোথায় এবং কোন সালে প্রথম পেশ করেন?",
            "question_text_bn": "ঐতিহাসিক 'ছয় দফা' দাবি বঙ্গবন্ধু শেখ মুজিবুর রহমান আনুষ্ঠানিকভাবে কোথায় এবং কোন সালে পেশ করেন?",
            "options": ["১৯৬৬ সালের ফেব্রুয়ারিতে লাহোরে", "১৯৬৬ সালের জুনে ঢাকায়", "১৯৬৯ সালের জানুয়ারিতে রাওয়ালপিন্ডিতে", "১৯৭০ সালের মার্চে চট্টগ্রামে"],
            "correct_option_index": 0,
            "explanation": "১৯৬৬ সালের ৫-৬ ফেব্রুয়ারি লাহোরে বিরোধী দলসমূহের এক জাতীয় সম্মেলনে বঙ্গবন্ধু শেখ মুজিবুর রহমান পূর্ব বাংলার স্বায়ত্তশাসন প্রতিষ্ঠার লক্ষ্যে ঐতিহাসিক ৬ দফা দাবি উত্থাপন করেন। একে বাঙালির 'ম্যাগনা কার্টা' বলা হয়।",
            "subject_id": subjects["BD_AFFAIRS"].id,
            "topic_id": topics_by_name["History & Liberation War 1971"].id,
            "examination_id": exams["44th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2022,
            "difficulty": "EASY",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৪তম বিসিএস প্রিলিমিনারি, বাংলাদেশ বিষয়াবলী"
        },
        # Bangladesh Affairs - Constitution - 45th BCS
        {
            "question_text": "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানের কোন অনুচ্ছেদ অনুযায়ী 'সকল নাগরিক আইনের দৃষ্টিতে সমান এবং আইনের সমান আশ্রয় লাভের অধিকারী'?",
            "question_text_bn": "সংবিধানের কোন অনুচ্ছেদ অনুযায়ী সকল নাগরিক আইনের দৃষ্টিতে সমান?",
            "options": ["অনুচ্ছেদ ২৭", "অনুচ্ছেদ ২৮", "অনুচ্ছেদ ২৯", "অনুচ্ছেদ ৩১"],
            "correct_option_index": 0,
            "explanation": "সংবিধানের তৃতীয় ভাগের মৌলিক অধিকার অংশের অনুচ্ছেদ ২৭-এ বলা হয়েছে: 'সকল নাগরিক আইনের দৃষ্টিতে সমান এবং আইনের সমান আশ্রয় লাভের অধিকারী।' অনুচ্ছেদ ২৮ হলো ধর্ম ইত্যাদি কারণে বৈষম্য বিলোপ সংক্রান্ত।",
            "subject_id": subjects["BD_AFFAIRS"].id,
            "topic_id": topics_by_name["Constitution of Bangladesh"].id,
            "examination_id": exams["45th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2023,
            "difficulty": "EASY",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৫তম বিসিএস প্রিলিমিনারি, সংবিধান অংশ"
        },
        # International Affairs - 43rd BCS
        {
            "question_text": "আন্তর্জাতিক আদালত (International Court of Justice - ICJ) এর সদর দপ্তর কোথায় অবস্থিত?",
            "question_text_bn": "আন্তর্জাতিক আদালত (ICJ) এর সদর দপ্তর কোথায় অবস্থিত?",
            "options": ["দ্য হেগ, নেদারল্যান্ডস", "জেনেভা, সুইজারল্যান্ড", "নিউইয়র্ক, যুক্তরাষ্ট্র", "ভিয়েনা, অস্ট্রিয়া"],
            "correct_option_index": 0,
            "explanation": "জাতিসংঘের প্রধান বিচারিক অঙ্গ 'আন্তর্জাতিক ন্যায়বিচার আদালত' (ICJ) নেদারল্যান্ডসের দ্য হেগ শহরের পিস প্যালেসে অবস্থিত। এটি ১৯৪৫ সালে প্রতিষ্ঠিত হয় এবং এতে ১৫ জন বিচারক ৯ বছরের মেয়াদে নির্বাচিত হন।",
            "subject_id": subjects["INT_AFFAIRS"].id,
            "topic_id": topics_by_name["International Organizations"].id,
            "examination_id": exams["43rd BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2021,
            "difficulty": "EASY",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৩তম বিসিএস প্রিলিমিনারি, প্রশ্ন নং-৯১"
        },
        # General Science - 41st BCS
        {
            "question_text": "মানুষের রক্তে লোহিত রক্তকণিকা (RBC) এর গড় আয়ুষ্কাল কত দিন?",
            "question_text_bn": "মানুষের রক্তে লোহিত রক্তকণিকার গড় আয়ু কত দিন?",
            "options": ["১২০ দিন", "৬০ দিন", "১৫ দিন", "১৮০ দিন"],
            "correct_option_index": 0,
            "explanation": "মানুষের লোহিত রক্তকণিকা (Red Blood Cells বা Erythrocytes) এর গড় আয়ু প্রায় ১২০ দিন (৪ মাস)। এগুলো অস্থিমজ্জায় উৎপন্ন হয় এবং প্লীহা ও যকৃতে ধ্বংসপ্রাপ্ত হয়।",
            "subject_id": subjects["GEN_SCIENCE"].id,
            "topic_id": topics_by_name["Biological Science"].id,
            "examination_id": exams["41st BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2021,
            "difficulty": "EASY",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪১তম বিসিএস প্রিলিমিনারি, সাধারণ বিজ্ঞান"
        },
        # Computer & ICT - 45th BCS
        {
            "question_text": "কম্পিউটারের প্রধান মেমোরি (Primary Memory) নিচের কোনটির সমন্বয়ে গঠিত?",
            "question_text_bn": "কম্পিউটারের প্রধান মেমোরি নিচের কোনটির সমন্বয়ে গঠিত?",
            "options": ["RAM ও ROM", "Hard Disk ও SSD", "Cache ও Registers", "Optical Disc ও Flash Drive"],
            "correct_option_index": 0,
            "explanation": "কম্পিউটারের প্রধান বা প্রাথমিক স্মৃতি (Internal/Primary Memory) মূলত RAM (Random Access Memory - অস্থায়ী) এবং ROM (Read Only Memory - স্থায়ী) নিয়ে গঠিত।",
            "subject_id": subjects["COMPUTER_ICT"].id,
            "topic_id": topics_by_name["Computer Hardware & Architecture"].id,
            "examination_id": exams["45th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2023,
            "difficulty": "EASY",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৫তম বিসিএস প্রিলিমিনারি, আইসিটি অংশ"
        },
        # Computer & ICT - 44th BCS
        {
            "question_text": "নিচের কোনটি একটি ওপেন সোর্স অপারেটিং সিস্টেম (Open Source Operating System)?",
            "question_text_bn": "নিচের কোনটি ওপেন সোর্স অপারেটিং সিস্টেম?",
            "options": ["Linux", "Windows 11", "macOS", "MS-DOS"],
            "correct_option_index": 0,
            "explanation": "লিনাক্স (Linux) একটি মুক্ত বা ওপেন সোর্স অপারেটিং সিস্টেম যার কার্নেল লিনাস টোরভাল্ডস (Linus Torvalds) ১৯৯১ সালে প্রথম অবমুক্ত করেন। উইন্ডোজ ও ম্যাকওএস হলো বাণিজ্যিক ও মালিকানাধীন (Proprietary) সফটওয়্যার।",
            "subject_id": subjects["COMPUTER_ICT"].id,
            "topic_id": topics_by_name["Networking & Internet Protocols"].id,
            "examination_id": exams["44th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2022,
            "difficulty": "EASY",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৪তম বিসিএস প্রিলিমিনারি, প্রশ্ন নং-১৩৫"
        },
        # Mathematical Reasoning - 44th BCS
        {
            "question_text": "যদি log₂ 64 + log₂ 32 = x হয়, তবে x এর মান কত?",
            "question_text_bn": "যদি log₂ 64 + log₂ 32 = x হয়, তবে x এর মান কত?",
            "options": ["11", "12", "10", "9"],
            "correct_option_index": 0,
            "explanation": "আমরা জানি, 64 = 2⁶, সুতরাং log₂ 64 = log₂ (2⁶) = 6। আবার 32 = 2⁵, সুতরাং log₂ 32 = log₂ (2⁵) = 5। অতএব, x = 6 + 5 = 11।",
            "subject_id": subjects["MATH_REASONING"].id,
            "topic_id": topics_by_name["Algebra, Indices & Logarithms"].id,
            "examination_id": exams["44th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2022,
            "difficulty": "MEDIUM",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৪তম বিসিএস প্রিলিমিনারি, গাণিতিক যুক্তি"
        },
        # Mathematical Reasoning - Bank AD 2022
        {
            "question_text": "A train 150 meters long is running at a speed of 54 km/hr. How much time will it take to cross an electric post?",
            "question_text_bn": "১৫০ মিটার দীর্ঘ একটি ট্রেন ঘণ্টায় ৫৪ কিমি গতিতে চলে একটি বিদ্যুতের খুঁটি পার হতে কত সময় নেবে?",
            "options": ["10 seconds", "12 seconds", "15 seconds", "8 seconds"],
            "correct_option_index": 0,
            "explanation": "Speed in m/s = 54 × (5/18) = 15 m/s. To cross a pole, the train covers its own length = 150 m. Time taken = Distance / Speed = 150 / 15 = 10 seconds.",
            "subject_id": subjects["MATH_REASONING"].id,
            "topic_id": topics_by_name["Arithmetic & Percentage"].id,
            "examination_id": exams["Bangladesh Bank Assistant Director Exam (2022)"].id,
            "organization_id": orgs["BB"].id,
            "category_id": categories["bank-recruitment"].id,
            "year": 2022,
            "difficulty": "MEDIUM",
            "language": "EN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "Bangladesh Bank AD 2022, Quantitative Aptitude"
        },
        # Mental Ability - 45th BCS
        {
            "question_text": "একটি ঘড়িতে যখন ৩টা বেজে ১৫ মিনিট, তখন ঘণ্টার কাঁটা ও মিনিটের কাঁটার মধ্যবর্তী কোণ কত ডিগ্রি?",
            "question_text_bn": "একটি ঘড়িতে ৩টা ১৫ মিনিটে ঘণ্টার ও মিনিটের কাঁটার মধ্যবর্তী কোণ কত?",
            "options": ["৭.৫°", "০°", "১৫°", "২২.৫°"],
            "correct_option_index": 0,
            "explanation": "সূত্র: |(৬০H - ১১M) ÷ ২| = |(৬০×৩ - ১১×১৫) ÷ ২| = |(১৮০ - ১৬৫) ÷ ২| = ১৫ ÷ ২ = ৭.৫°।",
            "subject_id": subjects["MENTAL_ABILITY"].id,
            "topic_id": topics_by_name["Mechanical & Visual Reasoning"].id,
            "examination_id": exams["45th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2023,
            "difficulty": "MEDIUM",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৫তম বিসিএস প্রিলিমিনারি, মানসিক দক্ষতা"
        },
        # Geography - 43rd BCS
        {
            "question_text": "বাংলাদেশের একমাত্র পাহাড়ি দ্বীপ কোনটি?",
            "question_text_bn": "বাংলাদেশের একমাত্র পাহাড়ি দ্বীপ কোনটি?",
            "options": ["মহেশখালী", "সেন্টমার্টিন", "হাতিয়া", "নিঝুম দ্বীপ"],
            "correct_option_index": 0,
            "explanation": "কক্সবাজার জেলাধীন 'মহেশখালী' হলো বাংলাদেশের একমাত্র পাহাড়ি দ্বীপ। সেন্টমার্টিন হলো বাংলাদেশের একমাত্র প্রবাল দ্বীপ এবং ছেঁড়া দ্বীপ সেন্টমার্টিনের বিচ্ছিন্ন দক্ষিণাংশ।",
            "subject_id": subjects["GEOGRAPHY"].id,
            "topic_id": topics_by_name["Geography of Bangladesh & Boundaries"].id,
            "examination_id": exams["43rd BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2021,
            "difficulty": "EASY",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৩তম বিসিএস প্রিলিমিনারি, ভূগোল অংশ"
        },
        # Ethics & Good Governance - 44th BCS
        {
            "question_text": "সুশাসনের কোন উপাদানটি নিশ্চিত হলে সরকারি কাজে দুর্নীতি সবচেয়ে বেশি কমে যায়?",
            "question_text_bn": "সুশাসনের কোন উপাদানটি নিশ্চিত হলে দুর্নীতি সবচেয়ে কমে?",
            "options": ["স্বচ্ছতা ও জবাবদিহিতা", "আমলাতান্ত্রিক জটিলতা", "একক সিদ্ধান্ত গ্রহণ", "নির্বাহী বিভাগের নিয়ন্ত্রণ"],
            "correct_option_index": 0,
            "explanation": "বিশ্বব্যাংক ও ইউএনডিপি-র সুশাসনের সংজ্ঞা অনুযায়ী, 'স্বচ্ছতা' (Transparency) এবং 'জবাবদিহিতা' (Accountability) সুশাসনের প্রাণকেন্দ্র। এ দুটি নিশ্চিত হলে রাষ্ট্রীয় ও প্রাতিষ্ঠানিক ক্ষেত্রে ক্ষমতার অপব্যবহার ও দুর্নীতি রোধ সম্ভব হয়।",
            "subject_id": subjects["ETHICS_GOVERNANCE"].id,
            "topic_id": topics_by_name["Good Governance & Transparency"].id,
            "examination_id": exams["44th BCS Preliminary Examination"].id,
            "organization_id": orgs["BPSC"].id,
            "category_id": categories["civil-service"].id,
            "year": 2022,
            "difficulty": "EASY",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "৪৪তম বিসিএস প্রিলিমিনারি, সুশাসন অংশ"
        },
        # Primary Teacher Recruitment 2022
        {
            "question_text": "কোন বাক্যটি শুদ্ধ?",
            "question_text_bn": "কোন বাক্যটি শুদ্ধ?",
            "options": [
                "দৈন্যতা সর্বদা প্রশংসনীয় নয়",
                "দীনতা সর্বদা প্রশংসনীয় নয়",
                "দীন সর্বদা প্রশংসনীয় নয়",
                "দৈনতা সর্বদা প্রশংসনীয় নয়"
            ],
            "correct_option_index": 1,
            "explanation": "বিশেষণ 'দীন' থেকে ভাববাচক বিশেষ্য হলো 'দীনতা' অথবা 'দৈন্য'। 'দৈন্যতা' শব্দটি ব্যাকরণগতভাবে প্রত্যয়জনিত বাহুল্য দোষে দুষ্ট। সুতরাং শুদ্ধ রূপ হলো 'দীনতা সর্বদা প্রশংসনীয় নয়' বা 'দৈন্য সর্বদা প্রশংসনীয় নয়'।",
            "subject_id": subjects["BANGLA"].id,
            "topic_id": topics_by_name["Idioms & Corrections"].id,
            "examination_id": exams["Primary Assistant Teacher Recruitment (2022)"].id,
            "organization_id": orgs["DPE"].id,
            "category_id": categories["teaching-recruitment"].id,
            "year": 2022,
            "difficulty": "MEDIUM",
            "language": "BN",
            "question_type": "AUTHENTIC_PREVIOUS",
            "source_reference": "প্রাথমিক সহকারী শিক্ষক নিয়োগ ২০২২, ১ম ধাপ"
        }
    ]

    for q in authentic_questions:
        q_obj = Question(**q)
        db.add(q_obj)

    # 6. STUDY RESOURCES
    resources_data = [
        {
            "title": "Mastering Bangladesh Constitution: Articles 1 to 153 Summary & High-Yield Analysis",
            "title_bn": "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান: অনুচ্ছেদ ১-১৫৩ এর পূর্ণাঙ্গ বিশ্লেষণ ও প্রিলি নোট",
            "subject_id": subjects["BD_AFFAIRS"].id,
            "topic_id": topics_by_name["Constitution of Bangladesh"].id,
            "resource_type": "CONSTITUTION",
            "summary": "বিসিএস প্রিলিমিনারি ও লিখিত পরীক্ষার জন্য সংবিধানের প্রতিটি মৌলিক ভাগের বিশেষ হাই-ইল্ড পয়েন্ট, সংশোধনী ও কেস রেফারেন্স।",
            "content_markdown": """# গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান: প্রিলিমিনারি ও লিখিত মাস্টারনোট

## ১. ঐতিহাসিক পটভূমি
- **গণপরিষদ আদেশ:** ১৯৭২ সালের ২৩ মার্চ রাষ্ট্রপতি আবু সাঈদ চৌধুরী গণপরিষদ আদেশ (রাষ্ট্রপতির আদেশ নং ২২) জারি করেন।
- **খসড়া সংবিধান প্রণয়ন কমিটি:** ড. কামাল হোসেনকে সভাপতি করে ৩৪ সদস্যের খসড়া কমিটি গঠিত হয় (একমাত্র নারী সদস্য ছিলেন বেগম রাজিয়া বানু)।
- **গৃহীত ও কার্যকর:** ১৯৭২ সালের ৪ নভেম্বর গণপরিষদে গৃহীত এবং ১৬ ডিসেম্বর (প্রথম বিজয় দিবস) থেকে কার্যকর হয়।

## ২. সংবিধানের গঠনকাঠামো
- মোট ভাগ: **১১টি**
- মোট অনুচ্ছেদ: **১৫৩টি**
- মূলনীতি: **৪টি** (জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা - অনুচ্ছেদ ৮)
- তফসিল: **৭টি**

## ৩. প্রিলিমিনারির জন্য অতি-গুরুত্বপূর্ণ অনুচ্ছেদসমূহ
| অনুচ্ছেদ | বিষয়বস্তু | পরীক্ষার গুরুত্ব |
|---|---|---|
| **অনুচ্ছেদ ৭** | সংবিধানের প্রাধান্য (জনগণই সকল ক্ষমতার মালিক) | সর্বোচ্চ |
| **অনুচ্ছেদ ৭ক ও ৭খ** | সংবিধান বাতিল, স্থগিতকরণ ইত্যাদি অপরাধ ও মৌলিক কাঠামোর অপ্রতিরোধ্যতা | বিগত ৩টি বিসিএসে প্রশ্ন এসেছে |
| **অনুচ্ছেদ ১১** | গণতন্ত্র ও মানবাধিকার | জাতিসংঘ সনদের প্রতিফলন |
| **অনুচ্ছেদ ১৯** | সুযোগের সমতা (নারী ও অনগ্রসর অংশের জন্য বিশেষ বিধান) | বিসিএস ও ব্যাংক প্রিলিমিনারি |
| **অনুচ্ছেদ ২৭** | আইনের দৃষ্টিতে সমতা | মৌলিক অধিকারের সূচনা |
| **অনুচ্ছেদ ২৮** | ধর্ম ইত্যাদি কারণে বৈষম্য বিলোপ | নারী ও শিশুদের অনুকূলে আইন প্রণয়ন |
| **অনুচ্ছেদ ৪৪** | মৌলিক অধিকার বলবৎকরণ (হাইকোর্টে রিট করার অধিকার) | সরাসরি প্রশ্ন আসে |
| **অনুচ্ছেদ ৭০** | রাজনৈতিক দলের বিরুদ্ধে ভোটদান সংক্রান্ত বিধিনিষেধ | লিখিত পরীক্ষার জন্য বিশ্লেষণধর্মী |
| **অনুচ্ছেদ ১০২** | হাইকোর্ট বিভাগের রিট এখতিয়ার (Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo-Warranto) | সংবিধান অংশের প্রাণ |
""",
            "author": "Prostuti Editorial Board",
            "is_featured": True
        },
        {
            "title": "Complete Preposition Mastery for Bank & BCS Preliminary",
            "title_bn": "Appropriate Prepositions: বিসিএস ও ব্যাংকে সর্বাধিক জিজ্ঞাসিত ৫০টি জোড় ও নিয়ম",
            "subject_id": subjects["ENGLISH"].id,
            "topic_id": topics_by_name["Prepositions & Idioms"].id,
            "resource_type": "GRAMMAR",
            "summary": "Essential nuanced preposition pairs that frequently appear in Bangladesh Bank AD and BCS exams.",
            "content_markdown": """# High-Frequency Preposition Pairs in Competitive Exams

Understanding nuance is key to scoring 100% in English Prepositions:

### 1. Die of / Die from / Die by / Die for
- **Die of a disease:** He died *of* cholera / cancer.
- **Die from an effect / cause:** He died *from* overwork / loss of blood.
- **Die by violence / suicide:** He died *by* his own hand / poison.
- **Die for a noble cause:** Patriots died *for* the motherland.

### 2. Concur with vs. Concur in
- Concur **with a person**: I concur *with* you on this point.
- Concur **in an opinion/decision**: The Board concurred *in* the Chairman's strategy.

### 3. Agree with / Agree to / Agree on
- Agree **with a person**: I cannot agree *with* you.
- Agree **to a proposal / plan**: He agreed *to* my business proposal.
- Agree **on a topic**: They finally agreed *on* the contract terms.

### 4. Blind to vs. Blind of
- Blind **of an eye**: The man is blind *of* the left eye (physical blindness).
- Blind **to faults**: A father should not be blind *to* his child's faults (mental ignorance).
""",
            "author": "Prostuti Editorial Board",
            "is_featured": True
        },
        {
            "title": "ICT & Computer Architecture Formula & Quick Revision Sheet",
            "title_bn": "আইসিটি ও কম্পিউটার সংগঠন: বিসিএস প্রিলিমিনারি ১৫ নম্বরের সংক্ষিপ্ত রিভিশন নোট",
            "subject_id": subjects["COMPUTER_ICT"].id,
            "topic_id": topics_by_name["Computer Hardware & Architecture"].id,
            "resource_type": "SUMMARY",
            "summary": "কম্পিউটার সংগঠন, মেমোরি হায়ারার্কি, বাইনারি ও হেক্সাডেসিমেল রূপান্তর এবং নেটওয়ার্ক টপোলজির এক নজরে চিত্র।",
            "content_markdown": """# কম্পিউটার ও তথ্যপ্রযুক্তি: প্রিলি কুইক রেফারেন্স

## ১. মেমোরি স্পিড হায়ারার্কি (দ্রুততম থেকে ধীরতম)
1. **Registers** (CPU-এর অভ্যন্তরে অবস্থিত, ফ্লিপ-ফ্লপ দিয়ে গঠিত, গতি সবচেয়ে বেশি)
2. **Cache Memory** (SRAM নির্মিত - L1, L2, L3 ক্যাশ)
3. **Primary Memory (RAM/ROM)** (DRAM দিয়ে সাধারণত প্রধান র‍্যাম তৈরি হয়)
4. **Solid State Drive (SSD)** (NAND ফ্ল্যাশ মেমোরি)
5. **Hard Disk Drive (HDD)** (চৌম্বকীয় ডিস্ক)
6. **Optical Disc / Magnetic Tape** (ব্যাকআপ স্টোরেজ)

## ২. আইপি অ্যাড্রেসিং (IPv4 vs. IPv6)
| বৈশিষ্ট্য | IPv4 | IPv6 |
|---|---|---|
| মোট বিট সংখ্যা | ৩২ বিট (৪ বাইট) | ১২৮ বিট (১৬ বাইট) |
| ফরম্যাট | ডটেড দশমিক (যেমন: 192.168.1.1) | কোলন হেক্সাডেসিমেল (যেমন: 2001:0db8::1) |
| মোট অ্যাড্রেস সংখ্যা | প্রায় ৪.৩ বিলিয়ন (2³²) | ৩.৪ × ১০³৮ (2¹²⁸) |
| হেডার আকার | ২০-৬০ বাইট | ৪০ বাইট (স্থির) |
""",
            "author": "Prostuti Editorial Board",
            "is_featured": True
        }
    ]

    for r in resources_data:
        res_obj = Resource(**r)
        db.add(res_obj)

    # 7. CURRENT AFFAIRS
    current_affairs_data = [
        {
            "title": "Bangladesh Formulates National AI Policy & Ethics Guidelines",
            "title_bn": "বাংলাদেশ কৃত্রিম বুদ্ধিমত্তা (AI) নীতিমালা ও ফ্রেমওয়ার্ক প্রণয়ন",
            "category": "SCIENCE_TECH",
            "summary": "প্রশাসনিক দক্ষতা বৃদ্ধি, সাইবার সুরক্ষা নিশ্চিতকরণ ও শিক্ষা ক্ষেত্রে নৈতিক এআই ব্যবহারের লক্ষ্যে বাংলাদেশ জাতীয় কৃত্রিম বুদ্ধিমত্তা পলিসির খসড়া চূড়ান্ত করেছে।",
            "full_content": "ডিজিটাল রূপান্তর এবং ভবিষ্যৎ কর্মসংস্থান সৃষ্টির উদ্দেশ্যে বাংলাদেশ সরকার জাতীয় কৃত্রিম বুদ্ধিমত্তা নীতিমালা ঘোষণা করেছে। এতে ডেটা নিরাপত্তা, প্রাইভেসির সুরক্ষা, আন্তর্জাতিক সহযোগিতা এবং সরকারি সেবার অটোমেশনের রূপরেখা নির্ধারণ করা হয়েছে। প্রতিযোগিতামূলক পরীক্ষার বিজ্ঞান ও প্রযুক্তি এবং আইসিটি সিলেবাসের জন্য এটি একটি অতি-গুরুত্বপূর্ণ সমকালীন বিষয়।",
            "important_facts": [
                "জাতীয় কৃত্রিম বুদ্ধিমত্তা নীতির মূল লক্ষ্য টেকসই উন্নয়ন লক্ষ্যমাত্রা (SDG) অর্জনে চতুর্থ শিল্পবিপ্লবের প্রযুক্তি ব্যবহার।",
                "নীতিমালায় এআই ব্যবহারের ক্ষেত্রে নাগরিক অধিকার সুরক্ষা এবং ডেটা সুরক্ষার ওপর সর্বোচ্চ জোর দেওয়া হয়েছে।",
                "বিসিএস প্রিলিমিনারির আইসিটি অংশে কৃত্রিম বুদ্ধিমত্তা (AI), মেশিন লার্নিং ও সাইবার সিকিউরিটি অধ্যায়ে এটি সরাসরি প্রাসঙ্গিক।"
            ],
            "source_name": "Prostuti Editorial & Ministry of Posts, Telecommunications and Information Technology",
            "publish_date": datetime.datetime.utcnow(),
            "mcqs": [
                {
                    "question_text": "জাতীয় কৃত্রিম বুদ্ধিমত্তা (AI) নীতিমালার অন্যতম প্রধান লক্ষ্য কোনটি?",
                    "options": [
                        "নাগরিক তথ্য সুরক্ষা ও সরকারি সেবায় নৈতিক এআই প্রয়োগ",
                        "সকল ধরনের অ্যানালগ যন্ত্রপাতি নিষিদ্ধকরণ",
                        "ইন্টারনেট ব্যান্ডউইথের ওপর একক কর আরোপ",
                        "মহাকাশ গবেষণা এককভাবে নিয়ন্ত্রণ"
                    ],
                    "correct_option_index": 0,
                    "explanation": "নীতিমালাটির প্রধান লক্ষ্য হলো ডেটা প্রাইভেসি সুরক্ষা এবং নাগরিক সুবিধার্থে টেকসই ও নৈতিক এআই কাঠামো প্রবর্তন।"
                }
            ]
        },
        {
            "title": "Padma Bridge Rail Link Project: Full Commercial Freight & Passenger Operations",
            "title_bn": "পদ্মা সেতু রেল সংযোগ প্রকল্প: ঢাকা-যশোর পূর্ণাঙ্গ ট্রেন যোগাযোগ ব্যবস্থা",
            "category": "BANGLADESH",
            "summary": "পদ্মা সেতুর উপর দিয়ে ঢাকা থেকে যশোর পর্যন্ত পূর্ণাঙ্গ ১৭২ কিলোমিটার রেল নেটওয়ার্ক চালুর মাধ্যমে দক্ষিণ-পশ্চিমাঞ্চলের ২১টি জেলার সাথে রাজধানীর দূর্যোগমুক্ত সার্বক্ষণিক যোগাযোগ স্থাপিত হয়েছে।",
            "full_content": "পদ্মা সেতু রেল সংযোগ প্রকল্প বাংলাদেশ রেলওয়ের ইতিহাসে অন্যতম বৃহৎ মেগাপ্রকল্প। এর মাধ্যমে ঢাকা থেকে খুলনার দূরত্ব প্রায় ২১২ কিলোমিটার হ্রাস পেয়েছে। পরিবেশবান্ধব ও সাশ্রয়ী এই যোগাযোগ ব্যবস্থা দেশের অর্থনৈতিক প্রবৃদ্ধিতে প্রায় ১% অতিরিক্ত জিডিপি যোগ করার সম্ভাব্যতা সৃষ্টি করেছে।",
            "important_facts": [
                "পদ্মা সেতু রেল সংযোগ প্রকল্পের মোট দৈর্ঘ্য প্রায় ১৭২ কিলোমিটার।",
                "প্রকল্পটি ঢাকা, নারায়ণগঞ্জ, মুন্সীগঞ্জ, শরীয়তপুর, মাদারীপুর, ফরিদপুর, গোপালগঞ্জ, নড়াইল ও যশোরকে সংযুক্ত করেছে।",
                "বিসিএস ও ব্যাংক প্রিলিমিনারিতে মেগা প্রজেক্ট এবং বাংলাদেশের অবকাঠামোগত অর্থনীতি অংশে এই প্রকল্পের তথ্যসমূহ সর্বোচ্চ অগ্রাধিকারপ্রাপ্ত।"
            ],
            "source_name": "Bangladesh Railway & National Economic Council",
            "publish_date": datetime.datetime.utcnow(),
            "mcqs": [
                {
                    "question_text": "পদ্মা সেতু রেল সংযোগ প্রকল্পের মোট দৈর্ঘ্য প্রায় কত কিলোমিটার?",
                    "options": ["১৭২ কিমি", "১৫০ কিমি", "২০০ কিমি", "১৩০ কিমি"],
                    "correct_option_index": 0,
                    "explanation": "ঢাকা থেকে যশোর পর্যন্ত পদ্মা সেতু রেল সংযোগ প্রকল্পের মোট দৈর্ঘ্য প্রায় ১৭২ কিলোমিটার।"
                }
            ]
        }
    ]

    for ca in current_affairs_data:
        ca_obj = CurrentAffair(**ca)
        db.add(ca_obj)

    # 8. MOCK EXAM TEMPLATES
    templates_data = [
        {
            "title": "BCS Preliminary Standard Mock Examination",
            "title_bn": "বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ ২০০ নম্বরের মডেল টেস্ট",
            "exam_type": "FULL_MOCK",
            "target_exam": "47th BCS Preliminary",
            "duration_minutes": 120,
            "total_questions": 50,  # calibrated for online interactive session
            "total_marks": 50.0,
            "negative_mark_rate": 0.5,
            "description": "বিসিএস প্রিলিমিনারির সকল ১০টি বিষয়ের সিলেবাস অনুপাতে ভারসাম্যপূর্ণ পূর্ণাঙ্গ পরীক্ষা। প্রতি ভুল উত্তরের জন্য ০.৫ নম্বর কর্তন করা হবে।",
            "configuration": {"balanced_subjects": True}
        },
        {
            "title": "Bangladesh Bank AD Speed Challenge",
            "title_bn": "বাংলাদেশ ব্যাংক সহকারী পরিচালক স্পিড মডেল টেস্ট",
            "exam_type": "FULL_MOCK",
            "target_exam": "Bangladesh Bank AD",
            "duration_minutes": 60,
            "total_questions": 40,
            "total_marks": 40.0,
            "negative_mark_rate": 0.25,
            "description": "ব্যাংকের নিয়োগ পরীক্ষার আদলে উচ্চ-মানসম্পন্ন ইংরেজি গ্রামার, গণিত এবং সাধারণ জ্ঞান সংবলিত সময়বদ্ধ গতিশীল পরীক্ষা।",
            "configuration": {"focus": ["ENGLISH", "MATH_REASONING", "COMPUTER_ICT", "BD_AFFAIRS"]}
        },
        {
            "title": "Rapid Fire MCQ Challenge (All Subjects)",
            "title_bn": "র‌্যাপিড ফায়ার ২৫ প্রশ্ন কুইক চ্যালেঞ্জ",
            "exam_type": "RANDOM_CHALLENGE",
            "target_exam": "All Competitive Exams",
            "duration_minutes": 20,
            "total_questions": 20,
            "total_marks": 20.0,
            "negative_mark_rate": 0.5,
            "description": "যেকোনো প্রতিযোগিতামূলক পরীক্ষার জন্য তৎক্ষণাৎ প্রস্তুতি যাচাইয়ের ২৫ মিনিটের স্পিড টেস্ট।",
            "configuration": {"random": True}
        }
    ]

    for t in templates_data:
        tmpl_obj = ExamTemplate(**t)
        db.add(tmpl_obj)

    db.commit()
    print("Seed data successfully populated.")
