"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Layers,
  HelpCircle,
  Bookmark,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { generateProbableQuestions, saveProbableToBank, getFilterMetadata } from "@/lib/api";
import { ProbableQuestion, FilterMetadata } from "@/lib/types";

export default function ProbableQuestionsPage() {
  const [meta, setMeta] = useState<FilterMetadata | null>(null);

  // Form Inputs
  const [targetExam, setTargetExam] = useState("৪৭তম বিসিএস প্রিলিমিনারি");
  const [subjectId, setSubjectId] = useState<number>(3); // Default to Bangladesh Affairs
  const [topicName, setTopicName] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [language, setLanguage] = useState("BN");
  const [questionCount, setQuestionCount] = useState(5);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<ProbableQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [savedToBankMap, setSavedToBankMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function loadMeta() {
      try {
        const data = await getFilterMetadata();
        setMeta(data);
        if (data.subjects.length > 0) {
          setSubjectId(data.subjects[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadMeta();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSelectedAnswers({});
    setRevealedAnswers({});
    setSavedToBankMap({});

    try {
      const res = await generateProbableQuestions({
        target_exam: targetExam,
        subject_id: subjectId,
        topic_name: topicName || undefined,
        difficulty: difficulty,
        language: language,
        question_count: questionCount,
        additional_instructions: additionalNotes || undefined,
      });
      setGeneratedQuestions(res);
    } catch (e: any) {
      alert("প্রশ্ন তৈরি করতে ত্রুটি হয়েছে: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToBank = async (q: ProbableQuestion, idx: number) => {
    try {
      await saveProbableToBank({
        question_text: q.question_text,
        options: q.options,
        correct_option_index: q.correct_option_index,
        explanation: q.explanation,
        subject_id: subjectId,
        difficulty: q.difficulty,
        language: language,
      });
      setSavedToBankMap((prev) => ({ ...prev, [idx]: true }));
    } catch (e) {
      console.error(e);
    }
  };

  const optionLabels = ["ক", "খ", "গ", "ঘ"];
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="space-y-8 pb-20">
      {/* Signature Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#14122B] via-[#0E1528] to-[#0A101E] border border-violet-900/40 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-xs font-bold text-violet-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>প্রস্তুতি সিগনেচার ফিচার (Signature Feature)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            এআই চালিত সম্ভাব্য প্রশ্ন জেনারেটর (Probable Questions)
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            বিগত প্রশ্নপত্রের পুনরাবৃত্তি প্যাটার্ন, সিলেবাসের ওজন এবং সমকালীন জাতীয় ও আন্তর্জাতিক
            ঘটনাবলীর ওপর ভিত্তি করে কৃত্রিম বুদ্ধিমত্তা সমৃদ্ধ উচ্চমানের অনুশীলন প্রশ্নমালা।
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3 leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">গুরুত্বপূর্ণ একাডেমিক নোটিশ:</strong> এখানে তৈরি সকল প্রশ্ন
          সিলেবাস ও বিগত প্রশ্নের পুনরাবৃত্তি ফ্রিকোয়েন্সির ভিত্তিতে প্রণীত এআই অনুশীলন সামগ্রী
          (AI-Generated Practice Material)। এগুলোকে কোনোভাবেই মূল পরীক্ষার প্রশ্ন হিসেবে দাবি করা হয় না
          এবং ভবিষ্যতে হুবহু আসার কোনো নিশ্চয়তা প্রদান করা হয় না।
        </div>
      </div>

      {/* Generation Form Builder */}
      <form onSubmit={handleGenerate} className="bg-[#0E1626] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Bot className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-bold text-white">
            প্রশ্নের প্যারামিটার নির্ধারণ করুন (Configure Engine)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Target Exam */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              টার্গেট পরীক্ষা
            </label>
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value="৪৭তম বিসিএস প্রিলিমিনারি">৪৭তম বিসিএস প্রিলিমিনারি</option>
              <option value="বাংলাদেশ ব্যাংক সহকারী পরিচালক (AD)">বাংলাদেশ ব্যাংক সহকারী পরিচালক (AD)</option>
              <option value="সমন্বিত ৮/৯ ব্যাংক নিয়োগ">সমন্বিত ৮/৯ ব্যাংক নিয়োগ</option>
              <option value="প্রাথমিক সহকারী শিক্ষক নিয়োগ">প্রাথমিক সহকারী শিক্ষক নিয়োগ</option>
              <option value="১৭তম/১৮তম শিক্ষক নিবন্ধন (NTRCA)">শিক্ষক নিবন্ধন (NTRCA)</option>
              <option value="বাংলাদেশ জুডিশিয়াল সার্ভিস (BJS)">বাংলাদেশ জুডিশিয়াল সার্ভিস (BJS)</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              বিষয় (Subject)
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            >
              {meta?.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name_bn}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              নির্দিষ্ট অধ্যায় / টপিক (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="যেমন: সংবিধান, চর্যাপদ, লাভ-ক্ষতি, Preposition"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              কঠিন্য মাত্রা
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value="EASY">সহজ (মৌলিক ধারণা)</option>
              <option value="MEDIUM">মাঝারি (স্ট্যান্ডার্ড বিসিএস প্রিলি)</option>
              <option value="HARD">কঠিন (ব্যাংক এডি ও বিভ্রান্তিকর অপশন)</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              ভাষা
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value="BN">বাংলা (Bengali)</option>
              <option value="EN">English</option>
            </select>
          </div>

          {/* Count */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              প্রশ্নের সংখ্যা
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value={3}>৩টি প্রশ্ন</option>
              <option value={5}>৫টি প্রশ্ন (প্রস্তাবিত)</option>
              <option value={10}>১০টি প্রশ্ন</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-violet-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isGenerating ? "প্রশ্ন বিশ্লেষণ ও প্রস্তুত হচ্ছে..." : "সম্ভাব্য প্রশ্ন তৈরি করুন (Generate MCQs)"}
            </span>
          </button>
        </div>
      </form>

      {/* Generated Questions Output */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                উৎপন্ন সম্ভাব্য প্রশ্নমালা ({generatedQuestions.length}টি)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                সঠিক উত্তরের জন্য অপশনে ক্লিক করুন বা ব্যাখ্যা উন্মোচন করুন।
              </p>
            </div>

            <Link
              href="/exam-hall"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              মক পরীক্ষা হলে অনুশীলন করুন
            </Link>
          </div>

          <div className="space-y-5">
            {generatedQuestions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isRevealed = revealedAnswers[qIdx];
              const isSaved = savedToBankMap[qIdx];

              return (
                <div
                  key={qIdx}
                  className="bg-[#0E1626] border border-violet-900/40 rounded-2xl p-5 md:p-6 shadow-xl"
                >
                  {/* Badge row */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 text-xs font-bold border border-violet-500/30">
                        সম্ভাব্য #{qIdx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {q.subject_name}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {q.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSaveToBank(q, qIdx)}
                      disabled={isSaved}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg border transition-colors ${
                        isSaved
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaved ? "প্রশ্নব্যাংকে যুক্ত" : "প্রশ্নব্যাংকে সেভ করুন"}</span>
                    </button>
                  </div>

                  {/* Question Statement */}
                  <h3 className="text-base md:text-lg font-medium text-slate-100 mb-4 leading-relaxed">
                    {q.question_text}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = optIdx === q.correct_option_index;

                      let style = "bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-200";
                      if (isRevealed) {
                        if (isCorrect) {
                          style = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          style = "bg-rose-950/60 border-rose-500 text-rose-200";
                        } else {
                          style = "bg-slate-900/30 border-slate-800/60 text-slate-500";
                        }
                      } else if (isSelected) {
                        style = "bg-violet-600/20 border-violet-500 text-white font-medium";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                            setRevealedAnswers((prev) => ({ ...prev, [qIdx]: true }));
                          }}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left text-sm transition-all ${style}`}
                        >
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-slate-800 text-xs font-bold text-slate-300">
                            {language === "BN" ? optionLabels[optIdx] : optionLetters[optIdx]}
                          </span>
                          <span className="flex-1 mt-0.5">{opt}</span>
                          {isRevealed && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          )}
                          {isRevealed && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Toggle Explanation */}
                  <div className="pt-2">
                    <button
                      onClick={() =>
                        setRevealedAnswers((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }))
                      }
                      className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isRevealed ? "ব্যাখ্যা লুকান" : "সঠিক উত্তর ও প্রামাণ্য ব্যাখ্যা দেখুন"}</span>
                    </button>

                    {isRevealed && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1.5 animate-in fade-in">
                        <div className="text-emerald-400 font-bold">
                          সঠিক উত্তর: ({language === "BN" ? optionLabels[q.correct_option_index] : optionLetters[q.correct_option_index]}) {q.options[q.correct_option_index]}
                        </div>
                        <p>{q.explanation}</p>
                        <div className="pt-1 text-slate-500 italic">
                          সিলেবাস গুরুত্ব: {q.curriculum_relevance}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
