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

  const minutesTaken = Math.floor(result.time_taken_seconds / 60);
  const secondsTaken = result.time_taken_seconds % 60;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Result Hero Banner */}
      <div className="bg-white border border-[#E7E3D9] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E7E3D9]">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-2xl shadow-sm text-white ${
                result.passed
                  ? "bg-[#24483B]"
                  : "bg-[#B69A70]"
              }`}
            >
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#737A73]">
                  পরীক্ষার ফলাফল বিবরণী (Scorecard)
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    result.passed
                      ? "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]"
                      : "bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]"
                  }`}
                >
                  {result.passed ? "উত্তীর্ণ (PASSED)" : "আরও অনুশীলন প্রয়োজন (NEEDS PRACTICE)"}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#252A27] mt-1 font-bengali">
                {result.title}
              </h2>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {onRetake && (
              <button
                onClick={onRetake}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F3] hover:bg-[#EFECE3] text-[#252A27] text-xs font-semibold border border-[#E7E3D9] transition-colors font-bengali"
              >
                <RotateCcw className="w-4 h-4 text-[#737A73]" />
                পুনরায় পরীক্ষা দিন
              </button>
            )}
            <Link
              href="/question-bank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#24483B] hover:bg-[#1B362C] text-white text-xs font-semibold shadow-sm transition-colors font-bengali"
            >
              <BookOpen className="w-4 h-4" />
              প্রশ্নব্যাংকে যান
            </Link>
          </div>
        </div>

        {/* Detailed Marks Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 pt-6 text-center">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E7E3D9]">
            <div className="text-xs text-[#737A73] font-medium font-bengali">প্রাপ্ত নম্বর (Score)</div>
            <div className="text-2xl font-bold text-[#24483B] mt-1 font-serif">
              {result.obtained_marks.toFixed(2)}
            </div>
            <div className="text-[11px] text-[#737A73] font-medium mt-0.5 font-bengali">
              মোট: {result.total_marks}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E7E3D9]">
            <div className="text-xs text-[#737A73] font-medium font-bengali">শতাংশ (Accuracy)</div>
            <div className="text-2xl font-bold text-[#24483B] mt-1 font-serif">
              {result.percentage.toFixed(1)}%
            </div>
            <div className="text-[11px] text-[#737A73] font-medium mt-0.5 font-bengali">
              কৃতকার্য হার
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <div className="text-xs text-[#166534] font-medium font-bengali">সঠিক উত্তর</div>
            <div className="text-2xl font-bold text-[#166534] mt-1 font-serif">
              {result.correct_count}
            </div>
            <div className="text-[11px] text-[#15803D] font-medium mt-0.5 font-bengali">
              +{result.correct_count}.0 নম্বর
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA]">
            <div className="text-xs text-[#991B1B] font-medium font-bengali">ভুল উত্তর</div>
            <div className="text-2xl font-bold text-[#991B1B] mt-1 font-serif">
              {result.incorrect_count}
            </div>
            <div className="text-[11px] text-[#B91C1C] font-medium mt-0.5 font-bengali">
              -{result.negative_marks_deducted.toFixed(2)} নেগেটিভ
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E7E3D9]">
            <div className="text-xs text-[#737A73] font-medium font-bengali">অনুত্তরিত</div>
            <div className="text-2xl font-bold text-[#737A73] mt-1 font-serif">
              {result.unanswered_count}
            </div>
            <div className="text-[11px] text-[#737A73] font-medium mt-0.5 font-bengali">
              ০ কর্তন
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E7E3D9]">
            <div className="text-xs text-[#737A73] font-medium font-bengali">ব্যয়িত সময়</div>
            <div className="text-2xl font-bold text-[#B69A70] mt-1 font-mono">
              {minutesTaken}:{String(secondsTaken).padStart(2, "0")}
            </div>
            <div className="text-[11px] text-[#737A73] font-medium mt-0.5 flex items-center justify-center gap-1 font-bengali">
              <Clock className="w-3 h-3 text-[#B69A70]" /> মিনিট
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#252A27]">
              প্রশ্নের পুঙ্খানুপুঙ্খ পর্যালোচনা (Question Breakdown & Review)
            </h3>
            <p className="text-xs text-[#737A73] mt-0.5 font-bengali">
              প্রতিটি প্রশ্নের আপনার প্রদত্ত উত্তর, সঠিক উত্তর এবং বিস্তারিত ব্যাখ্যা মিলিয়ে নিন।
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterMode("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bengali ${
                filterMode === "ALL" ? "bg-[#24483B] text-white" : "text-[#737A73] hover:text-[#252A27]"
              }`}
            >
              সকল ({result.reviews.length})
            </button>
            <button
              onClick={() => setFilterMode("CORRECT")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bengali ${
                filterMode === "CORRECT" ? "bg-[#166534] text-white" : "text-[#737A73] hover:text-[#166534]"
              }`}
            >
              সঠিক ({result.correct_count})
            </button>
            <button
              onClick={() => setFilterMode("INCORRECT")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bengali ${
                filterMode === "INCORRECT" ? "bg-[#991B1B] text-white" : "text-[#737A73] hover:text-[#991B1B]"
              }`}
            >
              ভুল ({result.incorrect_count})
            </button>
            <button
              onClick={() => setFilterMode("UNANSWERED")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bengali ${
                filterMode === "UNANSWERED" ? "bg-[#737A73] text-white" : "text-[#737A73] hover:text-[#252A27]"
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
              className="bg-white border border-[#E7E3D9] rounded-2xl p-5 md:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E3D9]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FAF8F3] border border-[#E7E3D9] text-[#252A27] font-bengali">
                    প্রশ্ন #{idx + 1}
                  </span>
                  {r.subject_name && (
                    <span className="text-xs text-[#24483B] font-semibold font-bengali">
                      {r.subject_name}
                    </span>
                  )}
                  {r.topic_name && (
                    <span className="text-xs text-[#737A73] font-bengali">
                      • {r.topic_name}
                    </span>
                  )}
                </div>

                <div>
                  {r.is_correct && (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] font-bengali">
                      <CheckCircle2 className="w-3.5 h-3.5" /> সঠিক (+১.০)
                    </span>
                  )}
                  {!r.is_correct && !r.is_unanswered && (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] font-bengali">
                      <XCircle className="w-3.5 h-3.5" /> ভুল উত্তর (-০.৫)
                    </span>
                  )}
                  {r.is_unanswered && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FAF8F3] border border-[#E7E3D9] text-[#737A73] font-bengali">
                      উত্তর দেওয়া হয়নি (০.০)
                    </span>
                  )}
                </div>
              </div>

              {/* Statement */}
              <h4 className="text-base font-medium text-[#252A27] mb-4 leading-relaxed font-bengali">
                {r.question_text}
              </h4>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {r.options.map((opt, optIdx) => {
                  const isCorrectAnswer = optIdx === r.correct_option_index;
                  const isUserSelected = optIdx === r.selected_option_index;

                  let borderClass = "border-[#E7E3D9] bg-[#FAF8F3] text-[#252A27]";
                  if (isCorrectAnswer) {
                    borderClass = "border-[#86EFAC] bg-[#F0FDF4] text-[#166534] font-semibold";
                  } else if (isUserSelected && !isCorrectAnswer) {
                    borderClass = "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B] font-semibold";
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs leading-normal transition-all font-bengali ${borderClass}`}
                    >
                      <span className="w-5 h-5 flex items-center justify-center rounded bg-[#EFECE3] font-bold text-[#252A27] text-[10px]">
                        {optionLabels[optIdx]}
                      </span>
                      <span className="flex-1 mt-0.5">{opt}</span>
                      {isCorrectAnswer && (
                        <span className="text-[10px] uppercase font-bold text-[#166534] bg-[#BBF7D0]/60 px-1.5 py-0.5 rounded">
                          সঠিক উত্তর
                        </span>
                      )}
                      {isUserSelected && !isCorrectAnswer && (
                        <span className="text-[10px] uppercase font-bold text-[#991B1B] bg-[#FECACA]/60 px-1.5 py-0.5 rounded">
                          আপনার উত্তর
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {(r.explanation || r.explanation_bn) && (
                <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E7E3D9] text-xs text-[#252A27] leading-relaxed">
                  <div className="font-bold text-[#24483B] mb-1 flex items-center gap-1.5 font-bengali">
                    <HelpCircle className="w-3.5 h-3.5" />
                    ব্যাখ্যা (Detailed Explanation):
                  </div>
                  <p className="font-bengali">{r.explanation_bn || r.explanation}</p>
                  {r.source_reference && (
                    <p className="mt-1 text-[#737A73] italic font-bengali">উৎস: {r.source_reference}</p>
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
