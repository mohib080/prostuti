"use client";

import React, { useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Question } from "@/lib/types";
import { addBookmark, reportQuestion } from "@/lib/api";

interface QuestionCardProps {
  question: Question;
  indexNumber?: number;
  showPracticeMode?: boolean;
  onBookmarkChange?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  indexNumber,
  showPracticeMode = true,
  onBookmarkChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("WRONG_ANSWER");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    if (showPracticeMode) {
      setIsAnswerRevealed(true);
      setShowExplanation(true);
    }
  };

  const handleBookmark = async () => {
    try {
      await addBookmark("QUESTION", question.id);
      setIsBookmarked(true);
      if (onBookmarkChange) onBookmarkChange();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reportQuestion(question.id, reportReason, reportDetails);
      setReportSuccess(true);
      setTimeout(() => {
        setIsReporting(false);
        setReportSuccess(false);
        setReportDetails("");
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const optionLabels = ["ক", "খ", "গ", "ঘ"];
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="bg-white border border-[#E7E3D9] rounded-2xl p-5 md:p-6 transition-all hover:border-[#D5CFC1] shadow-xs">
      {/* Top Metadata Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E7E3D9]">
        <div className="flex flex-wrap items-center gap-2">
          {indexNumber !== undefined && (
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#24483B]/10 text-[#24483B] font-bold text-xs border border-[#24483B]/20 font-serif-heading">
              #{indexNumber}
            </span>
          )}

          {/* Subject Badge */}
          {question.subject_name_bn && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EFECE3] text-[#24483B] border border-[#E7E3D9]">
              {question.subject_name_bn}
            </span>
          )}

          {/* Examination Badge */}
          {question.exam_name && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F6F4ED] text-[#24483B] border border-[#E7E3D9]">
              {question.exam_name}
            </span>
          )}

          {/* Year Badge */}
          {question.year && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAF8F3] text-[#737A73]">
              {question.year}
            </span>
          )}

          {/* Provenance Tag */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
              question.question_type === "AUTHENTIC_PREVIOUS"
                ? "bg-[#24483B]/10 text-[#24483B] border border-[#24483B]/20"
                : question.question_type === "AI_GENERATED"
                ? "bg-[#B69A70]/15 text-[#8A714C] border border-[#B69A70]/30"
                : "bg-[#879887]/20 text-[#24483B] border border-[#879887]/30"
            }`}
          >
            {question.question_type === "AUTHENTIC_PREVIOUS"
              ? "মৌলিক প্রশ্ন"
              : question.question_type === "AI_GENERATED"
              ? "এআই সম্ভাব্য"
              : "অনুশীলন"}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleBookmark}
            title="সংগ্রহে রাখুন"
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? "text-[#B69A70] bg-[#B69A70]/15"
                : "text-[#737A73] hover:text-[#24483B] hover:bg-[#FAF8F3]"
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => setIsReporting(!isReporting)}
            title="প্রশ্ন বা উত্তরে ত্রুটি রিপোর্ট করুন"
            className="p-2 rounded-lg text-[#737A73] hover:text-[#991B1B] hover:bg-[#FAF8F3] transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Statement */}
      <div className="mb-5">
        <h3 className="text-base md:text-lg font-medium text-[#252A27] leading-relaxed">
          {question.question_text_bn || question.question_text}
        </h3>
        {question.source_reference && (
          <p className="mt-1.5 text-xs text-[#737A73] italic">
            উৎস: {question.source_reference}
          </p>
        )}
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correct_option_index;

          let btnStyle = "bg-[#FAF8F3] hover:bg-[#F2EFE8] border-[#E7E3D9] text-[#252A27]";

          if (isAnswerRevealed) {
            if (isCorrect) {
              btnStyle = "bg-[#F0FDF4] border-[#16A34A] text-[#15803D] font-semibold";
            } else if (isSelected && !isCorrect) {
              btnStyle = "bg-[#FEF2F2] border-[#DC2626] text-[#B91C1C] font-semibold";
            } else {
              btnStyle = "bg-[#FAF8F3] border-[#E7E3D9] text-[#737A73] opacity-60";
            }
          } else if (isSelected) {
            btnStyle = "bg-[#24483B]/10 border-[#24483B] text-[#24483B] font-semibold ring-1 ring-[#24483B]/30";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left text-sm transition-all ${btnStyle}`}
            >
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-[#EAE6DB] font-bold text-xs text-[#24483B]">
                {question.language === "BN" ? optionLabels[idx] : optionLetters[idx]}
              </span>
              <span className="flex-1 mt-0.5">{opt}</span>
              {isAnswerRevealed && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] flex-shrink-0 ml-1" />
              )}
              {isAnswerRevealed && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Control row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            setIsAnswerRevealed(!isAnswerRevealed);
            setShowExplanation(!showExplanation);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#EFECE3] hover:bg-[#EAE6DB] text-[#24483B] border border-[#E7E3D9] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#B69A70]" />
          <span>{isAnswerRevealed ? "উত্তর লুকান" : "সঠিক উত্তর ও ব্যাখ্যা দেখুন"}</span>
          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isAnswerRevealed && (
          <div className="text-xs text-[#252A27] flex items-center gap-1.5">
            <span className="text-[#737A73]">সঠিক উত্তর:</span>
            <span className="font-bold text-[#15803D] px-2 py-0.5 rounded bg-[#F0FDF4] border border-[#16A34A]/30">
              ({question.language === "BN" ? optionLabels[question.correct_option_index] : optionLetters[question.correct_option_index]}) {question.options[question.correct_option_index]}
            </span>
          </div>
        )}
      </div>

      {/* Explanation Box */}
      {showExplanation && (question.explanation || question.explanation_bn) && (
        <div className="mt-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#E7E3D9] text-[#252A27] text-sm leading-relaxed animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#24483B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B69A70]"></span>
            ব্যাখ্যা ও প্রামাণ্য তথ্য (Official Explanation)
          </div>
          <p className="whitespace-pre-line text-[#252A27]">
            {question.explanation_bn || question.explanation}
          </p>
        </div>
      )}

      {/* Report Modal */}
      {isReporting && (
        <form onSubmit={handleReport} className="mt-4 p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-[#991B1B] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
              ত্রুটি রিপোর্ট করুন (Report Issue)
            </span>
            <button
              type="button"
              onClick={() => setIsReporting(false)}
              className="text-xs text-[#737A73] hover:text-[#252A27]"
            >
              বাতিল
            </button>
          </div>

          {reportSuccess ? (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              রিপোর্ট গৃহীত হয়েছে। আমাদের সম্পাদনা দল দ্রুত যাচাই করবেন।
            </div>
          ) : (
            <div className="space-y-3">
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2 bg-white border border-[#E7E3D9] rounded-lg text-xs text-[#252A27]"
              >
                <option value="WRONG_ANSWER">ভুল উত্তর চিহ্নিত করা আছে</option>
                <option value="TYPO">বানান বা মুদ্রণ প্রমাদ</option>
                <option value="INCORRECT_EXPLANATION">ব্যাখ্যায় ত্রুটি বা অস্পষ্টতা</option>
                <option value="OUTDATED">তথ্যটি সময়ের সাথে পরিবর্তিত হয়েছে</option>
                <option value="OTHER">অন্যান্য সমস্যা</option>
              </select>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="সঠিক তথ্য বা আপনার মন্তব্য লিখুন..."
                rows={2}
                className="w-full p-2 bg-white border border-[#E7E3D9] rounded-lg text-xs text-[#252A27] outline-none focus:border-[#24483B]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-medium text-xs transition-colors shadow-xs"
              >
                রিপোর্ট জমা দিন
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
