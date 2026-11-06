"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Filter
} from "lucide-react";
import { ExamResult } from "@/lib/types";

interface ExamResultViewProps {
  result: ExamResult;
  onRetake?: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({ result, onRetake }) => {
  const [filterMode, setFilterMode] = useState<"ALL" | "CORRECT" | "INCORRECT" | "UNANSWERED">("ALL");

  const filteredReviews = result.reviews.filter((r) => {
    if (filterMode === "CORRECT") return r.is_correct;
    if (filterMode === "INCORRECT") return !r.is_correct && !r.is_unanswered;
    if (filterMode === "UNANSWERED") return r.is_unanswered;
    return true;
  });

  const optionLabels = ["ক", "খ", "গ", "ঘ"];
  const optionLetters = ["A", "B", "C", "D"];

  const minutesTaken = Math.floor(result.time_taken_seconds / 60);
  const secondsTaken = result.time_taken_seconds % 60;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Result Hero Banner */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#111C33] to-[#0A1020] border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-2xl shadow-xl ${
                result.passed
                  ? "bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/20"
                  : "bg-gradient-to-br from-amber-500 to-rose-700 text-white shadow-amber-500/20"
              }`}
            >
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                  পরীক্ষার ফলাফল বিবরণী (Scorecard)
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    result.passed
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {result.passed ? "উত্তীর্ণ (PASSED)" : "আরও অনুশীলন প্রয়োজন (NEEDS PRACTICE)"}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">
                {result.title}
              </h2>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {onRetake && (
              <button
                onClick={onRetake}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                পুনরায় পরীক্ষা দিন
              </button>
            )}
            <Link
              href="/question-bank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              প্রশ্নব্যাংকে যান
            </Link>
          </div>
        </div>

        {/* Detailed Marks Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 pt-6 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">প্রাপ্ত নম্বর (Score)</div>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {result.obtained_marks.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              মোট: {result.total_marks}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">শতাংশ (Accuracy)</div>
            <div className="text-2xl font-black text-indigo-400 mt-1">
              {result.percentage.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              কৃতকার্য হার
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
            <div className="text-xs text-emerald-400 font-medium">সঠিক উত্তর</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {result.correct_count}
            </div>
            <div className="text-[11px] text-emerald-500/70 font-medium mt-0.5">
              +{result.correct_count}.0 নম্বর
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30">
            <div className="text-xs text-rose-400 font-medium">ভুল উত্তর</div>
            <div className="text-2xl font-black text-rose-400 mt-1">
              {result.incorrect_count}
            </div>
            <div className="text-[11px] text-rose-500/70 font-medium mt-0.5">
              -{result.negative_marks_deducted.toFixed(2)} নেগেটিভ
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">অনুত্তরিত</div>
            <div className="text-2xl font-black text-slate-400 mt-1">
              {result.unanswered_count}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              ০ কর্তন
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">ব্যয়িত সময়</div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {minutesTaken}:{String(secondsTaken).padStart(2, "0")}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> মিনিট
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              প্রশ্নের পুঙ্খানুপুঙ্খ পর্যালোচনা (Question Breakdown & Review)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রতিটি প্রশ্নের আপনার প্রদত্ত উত্তর, সঠিক উত্তর এবং বিস্তারিত ব্যাখ্যা মিলিয়ে নিন।
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterMode("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === "ALL" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              সকল ({result.reviews.length})
            </button>
            <button
              onClick={() => setFilterMode("CORRECT")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === "CORRECT" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-emerald-300"
              }`}
            >
              সঠিক ({result.correct_count})
            </button>
            <button
              onClick={() => setFilterMode("INCORRECT")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === "INCORRECT" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-rose-300"
              }`}
            >
              ভুল ({result.incorrect_count})
            </button>
            <button
              onClick={() => setFilterMode("UNANSWERED")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === "UNANSWERED" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              অনুত্তরিত ({result.unanswered_count})
            </button>
          </div>
        </div>

        {/* Question Review Cards */}
        <div className="space-y-4">
          {filteredReviews.map((r, idx) => (
            <div
              key={r.question_id}
              className="bg-[#0E1626] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    প্রশ্ন #{idx + 1}
                  </span>
                  {r.subject_name && (
                    <span className="text-xs text-blue-400 font-medium">
                      {r.subject_name}
                    </span>
                  )}
                  {r.topic_name && (
                    <span className="text-xs text-slate-500">
                      • {r.topic_name}
                    </span>
                  )}
                </div>

                <div>
                  {r.is_correct && (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> সঠিক (+১.০)
                    </span>
                  )}
                  {!r.is_correct && !r.is_unanswered && (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      <XCircle className="w-3.5 h-3.5" /> ভুল উত্তর (-০.৫)
                    </span>
                  )}
                  {r.is_unanswered && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                      উত্তর দেওয়া হয়নি (০.০)
                    </span>
                  )}
                </div>
              </div>

              {/* Statement */}
              <h4 className="text-base font-medium text-slate-100 mb-4 leading-relaxed">
                {r.question_text}
              </h4>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {r.options.map((opt, optIdx) => {
                  const isCorrectAnswer = optIdx === r.correct_option_index;
                  const isUserSelected = optIdx === r.selected_option_index;

                  let borderClass = "border-slate-800/80 bg-slate-900/40 text-slate-300";
                  if (isCorrectAnswer) {
                    borderClass = "border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-bold";
                  } else if (isUserSelected && !isCorrectAnswer) {
                    borderClass = "border-rose-500/80 bg-rose-950/40 text-rose-200 font-bold";
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs leading-normal transition-all ${borderClass}`}
                    >
                      <span className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 font-bold text-slate-300 text-[10px]">
                        {optionLabels[optIdx]}
                      </span>
                      <span className="flex-1 mt-0.5">{opt}</span>
                      {isCorrectAnswer && (
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                          সঠিক উত্তর
                        </span>
                      )}
                      {isUserSelected && !isCorrectAnswer && (
                        <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded">
                          আপনার উত্তর
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {(r.explanation || r.explanation_bn) && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    ব্যাখ্যা (Detailed Explanation):
                  </div>
                  <p>{r.explanation_bn || r.explanation}</p>
                  {r.source_reference && (
                    <p className="mt-1 text-slate-500 italic">উৎস: {r.source_reference}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
