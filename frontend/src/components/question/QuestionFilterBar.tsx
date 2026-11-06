"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { FilterMetadata } from "@/lib/types";

interface QuestionFilterBarProps {
  meta: FilterMetadata | null;
  filters: {
    q: string;
    category_id: string;
    organization_id: string;
    examination_id: string;
    subject_id: string;
    year: string;
    difficulty: string;
    language: string;
    question_type: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onReset: () => void;
}

export const QuestionFilterBar: React.FC<QuestionFilterBarProps> = ({
  meta,
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-[#0E1626] border border-slate-800 rounded-2xl p-4 md:p-5 mb-6 shadow-md">
      {/* Search Input Row */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={filters.q}
          onChange={(e) => onFilterChange("q", e.target.value)}
          placeholder="প্রশ্ন, ব্যাখ্যা বা উৎস দিয়ে অনুসন্ধান করুন (Search by keyword)..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {/* Category */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            ক্যাটাগরি
          </label>
          <select
            value={filters.category_id}
            onChange={(e) => onFilterChange("category_id", e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 outline-none"
          >
            <option value="">সকল ক্যাটাগরি</option>
            {meta?.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_bn}
              </option>
            ))}
          </select>
        </div>

        {/* Organization */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            প্রতিষ্ঠান / কমিশন
          </label>
          <select
            value={filters.organization_id}
            onChange={(e) => onFilterChange("organization_id", e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 outline-none"
          >
            <option value="">সকল প্রতিষ্ঠান</option>
            {meta?.organizations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.code} ({o.name_bn.slice(0, 15)})
              </option>
            ))}
          </select>
        </div>

        {/* Examination */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            নির্দিষ্ট পরীক্ষা
          </label>
          <select
            value={filters.examination_id}
            onChange={(e) => onFilterChange("examination_id", e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 outline-none"
          >
            <option value="">সকল পরীক্ষা</option>
            {meta?.examinations.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name_bn}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            বিষয় (Subject)
          </label>
          <select
            value={filters.subject_id}
            onChange={(e) => onFilterChange("subject_id", e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 outline-none"
          >
            <option value="">সকল বিষয়</option>
            {meta?.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name_bn}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            বছর (Year)
          </label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange("year", e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 outline-none"
          >
            <option value="">সকল বছর</option>
            {meta?.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            কঠিন্য মাত্রা
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => onFilterChange("difficulty", e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 outline-none"
          >
            <option value="">সকল মাত্রা</option>
            <option value="EASY">সহজ (Easy)</option>
            <option value="MEDIUM">মাঝারি (Medium)</option>
            <option value="HARD">কঠিন (Hard)</option>
          </select>
        </div>

        {/* Question Type */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            প্রশ্নের ধরন
          </label>
          <select
            value={filters.question_type}
            onChange={(e) => onFilterChange("question_type", e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 outline-none"
          >
            <option value="">সকল উৎস</option>
            <option value="AUTHENTIC_PREVIOUS">প্রকৃত বিগত প্রশ্ন</option>
            <option value="PRACTICE">স্ট্যান্ডার্ড প্র্যাকটিস</option>
            <option value="AI_GENERATED">এআই সম্ভাব্য প্রশ্ন</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            রিসেট
          </button>
        </div>
      </div>
    </div>
  );
};
