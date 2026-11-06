"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  AlertTriangle,
  Award,
  Layers,
  Settings,
  Sparkles,
  Send
} from "lucide-react";
import { getExamTemplates, getFilterMetadata, startExam, submitExam } from "@/lib/api";
import { ExamTemplate, FilterMetadata, ExamSession, ExamResult, AnswerSubmissionItem } from "@/lib/types";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { QuestionPalette } from "@/components/exam/QuestionPalette";
import { ExamResultView } from "@/components/exam/ExamResultView";

function ExamHallContent() {
  const searchParams = useSearchParams();
  const preselectedTemplateId = searchParams.get("template_id");

  // State machine: "LOBBY" | "LIVE_EXAM" | "RESULT"
  const [viewState, setViewState] = useState<"LOBBY" | "LIVE_EXAM" | "RESULT">("LOBBY");

  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [meta, setMeta] = useState<FilterMetadata | null>(null);

  // Custom Exam Config
  const [examMode, setExamMode] = useState<string>("FULL_MOCK");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    preselectedTemplateId ? Number(preselectedTemplateId) : null
  );
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [customQuestionsCount, setCustomQuestionsCount] = useState<number>(20);
  const [customDurationMinutes, setCustomDurationMinutes] = useState<number>(20);
  const [negativeMarkRate, setNegativeMarkRate] = useState<number>(0.5);
  const [questionSource, setQuestionSource] = useState<string>("ALL");

  // Live Exam State
  const [activeSession, setActiveSession] = useState<ExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [reviewMarks, setReviewMarks] = useState<Record<number, boolean>>({});
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Result state
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const [tmpls, metadata] = await Promise.all([getExamTemplates(), getFilterMetadata()]);
        setTemplates(tmpls);
        setMeta(metadata);

        if (preselectedTemplateId) {
          setSelectedTemplateId(Number(preselectedTemplateId));
        }
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, [preselectedTemplateId]);

  // Start Exam Handler
  const handleStartExam = async (templateId?: number) => {
    try {
      const tmpl = templates.find((t) => t.id === (templateId || selectedTemplateId));
      const res = await startExam({
        template_id: tmpl?.id,
        mode: examMode,
        title: tmpl?.title_bn || "কাস্টম মক পরীক্ষা",
        subject_ids: selectedSubjects.length > 0 ? selectedSubjects : undefined,
        total_questions: tmpl ? tmpl.total_questions : customQuestionsCount,
        duration_minutes: tmpl ? tmpl.duration_minutes : customDurationMinutes,
        negative_mark_rate: tmpl ? tmpl.negative_mark_rate : negativeMarkRate,
        question_source: questionSource,
      });

      setActiveSession(res);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setReviewMarks({});
      setTimeTakenSeconds(0);
      setViewState("LIVE_EXAM");
    } catch (e: any) {
      alert("পরীক্ষা শুরু করতে ব্যর্থ হয়েছে: " + e.message);
    }
  };

  // Submit Exam Handler
  const handleFinalSubmit = async () => {
    if (!activeSession || isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const submissionList: AnswerSubmissionItem[] = activeSession.questions.map((q, idx) => ({
        question_id: q.id,
        selected_option_index: answers[idx] !== undefined ? answers[idx] : null,
        marked_for_review: reviewMarks[idx] || false,
      }));

      const result = await submitExam({
        session_id: activeSession.session_id,
        title: activeSession.title,
        duration_minutes: activeSession.duration_minutes,
        time_taken_seconds: timeTakenSeconds || 1,
        negative_mark_rate: activeSession.negative_mark_rate,
        answers: submissionList,
      });

      setExamResult(result);
      setViewState("RESULT");
    } catch (e: any) {
      alert("ফলাফল প্রক্রিয়া করতে ব্যর্থ হয়েছে: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: prev[currentQuestionIndex] === optIdx ? null : optIdx,
    }));
  };

  const toggleReviewMark = () => {
    setReviewMarks((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const optionLabels = ["ক", "খ", "গ", "ঘ"];
  const optionLetters = ["A", "B", "C", "D"];

  // ================= VIEW: RESULT =================
  if (viewState === "RESULT" && examResult) {
    return (
      <ExamResultView
        result={examResult}
        onRetake={() => {
          setViewState("LOBBY");
          setExamResult(null);
        }}
      />
    );
  }

  // ================= VIEW: LIVE EXAM INTERFACE =================
  if (viewState === "LIVE_EXAM" && activeSession) {
    const activeQ = activeSession.questions[currentQuestionIndex];
    const isLast = currentQuestionIndex === activeSession.questions.length - 1;
    const isFirst = currentQuestionIndex === 0;
    const selectedOption = answers[currentQuestionIndex];
    const isMarkedReview = reviewMarks[currentQuestionIndex];

    return (
      <div className="space-y-6 pb-20 max-w-6xl mx-auto">
        {/* Distraction-Free Sticky Exam Header */}
        <div className="sticky top-16 z-20 flex items-center justify-between p-4 bg-[#0A101E]/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white line-clamp-1">
                {activeSession.title}
              </h2>
              <div className="text-[11px] text-slate-400">
                মোট প্রশ্ন: {activeSession.total_questions}টি • নেগেটিভ: -{activeSession.negative_mark_rate}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ExamTimer
              durationMinutes={activeSession.duration_minutes}
              onTimeExpired={handleFinalSubmit}
              onTick={(secondsRemaining) => {
                const totalSec = activeSession.duration_minutes * 60;
                setTimeTakenSeconds(totalSec - secondsRemaining);
              }}
            />

            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>সাবমিট করুন</span>
            </button>
          </div>
        </div>

        {/* Main Examination Layout: Question Canvas + Palette */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Canvas (2 Columns) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-[#0E1626] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              {/* Question Metadata */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs border border-blue-500/30">
                    প্রশ্ন {currentQuestionIndex + 1}
                  </span>
                  {activeQ.subject_name_bn && (
                    <span className="text-xs font-semibold text-slate-300">
                      {activeQ.subject_name_bn}
                    </span>
                  )}
                  {activeQ.topic_name && (
                    <span className="text-xs text-slate-500">
                      • {activeQ.topic_name}
                    </span>
                  )}
                </div>

                <button
                  onClick={toggleReviewMark}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    isMarkedReview
                      ? "bg-violet-600 text-white border-violet-400 shadow-sm"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isMarkedReview ? "রিভিউ চিহ্নিত" : "রিভিউ মার্ক করুন"}</span>
                </button>
              </div>

              {/* Question Text */}
              <h3 className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed mb-6">
                {activeQ.question_text_bn || activeQ.question_text}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {activeQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border text-left text-sm md:text-base transition-all ${
                        isSelected
                          ? "bg-blue-600/20 border-blue-500 text-white font-medium shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50"
                          : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200"
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {activeQ.language === "BN" ? optionLabels[idx] : optionLetters[idx]}
                      </span>
                      <span className="flex-1 mt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Nav: Prev, Clear, Next */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800/80">
                <button
                  disabled={isFirst}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 disabled:opacity-30 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> পূর্ববর্তী
                </button>

                {selectedOption !== null && selectedOption !== undefined && (
                  <button
                    onClick={() => handleSelectOption(selectedOption)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    উত্তর বাতিল করুন (Clear Answer)
                  </button>
                )}

                <button
                  disabled={isLast}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(activeSession.questions.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 disabled:opacity-30 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                >
                  পরবর্তী <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (1 Column) */}
          <div className="space-y-5">
            <QuestionPalette
              totalQuestions={activeSession.questions.length}
              currentIndex={currentQuestionIndex}
              answers={answers}
              reviewMarks={reviewMarks}
              onSelectQuestion={(idx) => setCurrentQuestionIndex(idx)}
            />

            {/* Submit Confirmation Card */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-2">
              <div className="text-xs text-slate-400">
                পরীক্ষা সম্পন্ন হলে নিচের বাটনে ক্লিক করে ফলাফল দেখুন
              </div>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all"
              >
                পরীক্ষা সম্পন্ন ও সাবমিট করুন
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0E1626] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    পরীক্ষা সাবমিট নিশ্চিতকরণ
                  </h3>
                  <p className="text-xs text-slate-400">
                    আপনি কি এখনই পরীক্ষাটি সমাপ্ত করতে চান?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900 rounded-xl text-center text-xs">
                <div>
                  <div className="text-slate-400">উত্তর দেওয়া হয়েছে:</div>
                  <div className="text-lg font-bold text-blue-400 mt-0.5">
                    {Object.values(answers).filter((v) => v !== null && v !== undefined).length} টি
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">বাকি রয়েছে:</div>
                  <div className="text-lg font-bold text-slate-400 mt-0.5">
                    {activeSession.questions.length - Object.values(answers).filter((v) => v !== null && v !== undefined).length} টি
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  ফিরে যান
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
                >
                  {isSubmitting ? "ফলাফল তৈরি হচ্ছে..." : "হ্যাঁ, সাবমিট করুন"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW: LOBBY & CONFIGURATION =================
  return (
    <div className="space-y-8 pb-16">
      {/* Lobby Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#0E1626] via-[#121B2F] to-[#0D1527] border border-slate-800 rounded-3xl shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>বাস্তবসম্মত সিমুলেশন ইঞ্জিন</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            পরীক্ষা হল (Exam Hall)
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            পূর্ণাঙ্গ মক টেস্ট, বিষয়ভিত্তিক টেস্ট অথবা আপনার ইচ্ছামতো কাস্টমাইজড পরীক্ষা দিন।
            সঠিক ও ভুলের স্বয়ংক্রিয় মূল্যায়ন, নেগেটিভ মার্কিং এবং ইন-ডেপথ ব্যাখ্যা রিপোর্ট।
          </p>
        </div>
      </div>

      {/* Preset Mock Tests Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-400" />
          স্ট্যান্ডার্ড মক টেস্ট টেমপ্লেট (Featured Mock Exams)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-[#0E1626] border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    {tmpl.target_exam}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {tmpl.duration_minutes} মিনিট
                  </span>
                </div>
                <h3 className="font-bold text-base text-white mt-2 leading-snug">
                  {tmpl.title_bn}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {tmpl.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span className="font-bold text-slate-200">{tmpl.total_questions}টি প্রশ্ন</span> •{" "}
                  <span className="text-rose-400">-{tmpl.negative_mark_rate} নেগেটিভ</span>
                </div>
                <button
                  onClick={() => handleStartExam(tmpl.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  শুরু করুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Examination Builder */}
      <div className="bg-[#0E1626] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <span className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Settings className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white">
              কাস্টম পরীক্ষা কনফিগারেশন (Custom Exam Builder)
            </h3>
            <p className="text-xs text-slate-400">
              আপনার নির্দিষ্ট দুর্বলতা ও সময় অনুযায়ী বিষয়, প্রশ্নসংখ্যা এবং নেগেটিভ মার্কিং কাস্টমাইজ করুন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Questions Count */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              প্রশ্নের সংখ্যা
            </label>
            <select
              value={customQuestionsCount}
              onChange={(e) => setCustomQuestionsCount(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value={10}>১০টি প্রশ্ন (কুইক ড্রিল)</option>
              <option value={20}>২০টি প্রশ্ন (স্ট্যান্ডার্ড)</option>
              <option value={50}>৫০টি প্রশ্ন (হাফ মক)</option>
              <option value={100}>১০০টি প্রশ্ন (ব্যাংক / শিক্ষক নিয়োগ)</option>
              <option value={200}>২০০টি প্রশ্ন (পূর্ণাঙ্গ বিসিএস)</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              সময়সীমা (মিনিট)
            </label>
            <select
              value={customDurationMinutes}
              onChange={(e) => setCustomDurationMinutes(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value={10}>১০ মিনিট</option>
              <option value={20}>২০ মিনিট</option>
              <option value={30}>৩০ মিনিট</option>
              <option value={60}>৬০ মিনিট (১ ঘণ্টা)</option>
              <option value={120}>১২০ মিনিট (২ ঘণ্টা)</option>
            </select>
          </div>

          {/* Negative Marking */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              নেগেটিভ মার্কিং রেট
            </label>
            <select
              value={negativeMarkRate}
              onChange={(e) => setNegativeMarkRate(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value={0.5}>০.৫০ (বিসিএস প্রিলিমিনারি মানদণ্ড)</option>
              <option value={0.25}>০.২৫ (ব্যাংক ও শিক্ষক নিয়োগ মানদণ্ড)</option>
              <option value={0.0}>০.০০ (নেগেটিভ মার্কিং নেই - শিক্ষণ মোড)</option>
            </select>
          </div>

          {/* Question Source */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              প্রশ্নের উৎস
            </label>
            <select
              value={questionSource}
              onChange={(e) => setQuestionSource(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value="ALL">সকল উৎস (বিগত + এআই সম্ভাব্য)</option>
              <option value="AUTHENTIC_ONLY">কেবলমাত্র পূর্ববর্তী ঐতিহাসিক প্রশ্ন</option>
              <option value="GENERATED_ONLY">কেবলমাত্র এআই সম্ভাব্য প্রশ্ন</option>
            </select>
          </div>
        </div>

        {/* Multi-Subject Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            বিষয় নির্বাচন করুন (একাধিক নির্বাচন করা যাবে):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {meta?.subjects.map((s) => {
              const isSelected = selectedSubjects.includes(s.id);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedSubjects(selectedSubjects.filter((id) => id !== s.id));
                    } else {
                      setSelectedSubjects([...selectedSubjects, s.id]);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all ${
                    isSelected
                      ? "bg-blue-600/25 border-blue-500 text-white shadow-sm"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{s.name_bn}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            * কোনো বিষয় নির্বাচন না করলে স্বয়ংক্রিয়ভাবে সকল বিষয়ের ভারসাম্যপূর্ণ প্রশ্ন সেট হবে।
          </div>
        </div>

        {/* Launch Custom Exam Button */}
        <div className="pt-2">
          <button
            onClick={() => handleStartExam()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Play className="w-4 h-4 fill-current" />
            কাস্টম পরীক্ষা শুরু করুন
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExamHallPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">পরীক্ষা হল লোড হচ্ছে...</div>}>
      <ExamHallContent />
    </Suspense>
  );
}
