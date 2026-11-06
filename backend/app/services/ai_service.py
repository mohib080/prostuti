import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    """
    Provider-independent AI Service Layer for PROSTUTI.
    Integrates Gemini API when available, with a built-in pedagogical knowledge engine
    grounded in Bangladesh competitive examinations (BCS, Bank Recruitment, BPSC Non-Cadre, Primary & NTRCA).
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    async def _call_gemini_api(self, prompt: str, system_instruction: Optional[str] = None) -> Optional[str]:
        if not self.api_key:
            return None
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        
        payload: Dict[str, Any] = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.4,
                "topP": 0.9,
                "maxOutputTokens": 2048,
            }
        }
        if system_instruction:
            payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}
            
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
                else:
                    logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
        return None

    async def generate_probable_questions(
        self,
        target_exam: str,
        subject_name: str,
        topic_name: Optional[str],
        difficulty: str = "MEDIUM",
        language: str = "BN",
        question_count: int = 5,
        additional_instructions: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Generates probable practice MCQs modeled after previous question frequency,
        curriculum syllabuses, and recent events.
        """
        system_prompt = (
            "You are a Senior Question Formulation Specialist and Examiner for Bangladesh Civil Service (BCS) "
            "and Bank Recruitment exams. You strictly output valid JSON in the requested format without markdown wrapping."
        )
        user_prompt = f"""Generate {question_count} high-standard probable multiple choice questions for Bangladesh competitive exams.
Target Examination: {target_exam}
Subject: {subject_name}
Topic: {topic_name or 'High frequency repetitive topics'}
Difficulty: {difficulty}
Language: {language} (Bengali 'BN' or English 'EN')
Additional notes: {additional_instructions or 'None'}

REQUIREMENTS:
1. Adhere to actual BCS Preliminary / Bangladesh Bank AD question standards and patterns.
2. Provide exactly 4 options.
3. Indicate correct_option_index (0, 1, 2, or 3).
4. Provide a rich, accurate explanation with historical/factual context.
5. Clearly indicate why this concept is probable based on syllabus frequency.
6. JSON schema format:
[
  {{
    "question_text": "...",
    "options": ["A", "B", "C", "D"],
    "correct_option_index": 0,
    "explanation": "...",
    "curriculum_relevance": "...",
    "difficulty": "{difficulty}"
  }}
]"""
        raw_response = await self._call_gemini_api(user_prompt, system_prompt)
        if raw_response:
            try:
                clean_json = raw_response.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]
                parsed = json.loads(clean_json.strip())
                if isinstance(parsed, list):
                    for item in parsed:
                        item["subject_name"] = subject_name
                        item["topic_name"] = topic_name or "সাধারণ ধারণা"
                        item["is_ai_generated"] = True
                    return parsed
            except Exception as e:
                logger.warning(f"Failed to parse Gemini probable question JSON: {e}")

        # High-quality fallback knowledge bank for key subjects
        return self._generate_fallback_probable_questions(
            target_exam, subject_name, topic_name, difficulty, language, question_count
        )

    def _generate_fallback_probable_questions(
        self,
        target_exam: str,
        subject_name: str,
        topic_name: Optional[str],
        difficulty: str,
        language: str,
        count: int
    ) -> List[Dict[str, Any]]:
        bank = [
            {
                "subject": "বাংলাদেশ বিষয়াবলী",
                "topic": "বাংলাদেশের সংবিধান",
                "question_text": "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানে 'মৌলিক অধিকার বলবৎকরণ' সম্পর্কিত বিধান কোন অনুচ্ছেদে অন্তর্ভুক্ত?",
                "options": [
                    "অনুচ্ছেদ ৪৪",
                    "অনুচ্ছেদ ২৭",
                    "অনুচ্ছেদ ১০২",
                    "অনুচ্ছেদ ৩৩"
                ],
                "correct_option_index": 0,
                "explanation": "সংবিধানের তৃতীয় ভাগের অনুচ্ছেদ ৪৪(১) অনুযায়ী মৌলিক অধিকার বলবৎ করার জন্য সুপ্রিম কোর্টের হাইকোর্ট বিভাগে আবেদন করার অধিকার নিশ্চিত করা হয়েছে। আর অনুচ্ছেদ ১০২ হলো হাইকোর্ট বিভাগের রিট এখতিয়ার সংক্রান্ত বিধান।",
                "curriculum_relevance": "বিসিএস প্রিলিমিনারিতে সংবিধানের তৃতীয় ভাগ (মৌলিক অধিকার) থেকে প্রতি বছর নিশ্চিত ২-৩টি প্রশ্ন আসে।",
                "difficulty": "MEDIUM"
            },
            {
                "subject": "বাংলাদেশ বিষয়াবলী",
                "topic": "মুক্তিযুদ্ধ ও ইতিহাস",
                "question_text": "১৯৭১ সালের ১৭ এপ্রিল গঠিত মুজিবনগর সরকারের 'প্রধানমন্ত্রী' কে ছিলেন?",
                "options": [
                    "তাজউদ্দীন আহমদ",
                    "সৈয়দ নজরুল ইসলাম",
                    "ক্যাপ্টেন এম. মনসুর আলী",
                    "এ. এইচ. এম. কামারুজ্জামান"
                ],
                "correct_option_index": 0,
                "explanation": "১৯৭১ সালের ১০ এপ্রিল গঠিত এবং ১৭ এপ্রিল মেহেরপুরের বৈদ্যনাথতলার (বর্তমান মুজিবনগর) আম্রকাননে শপথ গ্রহণকারী প্রবাসী বাংলাদেশ সরকারের প্রধানমন্ত্রী ছিলেন তাজউদ্দীন আহমদ এবং উপ-রাষ্ট্রপতি ও অস্থায়ী রাষ্ট্রপতি ছিলেন সৈয়দ নজরুল ইসলাম।",
                "curriculum_relevance": "মুজিবনগর সরকার এবং মুক্তিযুদ্ধের পটভূমি বিসিএস ও ব্যাংক প্রিলিমিনারির ৩ নম্বর অনুচ্ছেদের সর্বোচ্চ অগ্রাধিকারপ্রাপ্ত টপিক।",
                "difficulty": "EASY"
            },
            {
                "subject": "বাংলা ভাষা ও সাহিত্য",
                "topic": "প্রাচীন ও মধ্যযুগ",
                "question_text": "'চর্যাপদ' এর সর্বাধিক পদ রচয়িতা পদকর্তা কে এবং তিনি কতটি পদ রচনা করেন?",
                "options": [
                    "কাহ্নপা (১৩টি)",
                    "লুইপা (২টি)",
                    "ভুসুকুপা (৮টি)",
                    "শবরপা (৪টি)"
                ],
                "correct_option_index": 0,
                "explanation": "চর্যাপদের সর্বাধিক পদ রচয়িতা কাহ্নপা বা কৃষ্ণাচার্য্যপাদ। তিনি মোট ১৩টি পদ রচনা করেন (২৪তম পদটি বিনষ্ট বা খণ্ডিত হওয়ায় মতান্তরে ১২টি ও অর্ধ পদ ধরা হয়)। দ্বিতীয় সর্বোচ্চ পদকর্তা ভুসুকুপা (৮টি)।",
                "curriculum_relevance": "বাংলা সাহিত্যের প্রাচীন যুগ অংশের সবচেয়ে বহুল জিজ্ঞাসিত প্রশ্ন। বিগত ৮টি বিসিএসে ৬ বার চর্যাপদ বিষয়ক প্রশ্ন এসেছে।",
                "difficulty": "MEDIUM"
            },
            {
                "subject": "English Language & Literature",
                "topic": "Grammar & Prepositions",
                "question_text": "Choose the appropriate preposition: 'The committee concurred ______ the Chairman's proposal.'",
                "options": [
                    "in",
                    "with",
                    "to",
                    "at"
                ],
                "correct_option_index": 0,
                "explanation": "'Concur with' a person (কারও সাথে একমত হওয়া), কিন্তু 'concur in' an opinion/proposal/decision (কোনো সিদ্ধান্ত বা প্রস্তাবে একমত পোষণ করা)। যেহেতু 'the Chairman's proposal' একটি প্রস্তাব, তাই সঠিক preposition হলো 'in'.",
                "curriculum_relevance": "Appropriate Prepositions have strict nuance rules frequently tested in Bangladesh Bank AD and Combined Bank exams.",
                "difficulty": "HARD"
            },
            {
                "subject": "আন্তর্জাতিক বিষয়াবলী",
                "topic": "আন্তর্জাতিক সংস্থা ও চুক্তি",
                "question_text": "জলবায়ু পরিবর্তন মোকাবেলায় স্বাক্ষরিত 'প্যারিস চুক্তি' (Paris Agreement) কোন সালে কার্যকর হয়?",
                "options": [
                    "২০১৬ সালের ৪ নভেম্বর",
                    "২০১৫ সালের ১২ ডিসেম্বর",
                    "২০১৭ সালের ১ জানুয়ারি",
                    "২০১৮ সালের ২২ এপ্রিল"
                ],
                "correct_option_index": 0,
                "explanation": "প্যারিস চুক্তি ২০১৫ সালের ১২ ডিসেম্বর COP21 সম্মেলনে গৃহীত হয়, ২০১৬ সালের ২২ এপ্রিল স্বাক্ষরের জন্য উন্মুক্ত করা হয় এবং ২০১৬ সালের ৪ নভেম্বর আনুষ্ঠানিকভাবে কার্যকর (Entry into force) হয়।",
                "curriculum_relevance": "আন্তর্জাতিক পরিবেশ ও জলবায়ু কূটনীতি অধ্যায় থেকে সাম্প্রতিক এবং মৌলিক প্রশ্ন নিয়মিত আসে।",
                "difficulty": "MEDIUM"
            },
            {
                "subject": "কম্পিউটার ও তথ্যপ্রযুক্তি",
                "topic": "নেটওয়ার্কিং ও ক্লাউড কম্পিউটিং",
                "question_text": "IPv6 (Internet Protocol version 6) অ্যাড্রেস কত বিটের হয়ে থাকে?",
                "options": [
                    "১২৮ বিট",
                    "৬৪ বিট",
                    "৩২ বিট",
                    "২৫৬ বিট"
                ],
                "correct_option_index": 0,
                "explanation": "IPv4 অ্যাড্রেস ৩২ বিটের (৪ বাইট) এবং IPv6 অ্যাড্রেস ১২৮ বিটের (১৬ বাইট) হয়ে থাকে। IPv6-এ ৮টি গ্রুপে প্রতিটি ৪টি হেক্সাডেসিমেল ডিজিট কোলন (:) দিয়ে বিভক্ত থাকে।",
                "curriculum_relevance": "কম্পিউটার ও তথ্যপ্রযুক্তিতে কম্পিউটার নেটওয়ার্কিং ও আইপি অ্যাড্রেসিং পিএসসি বিসিএসের সিলেবাসের অপরিহার্য অংশ।",
                "difficulty": "EASY"
            },
            {
                "subject": "গাণিতিক যুক্তি",
                "topic": "শতকরা ও লাভ-ক্ষতি",
                "question_text": "একটি দ্রব্যের বিক্রয়মূল্য ক্রয়মূল্যের ৪/৩ অংশ হলে, শতকরা লাভের হার কত?",
                "options": [
                    "৩৩.৩৩%",
                    "২৫%",
                    "২০%",
                    "৫০%"
                ],
                "correct_option_index": 0,
                "explanation": "ধরি ক্রয়মূল্য ৩ টাকা। তাহলে বিক্রয়মূল্য ৪ টাকা। লাভ = ৪ - ৩ = ১ টাকা। সুতরাং শতকরা লাভ = (১ / ৩) × ১০০% = ৩৩.৩৩% বা ৩৩ ১/৩%।",
                "curriculum_relevance": "পাটিগণিতের লাভ-ক্ষতি ও অনুপাত অধ্যায় থেকে বিসিএস ও ব্যাংক প্রিলিমিনারিতে প্রতি বছর সমমানের অংক আসে।",
                "difficulty": "EASY"
            }
        ]

        # Filter or adapt to match requested subject if possible
        matched = [q for q in bank if subject_name.lower() in q["subject"].lower() or q["subject"].lower() in subject_name.lower()]
        if not matched:
            matched = bank

        results = []
        for i in range(min(count, len(matched) * 2)):
            item = matched[i % len(matched)].copy()
            item["subject_name"] = subject_name
            item["topic_name"] = topic_name or item.get("topic", "গুরুত্বপূর্ণ অধ্যায়")
            item["is_ai_generated"] = True
            results.append(item)
            if len(results) >= count:
                break
        return results

    async def chat_assistant(
        self,
        messages: List[Dict[str, str]],
        context_type: str = "GENERAL",
        context_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Interactive study mentor for Prostuti AI:
        Explains previous questions, breaks down math, parses grammar, and formulates written answers.
        """
        last_message = messages[-1]["content"] if messages else ""
        system_prompt = (
            "You are Prostuti AI (প্রস্তুতি এআই), Bangladesh's premier competitive examination study assistant. "
            "You are scholarly, supportive, precise, and completely grounded in the official BCS (BPSC) and Bangladesh Bank curricula. "
            "Respond in the language of the query (Bengali or English). Provide clear explanations, reference articles/formulas, "
            "and suggest relevant followup examination questions."
        )

        formatted_prompt = f"Context: {context_type}\n"
        if context_data:
            formatted_prompt += f"Context Data: {json.dumps(context_data, ensure_ascii=False)}\n\n"
        formatted_prompt += f"User Query: {last_message}"

        api_response = await self._call_gemini_api(formatted_prompt, system_prompt)
        if api_response:
            return {
                "reply": api_response,
                "suggested_followups": [
                    "এই সম্পর্কিত বিগত বিসিএস পরীক্ষার প্রশ্নগুলো কী ছিল?",
                    "টপিকটির সবচেয়ে প্রচলিত বিভ্রান্তিকর অপশনগুলো কী?",
                    "লিখিত পরীক্ষার জন্য এই টপিকের মডেল উত্তর কেমন হবে?"
                ],
                "grounding_references": ["বিসিএস প্রিলিমিনারি সিলেবাস (পিএসসি)", "বাংলাদেশের সংবিধান", "উচ্চ মাধ্যমিক পাঠ্যবই"]
            }

        # Dynamic fallback response generator based on query intent
        reply_text = self._build_assistant_fallback(last_message, context_type, context_data)
        return {
            "reply": reply_text,
            "suggested_followups": [
                "এই টপিকের বিগত ১০ বছরের প্রশ্ন দেখাও",
                "সম্পর্কিত সংক্ষিপ্ত টেকনিক বা শর্টকাট সূত্র কী?",
                "এই অধ্যায় থেকে ৩টি সম্ভাব্য মডেল প্রশ্ন অনুশীলন করতে চাই"
            ],
            "grounding_references": [
                "পিএসসি বিসিএস প্রিলিমিনারি সিলেবাস ও কারিকুলাম",
                "বাংলাদেশ ব্যাংক সহকারী পরিচালক বিগত প্রশ্ন সংকলন",
                "বাংলা একাডেমি প্রমিত বাংলা ব্যাকরণ ও অভিধান"
            ]
        }

    def _build_assistant_fallback(
        self,
        query: str,
        context_type: str,
        context_data: Optional[Dict[str, Any]]
    ) -> str:
        q_lower = query.lower()
        
        # Math detection
        if any(w in q_lower for w in ["math", "অংক", "সমাধান", "লাভ", "শতকরা", "ধারার", "লগ", "log", "সূচক"]):
            return (
                "### 📐 গাণিতিক সমাধান ও ধাপসমূহ (Step-by-Step Mathematical Solution):\n\n"
                "**প্রদত্ত সমস্যা বিশ্লেষণ:**\n"
                f"> {query}\n\n"
                "**ধাপ ১: সূত্র নির্ধারণ (Core Formula):**\n"
                "- লাভ বা ক্ষতির হিসাব সবসময় **ক্রয়মূল্যের** উপর ভিত্তি করে হয়।\n"
                "- শতকরা লাভ = `(মোট লাভ ÷ ক্রয়মূল্য) × ১০০%`\n"
                "- ধারা বা অনুক্রমের ক্ষেত্রে সাধারণ অন্তর `d = a₂ - a₁` বা সাধারণ অনুপাত `r = a₂ ÷ a₁`।\n\n"
                "**ধাপ ২: গাণিতিক ক্যালকুলেশন:**\n"
                "বিসিএস ও ব্যাংক প্রিলিমিনারিতে সময় বাঁচাতে অপশন টেস্ট অথবা শর্টকাট ট্রিক্স প্রয়োগ করুন। ক্যালকুলেটর ছাড়া দ্রুত হিসাব করতে ভগ্নাংশকে দশমিকে রূপান্তর করার সাধারণ মানগুলো (যেমন: ১/৩ = ৩৩.৩৩%, ১/৬ = ১৬.৬৭%, ১/৮ = ১২.৫%) মুখস্থ রাখা কার্যকরী।\n\n"
                "**পরীক্ষার টিপস (Exam Strategy):**\n"
                "লিখিত পরীক্ষায় প্রতিটি ধাপ বিস্তারিত লিখে ব্যাখ্যা করবেন; প্রিলিতে সরাসরি অপশন এলিমিনেশন মেথড প্রয়োগ করবেন।"
            )

        # Constitution / Bangladesh Affairs
        if any(w in q_lower for w in ["সংবিধান", "অনুচ্ছেদ", "constitution", "article", "মুজিবনগর", "মুক্তিযুদ্ধ"]):
            return (
                "### 🇧🇩 বাংলাদেশ বিষয়াবলী বিশেষ বিশ্লেষণ (Prostuti Knowledge Note):\n\n"
                "**মূল তথ্য ও সাংবিধানিক রেফারেন্স:**\n"
                "- **বাংলাদেশের সংবিধান:** ১৯৭২ সালের ৪ নভেম্বর গণপরিষদে গৃহীত এবং ১৬ ডিসেম্বর কার্যকর হয়। এতে মোট ১১টি ভাগ, ১৫৩টি অনুচ্ছেদ এবং ৭টি তফসিল রয়েছে।\n"
                "- **মৌলিক অধিকার বনাম রাষ্ট্র পরিচালনার মূলনীতি:** অনুচ্ছেদ ২৭ থেকে ৪৪ পর্যন্ত হলো মৌলিক অধিকার (যা আদালত কর্তৃক বলবৎযোগ্য)। অনুচ্ছেদ ৮ থেকে ২৫ হলো মূলনীতি (আদালতে বলবৎযোগ্য নয়)।\n"
                "- **বিসিএস প্রিলির বিশেষ টিপ:** অনুচ্ছেদ ৭ (সংবিধানের প্রাধান্য), ১৯ (সুযোগের সমতা), ২৭ (আইনের দৃষ্টিতে সমতা), ৩৬-৪৪ (মৌলিক অধিকারসমূহ), এবং ৭০ (সংসদে ভোটদান) সর্বাধিক কমন টপিক।\n\n"
                "আপনি কি এই অনুচ্ছেদের ওপর বিগত বিসিএসের প্রশ্নগুলো অনুশীলন করতে চান?"
            )

        # English Grammar
        if any(w in q_lower for w in ["english", "grammar", "preposition", "idiom", "voice", "narration", "vocabulary"]):
            return (
                "### 📖 English Grammar & Vocabulary Master Note:\n\n"
                "**Core Linguistic Concept:**\n"
                "- In competitive exams like BCS and Bank Recruitment, questions focus heavily on **Subject-Verb Agreement**, **Inversion**, **Subjunctive Mood**, and **Phrasal Collocations**.\n"
                "- *Key Rule to remember:* Words like *neither...nor*, *either...or*, *not only...but also* agree with the closest subject.\n"
                "- Expressions like *with, along with, together with, as well as, accompanied by* take verbs agreeing with the first subject.\n\n"
                "**Bank Exam Focus:** Look out for contextual vocabulary, sentence correction, and critical reasoning passages."
            )

        # General response
        return (
            f"### 🎯 প্রস্তুতি এআই স্টাডি অ্যাসিস্ট্যান্ট (Prostuti AI Study Guide)\n\n"
            f"আপনার প্রশ্ন: **\"{query}\"**\n\n"
            "বাংলাদেশের প্রতিযোগিতামূলক পরীক্ষা (বিসিএস, বাংলাদেশ ব্যাংক এবং প্রাথমিক শিক্ষক নিয়োগ) প্রস্তুতির দৃষ্টিকোণ থেকে এই বিষয়টি অত্যন্ত তাৎপর্যপূর্ণ।\n\n"
            "**গুরুত্বপূর্ণ প্রস্তুতি পরামর্শ:**\n"
            "১. বিগত ২০ বছরের বিসিএস প্রিলিমিনারি ও ব্যাংক পরীক্ষার প্রশ্নব্যাংক বিশ্লেষণ করুন।\n"
            "২. কেবল মুখস্থ না করে মূল ধারণার কার্যকারণ সম্পর্ক এবং ব্যতিক্রম নিয়মগুলো নোট করুন।\n"
            "৩. প্রিলিমিনারির পাশাপাশি লিখিত পরীক্ষার দৃষ্টিভঙ্গিতে তথ্যগুলো গুছিয়ে রাখার অভ্যাস গড়ে তুলুন।\n\n"
            "নিচের যেকোনো অপশন নির্বাচন করে আপনি আরও গভীর অনুশীলন করতে পারেন:"
        )

    async def generate_current_affairs_mcqs(
        self,
        title: str,
        summary: str,
        important_facts: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Generates 2-3 examination MCQs directly from a current affairs story.
        """
        facts_text = "\n".join(f"- {f}" for f in important_facts)
        system_prompt = "You create accurate exam-level MCQs from current affairs. Output strictly valid JSON."
        user_prompt = f"""Generate 2 high-quality BCS-level MCQs from this current affairs article:
Title: {title}
Summary: {summary}
Important Facts:
{facts_text}

Format JSON:
[
  {{
    "question_text": "...",
    "options": ["...", "...", "...", "..."],
    "correct_option_index": 0,
    "explanation": "..."
  }}
]"""
        raw = await self._call_gemini_api(user_prompt, system_prompt)
        if raw:
            try:
                clean = raw.strip()
                if clean.startswith("```json"):
                    clean = clean[7:]
                if clean.endswith("```"):
                    clean = clean[:-3]
                return json.loads(clean.strip())
            except Exception:
                pass

        # Fallback generated MCQ
        return [
            {
                "question_text": f"সাম্প্রতিক ঘটনাবলী: {title} সম্পর্কিত সঠিক তথ্য কোনটি?",
                "options": [
                    important_facts[0] if important_facts else summary[:60],
                    "উদ্বোধনের তারিখ এখনও ঘোষণা করা হয়নি",
                    "এটি একটি দ্বিপাক্ষিক অর্থনৈতিক সমীক্ষা মাত্র",
                    "উক্ত পদক্ষেপটি আন্তর্জাতিক মুদ্রা তহবিল কর্তৃক বাতিল ঘোষিত"
                ],
                "correct_option_index": 0,
                "explanation": f"সঠিক উত্তর প্রথম বিকল্প। {summary}"
            }
        ]

ai_service = AIService()
