"use client";

import React, { useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  FolderPlus,
  Share2,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Question } from "@/lib/types";
import { addBookmark, reportQuestion, addQuestionToCollection } from "@/lib/api";

interface QuestionCardProps {
  question: Question;
  indexNumber?: number;
  showPracticeMode?: boolean; // If true, clicking option reveals correct/incorrect immediately
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
    <div className="bg-[#0E1626] border border-slate-800 rounded-2xl p-5 md:p-6 transition-all hover:border-slate-700/80 shadow-lg shadow-black/20">
      {/* Top Metadata Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {indexNumber !== undefined && (
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs border border-blue-500/30">
              #{indexNumber}
            </span>
          )}

          {/* Subject Badge */}
          {question.subject_name_bn && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {question.subject_name_bn}
            </span>
          )}

          {/* Examination Badge */}
          {question.exam_name && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {question.exam_name}
            </span>
          )}

          {/* Year Badge */}
          {question.year && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800/80 text-slate-400">
              {question.year}
            </span>
          )}

          {/* Provenance Tag */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
              question.question_type === "AUTHENTIC_PREVIOUS"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : question.question_type === "AI_GENERATED"
                ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
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
                ? "text-amber-400 bg-amber-400/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => setIsReporting(!isReporting)}
            title="প্রশ্ন বা উত্তরে ত্রুটি রিপোর্ট করুন"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Statement */}
      <div className="mb-5">
        <h3 className="text-base md:text-lg font-medium text-slate-100 leading-relaxed">
          {question.question_text_bn || question.question_text}
        </h3>
        {question.source_reference && (
          <p className="mt-1 text-xs text-slate-400 italic">
            উৎস: {question.source_reference}
          </p>
        )}
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correct_option_index;

          let btnStyle = "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-200";

          if (isAnswerRevealed) {
            if (isCorrect) {
              btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold shadow-sm shadow-emerald-500/20";
            } else if (isSelected && !isCorrect) {
              btnStyle = "bg-rose-950/60 border-rose-500 text-rose-200 font-semibold";
            } else {
              btnStyle = "bg-slate-900/40 border-slate-800/60 text-slate-400 opacity-60";
            }
          } else if (isSelected) {
            btnStyle = "bg-blue-600/20 border-blue-500 text-white font-medium";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left text-sm transition-all ${btnStyle}`}
            >
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-slate-800/80 font-bold text-xs text-slate-300">
                {question.language === "BN" ? optionLabels[idx] : optionLetters[idx]}
              </span>
              <span className="flex-1 mt-0.5">{opt}</span>
              {isAnswerRevealed && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-1" />
              )}
              {isAnswerRevealed && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 ml-1" />
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
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-blue-400 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{isAnswerRevealed ? "উত্তর লুকান" : "সঠিক উত্তর ও ব্যাখ্যা দেখুন"}</span>
          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isAnswerRevealed && (
          <div className="text-xs text-slate-300 flex items-center gap-1.5">
            <span className="text-slate-400">সঠিক উত্তর:</span>
            <span className="font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              ({question.language === "BN" ? optionLabels[question.correct_option_index] : optionLetters[question.correct_option_index]}) {question.options[question.correct_option_index]}
            </span>
          </div>
        )}
      </div>

      {/* Explanation Box */}
      {showExplanation && (question.explanation || question.explanation_bn) && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-blue-900/40 text-slate-200 text-sm leading-relaxed animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            ব্যাখ্যা ও প্রামাণ্য তথ্য (Official Explanation)
          </div>
          <p className="whitespace-pre-line text-slate-300">
            {question.explanation_bn || question.explanation}
          </p>
        </div>
      )}

      {/* Report Modal / Drawer */}
      {isReporting && (
        <form onSubmit={handleReport} className="mt-4 p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              ত্রুটি রিপোর্ট করুন (Report Issue)
            </span>
            <button
              type="button"
              onClick={() => setIsReporting(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              বাতিল
            </button>
          </div>

          {reportSuccess ? (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" />
              রিপোর্ট গৃহীত হয়েছে। আমাদের সম্পাদনা দল দ্রুত যাচাই করবেন।
            </div>
          ) : (
            <div className="space-y-3">
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
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
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors"
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
