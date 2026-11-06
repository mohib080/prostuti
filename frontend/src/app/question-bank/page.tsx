"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Database,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  ListFilter,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { getQuestions, getFilterMetadata } from "@/lib/api";
import { Question, FilterMetadata } from "@/lib/types";
import { QuestionCard } from "@/components/question/QuestionCard";
import { QuestionFilterBar } from "@/components/question/QuestionFilterBar";

function QuestionBankContent() {
  const searchParams = useSearchParams();

  const [meta, setMeta] = useState<FilterMetadata | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    category_id: searchParams.get("category_id") || "",
    organization_id: searchParams.get("organization_id") || "",
    examination_id: searchParams.get("examination_id") || "",
    subject_id: searchParams.get("subject_id") || "",
    year: searchParams.get("year") || "",
    difficulty: searchParams.get("difficulty") || "",
    language: searchParams.get("language") || "",
    question_type: searchParams.get("question_type") || "",
  });

  // Continuous Practice Mode state
  const [isContinuousPractice, setIsContinuousPractice] = useState(false);
  const [practiceActiveIndex, setPracticeActiveIndex] = useState(0);

  // Load filter metadata
  useEffect(() => {
    async function loadMeta() {
      try {
        const data = await getFilterMetadata();
        setMeta(data);
      } catch (e) {
        console.error("Failed to load filter metadata", e);
      }
    }
    loadMeta();
  }, []);

  // Fetch questions whenever filters or page changes
  useEffect(() => {
    async function fetchQuestionsList() {
      setLoading(true);
      try {
        const res = await getQuestions({
          page: currentPage,
          page_size: pageSize,
          ...filters,
        });
        setQuestions(res.questions);
        setTotalCount(res.total);
      } catch (e) {
        console.error("Failed to fetch questions", e);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestionsList();
  }, [filters, currentPage, pageSize]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      q: "",
      category_id: "",
      organization_id: "",
      examination_id: "",
      subject_id: "",
      year: "",
      difficulty: "",
      language: "",
      question_type: "",
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-[#E7E3D9] rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF8F3] text-[#24483B] border border-[#E7E3D9]">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[#252A27]">
              প্রশ্নব্যাংক (Question Bank)
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#737A73] mt-1.5 max-w-2xl leading-relaxed font-bengali">
            বিসিএস, বাংলাদেশ ব্যাংক, পিএসসি নন-ক্যাডার, প্রাথমিক শিক্ষক ও জুডিশিয়াল সার্ভিস পরীক্ষার
            প্রমাণিত প্রশ্ন সংকলন। প্রতিটি প্রশ্নের জন্য রয়েছে নির্ভুল উত্তর ও প্রামাণ্য ব্যাখ্যা।
          </p>
        </div>

        {/* Practice Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsContinuousPractice(!isContinuousPractice)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm font-bengali ${
              isContinuousPractice
                ? "bg-[#24483B] text-white ring-1 ring-[#24483B]"
                : "bg-[#FAF8F3] hover:bg-[#EFECE3] text-[#252A27] border border-[#E7E3D9]"
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>
              {isContinuousPractice ? "স্বাভাবিক তালিকা ভিউ" : "একক প্রশ্ন প্র্যাকটিস মোড"}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <QuestionFilterBar
        meta={meta}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Result Status Bar */}
      <div className="flex items-center justify-between px-2 text-xs font-medium text-[#737A73] font-bengali">
        <span>
          মোট প্রশ্ন পাওয়া গেছে:{" "}
          <strong className="text-[#252A27] font-semibold">{totalCount}</strong> টি
        </span>
        {totalPages > 1 && (
          <span>
            পৃষ্ঠা {currentPage} / {totalPages}
          </span>
        )}
      </div>

      {/* Loading Skeleton or Questions View */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-44 rounded-2xl bg-white border border-[#E7E3D9] animate-pulse"
            />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#E7E3D9] space-y-3 shadow-sm">
          <ListFilter className="w-10 h-10 text-[#737A73] mx-auto" />
          <h3 className="text-base font-serif font-bold text-[#252A27]">
            কোনো প্রশ্ন পাওয়া যায়নি
          </h3>
          <p className="text-xs text-[#737A73] max-w-md mx-auto font-bengali">
            আপনার ফিল্টার বা অনুসন্ধানের কিওয়ার্ডটি পরিবর্তন করে পুনরায় চেষ্টা করুন।
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#24483B] text-white rounded-xl text-xs font-semibold hover:bg-[#1B362C] transition-colors font-bengali"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : isContinuousPractice ? (
        /* Continuous Single Question Practice View */
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs text-[#737A73] font-medium px-2 font-bengali">
            <span>
              অনুশীলন ক্রম: {practiceActiveIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={practiceActiveIndex === 0}
                onClick={() => setPracticeActiveIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg bg-white border border-[#E7E3D9] disabled:opacity-40 text-[#252A27] hover:bg-[#FAF8F3]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={practiceActiveIndex === questions.length - 1}
                onClick={() => setPracticeActiveIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="p-1.5 rounded-lg bg-white border border-[#E7E3D9] disabled:opacity-40 text-[#252A27] hover:bg-[#FAF8F3]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <QuestionCard
            question={questions[practiceActiveIndex]}
            indexNumber={practiceActiveIndex + 1}
            showPracticeMode={true}
          />

          <div className="flex justify-between pt-2">
            <button
              disabled={practiceActiveIndex === 0}
              onClick={() => setPracticeActiveIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-white border border-[#E7E3D9] disabled:opacity-40 text-[#252A27] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#FAF8F3] font-bengali"
            >
              <ChevronLeft className="w-4 h-4" /> পূর্ববর্তী প্রশ্ন
            </button>
            <button
              disabled={practiceActiveIndex === questions.length - 1}
              onClick={() => setPracticeActiveIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-[#24483B] hover:bg-[#1B362C] disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 font-bengali"
            >
              পরবর্তী প্রশ্ন <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Regular Paginated List */
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              indexNumber={(currentPage - 1) * pageSize + idx + 1}
            />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-[#E7E3D9] text-xs font-semibold text-[#252A27] hover:bg-[#FAF8F3] disabled:opacity-40 font-bengali"
              >
                <ChevronLeft className="w-4 h-4" /> পূর্ববর্তী
              </button>

              <div className="flex items-center gap-1 text-xs font-semibold">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        currentPage === pNum
                          ? "bg-[#24483B] text-white font-bold"
                          : "bg-white text-[#737A73] hover:bg-[#FAF8F3] border border-[#E7E3D9]"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-[#E7E3D9] text-xs font-semibold text-[#252A27] hover:bg-[#FAF8F3] disabled:opacity-40 font-bengali"
              >
                পরবর্তী <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuestionBankPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#737A73] font-bengali">প্রশ্নব্যাংক লোড হচ্ছে...</div>}>
      <QuestionBankContent />
    </Suspense>
  );
}
