"use client";

import React from "react";
import { CheckCircle2, Bookmark, HelpCircle } from "lucide-react";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<number, number | null>;
  reviewMarks: Record<number, boolean>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentIndex,
  answers,
  reviewMarks,
  onSelectQuestion,
}) => {
  const answeredCount = Object.values(answers).filter((v) => v !== null && v !== undefined).length;
  const reviewCount = Object.values(reviewMarks).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="bg-[#0E1626] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          প্রশ্ন প্যালেট (Question Palette)
        </h4>
        <span className="text-xs font-semibold text-slate-400">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Summary indicators */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-600/30">
          <div className="text-base font-bold text-blue-400">{answeredCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">উত্তর দেওয়া</div>
        </div>
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-base font-bold text-slate-300">{unansweredCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">অনূর্ধ্ব / বাকি</div>
        </div>
        <div className="p-2 rounded-xl bg-violet-950/40 border border-violet-600/30">
          <div className="text-base font-bold text-violet-400">{reviewCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">রিভিউ মার্ক</div>
        </div>
      </div>

      {/* Numbered Palette Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-1.5 max-h-72 overflow-y-auto p-1">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[idx] !== null && answers[idx] !== undefined;
          const isReview = reviewMarks[idx] === true;

          let btnClass = "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800";

          if (isAnswered) {
            btnClass = "bg-blue-600 text-white border-blue-500 font-bold shadow-sm shadow-blue-500/30";
          }
          if (isReview) {
            btnClass = "bg-violet-600 text-white border-violet-400 font-bold";
          }
          if (isCurrent) {
            btnClass += " ring-2 ring-white ring-offset-2 ring-offset-[#0E1626]";
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectQuestion(idx)}
              className={`h-9 rounded-lg border text-xs font-semibold transition-all relative flex items-center justify-center ${btnClass}`}
            >
              <span>{idx + 1}</span>
              {isReview && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-[#0E1626]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
