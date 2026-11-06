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
    <div className="bg-white border border-[#E7E3D9] rounded-2xl p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E3D9]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#252A27] font-bengali">
          প্রশ্ন প্যালেট (Question Palette)
        </h4>
        <span className="text-xs font-semibold text-[#737A73]">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Summary indicators */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="p-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
          <div className="text-base font-bold text-[#166534]">{answeredCount}</div>
          <div className="text-[10px] text-[#15803D] font-medium font-bengali">উত্তর দেওয়া</div>
        </div>
        <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#E7E3D9]">
          <div className="text-base font-bold text-[#252A27]">{unansweredCount}</div>
          <div className="text-[10px] text-[#737A73] font-medium font-bengali">বাকি আছে</div>
        </div>
        <div className="p-2 rounded-xl bg-[#FEFCE8] border border-[#FEF08A]">
          <div className="text-base font-bold text-[#854D0E]">{reviewCount}</div>
          <div className="text-[10px] text-[#A16207] font-medium font-bengali">রিভিউ মার্ক</div>
        </div>
      </div>

      {/* Numbered Palette Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-1.5 max-h-72 overflow-y-auto p-1">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[idx] !== null && answers[idx] !== undefined;
          const isReview = reviewMarks[idx] === true;

          let btnClass = "bg-[#FAF8F3] text-[#737A73] border-[#E7E3D9] hover:bg-[#EFECE3]";

          if (isAnswered) {
            btnClass = "bg-[#24483B] text-white border-[#24483B] font-semibold";
          } else if (isReview) {
            btnClass = "bg-[#B69A70] text-white border-[#9E835B] font-semibold";
          }

          if (isCurrent) {
            btnClass += " ring-2 ring-[#24483B] ring-offset-2 ring-offset-white";
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectQuestion(idx)}
              className={`h-9 rounded-lg border text-xs font-semibold transition-all relative flex items-center justify-center ${btnClass}`}
            >
              <span>{idx + 1}</span>
              {isReview && isAnswered && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#B69A70] ring-1 ring-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
