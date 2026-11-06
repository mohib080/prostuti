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
    <div className="space-y-8 pb-20 font-sans">
      {/* Signature Banner */}
      <div className="p-6 md:p-8 bg-white border border-[#E7E3D9] rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF8F3] border border-[#E7E3D9] text-xs font-semibold text-[#24483B] font-bengali">
            <Sparkles className="w-3.5 h-3.5 text-[#B69A70]" />
            <span>প্রস্তুতি সিগনেচার ফিচার (Signature Feature)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#252A27]">
            এআই চালিত সম্ভাব্য প্রশ্ন জেনারেটর (Probable Questions)
          </h1>
          <p className="text-xs md:text-sm text-[#737A73] leading-relaxed font-bengali">
            বিগত প্রশ্নপত্রের পুনরাবৃত্তি প্যাটার্ন, সিলেবাসের ওজন এবং সমকালীন জাতীয় ও আন্তর্জাতিক
            ঘটনাবলীর ওপর ভিত্তি করে কৃত্রিম বুদ্ধিমত্তা সমৃদ্ধ উচ্চমানের অনুশীলন প্রশ্নমালা।
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-[#FEFCE8] border border-[#FEF08A] text-[#854D0E] text-xs flex items-start gap-3 leading-relaxed font-bengali">
        <AlertCircle className="w-5 h-5 text-[#A16207] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">গুরুত্বপূর্ণ একাডেমিক নোটিশ:</strong> এখানে তৈরি সকল প্রশ্ন
          সিলেবাস ও বিগত প্রশ্নের পুনরাবৃত্তি ফ্রিকোয়েন্সির ভিত্তিতে প্রণীত এআই অনুশীলন সামগ্রী
          (AI-Generated Practice Material)। এগুলোকে কোনোভাবেই মূল পরীক্ষার প্রশ্ন হিসেবে দাবি করা হয় না
          এবং ভবিষ্যতে হুবহু আসার কোনো নিশ্চয়তা প্রদান করা হয় না।
        </div>
      </div>

      {/* Generation Form Builder */}
      <form onSubmit={handleGenerate} className="bg-white border border-[#E7E3D9] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#E7E3D9]">
          <Bot className="w-5 h-5 text-[#24483B]" />
          <h2 className="text-base font-serif font-bold text-[#252A27]">
            প্রশ্নের প্যারামিটার নির্ধারণ করুন (Configure Engine)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Target Exam */}
          <div>
            <label className="block text-xs font-semibold text-[#252A27] mb-1.5 font-bengali">
              টার্গেট পরীক্ষা
            </label>
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
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
            <label className="block text-xs font-semibold text-[#252A27] mb-1.5 font-bengali">
              বিষয় (Subject)
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(Number(e.target.value))}
              className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
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
            <label className="block text-xs font-semibold text-[#252A27] mb-1.5 font-bengali">
              নির্দিষ্ট অধ্যায় / টপিক (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="যেমন: সংবিধান, চর্যাপদ, লাভ-ক্ষতি, Preposition"
              className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] placeholder-[#737A73] outline-none focus:border-[#24483B] font-bengali"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-[#252A27] mb-1.5 font-bengali">
              কঠিন্য মাত্রা
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
            >
              <option value="EASY">সহজ (মৌলিক ধারণা)</option>
              <option value="MEDIUM">মাঝারি (স্ট্যান্ডার্ড বিসিএস প্রিলি)</option>
              <option value="HARD">কঠিন (ব্যাংক এডি ও বিভ্রান্তিকর অপশন)</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-semibold text-[#252A27] mb-1.5 font-bengali">
              ভাষা
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
            >
              <option value="BN">বাংলা (Bengali)</option>
              <option value="EN">English</option>
            </select>
          </div>

          {/* Count */}
          <div>
            <label className="block text-xs font-semibold text-[#252A27] mb-1.5 font-bengali">
              প্রশ্নের সংখ্যা
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
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
            className="w-full py-3.5 rounded-2xl bg-[#24483B] hover:bg-[#1B362C] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-bengali"
          >
            <Sparkles className="w-4 h-4 text-[#B69A70]" />
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
              <h2 className="text-lg font-serif font-bold text-[#252A27] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#166534]" />
                উৎপন্ন সম্ভাব্য প্রশ্নমালা ({generatedQuestions.length}টি)
              </h2>
              <p className="text-xs text-[#737A73] mt-0.5 font-bengali">
                সঠিক উত্তরের জন্য অপশনে ক্লিক করুন বা ব্যাখ্যা উন্মোচন করুন।
              </p>
            </div>

            <Link
              href="/exam-hall"
              className="px-4 py-2 rounded-xl bg-[#24483B] hover:bg-[#1B362C] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm font-bengali"
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
                  className="bg-white border border-[#E7E3D9] rounded-2xl p-5 md:p-6 shadow-sm"
                >
                  {/* Badge row */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E3D9]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#FAF8F3] text-[#B69A70] text-xs font-semibold border border-[#E7E3D9] font-bengali">
                        সম্ভাব্য #{qIdx + 1}
                      </span>
                      <span className="text-xs font-semibold text-[#24483B] font-bengali">
                        {q.subject_name}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#FAF8F3] border border-[#E7E3D9] text-[#737A73]">
                        {q.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSaveToBank(q, qIdx)}
                      disabled={isSaved}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg border transition-colors font-bengali ${
                        isSaved
                          ? "bg-[#F0FDF4] border-[#86EFAC] text-[#166534]"
                          : "bg-[#FAF8F3] border-[#E7E3D9] text-[#737A73] hover:text-[#252A27]"
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaved ? "প্রশ্নব্যাংকে যুক্ত" : "প্রশ্নব্যাংকে সেভ করুন"}</span>
                    </button>
                  </div>

                  {/* Question Statement */}
                  <h3 className="text-base md:text-lg font-medium text-[#252A27] mb-4 leading-relaxed font-bengali">
                    {q.question_text}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = optIdx === q.correct_option_index;

                      let style = "bg-[#FAF8F3] hover:bg-[#EFECE3] border-[#E7E3D9] text-[#252A27]";
                      if (isRevealed) {
                        if (isCorrect) {
                          style = "bg-[#F0FDF4] border-[#86EFAC] text-[#166534] font-semibold";
                        } else if (isSelected && !isCorrect) {
                          style = "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]";
                        } else {
                          style = "bg-[#FAF8F3]/50 border-[#E7E3D9]/50 text-[#737A73]";
                        }
                      } else if (isSelected) {
                        style = "bg-[#24483B]/10 border-[#24483B] text-[#252A27] font-semibold";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                            setRevealedAnswers((prev) => ({ ...prev, [qIdx]: true }));
                          }}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left text-sm transition-all font-bengali ${style}`}
                        >
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-[#EFECE3] text-xs font-bold text-[#252A27]">
                            {language === "BN" ? optionLabels[optIdx] : optionLetters[optIdx]}
                          </span>
                          <span className="flex-1 mt-0.5">{opt}</span>
                          {isRevealed && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-[#166534] flex-shrink-0" />
                          )}
                          {isRevealed && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-[#991B1B] flex-shrink-0" />
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
                      className="text-xs text-[#24483B] hover:underline font-semibold flex items-center gap-1 font-bengali"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isRevealed ? "ব্যাখ্যা লুকান" : "সঠিক উত্তর ও প্রামাণ্য ব্যাখ্যা দেখুন"}</span>
                    </button>

                    {isRevealed && (
                      <div className="mt-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#E7E3D9] text-xs text-[#252A27] leading-relaxed space-y-1.5 animate-in fade-in font-bengali">
                        <div className="text-[#166534] font-bold">
                          সঠিক উত্তর: ({language === "BN" ? optionLabels[q.correct_option_index] : optionLetters[q.correct_option_index]}) {q.options[q.correct_option_index]}
                        </div>
                        <p>{q.explanation}</p>
                        <div className="pt-1 text-[#737A73] italic">
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
