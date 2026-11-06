"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Newspaper,
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  Calendar,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { getCurrentAffairs, generateCurrentAffairsMcqs, addBookmark } from "@/lib/api";
import { CurrentAffairItem } from "@/lib/types";

function CurrentAffairsContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("id");

  const [articles, setArticles] = useState<CurrentAffairItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<CurrentAffairItem | null>(null);
  const [isGeneratingMcq, setIsGeneratingMcq] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: "সকল ক্যাটাগরি", value: "ALL" },
    { label: "বাংলাদেশ বিষয়াবলী", value: "BANGLADESH" },
    { label: "আন্তর্জাতিক", value: "INTERNATIONAL" },
    { label: "অর্থনীতি ও বাণিজ্য", value: "ECONOMY" },
    { label: "বিজ্ঞান ও প্রযুক্তি", value: "SCIENCE_TECH" },
    { label: "শাসন ও রাজনীতি", value: "GOVERNANCE" },
    { label: "পুরস্কার ও স্বীকৃতি", value: "AWARDS" },
    { label: "খেলাধুলা", value: "SPORTS" },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCurrentAffairs({
          category: selectedCategory,
          q: searchQuery || undefined,
        });
        setArticles(data);

        if (preselectedId) {
          const match = data.find((a) => a.id === Number(preselectedId));
          if (match) setActiveArticle(match);
        } else if (data.length > 0 && !activeArticle) {
          setActiveArticle(data[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory, searchQuery, preselectedId]);

  const handleGenerateMcqs = async () => {
    if (!activeArticle) return;
    setIsGeneratingMcq(true);
    try {
      const res: any = await generateCurrentAffairsMcqs(activeArticle.id);
      setActiveArticle({
        ...activeArticle,
        mcqs: res.mcqs,
      });
    } catch (e: any) {
      alert("এমসিকিউ তৈরি করতে ত্রুটি হয়েছে: " + e.message);
    } finally {
      setIsGeneratingMcq(false);
    }
  };

  const handleBookmark = async () => {
    if (!activeArticle) return;
    try {
      await addBookmark("CURRENT_AFFAIR", activeArticle.id);
      alert("সংগ্রহে যুক্ত করা হয়েছে!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#0E1626] to-[#1A1A2E] border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Newspaper className="w-5 h-5" />
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white">
            কারেন্ট অ্যাফেয়ার্স ও সাম্প্রতিক ঘটনাবলী (Current Affairs)
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          বিসিএস ও ব্যাংক প্রিলিমিনারির জন্য যাচাইকৃত জাতীয় ও আন্তর্জাতিক সমসাময়িক ঘটনাবলী,
          গুরুত্বপূর্ণ তথ্য বুলেট এবং খবর থেকে সরাসরি পরীক্ষা-উপযোগী এমসিকিউ তৈরির সুবিধা।
        </p>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সাম্প্রতিক খবর বা ঘটনা খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.value
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout: Articles List (Left) + Detailed Story & MCQ Generator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List Column (5 of 12) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            সাম্প্রতিক খবরের তালিকা ({articles.length})
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {articles.map((a) => {
              const isSelected = activeArticle?.id === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => setActiveArticle(a)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10"
                      : "bg-[#0E1626] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                    <span>{a.category}</span>
                    <span className="text-slate-400 font-normal">
                      {new Date(a.publish_date).toLocaleDateString("bn-BD")}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100 mt-1 leading-snug">
                    {a.title_bn || a.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {a.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Column (7 of 12) */}
        <div className="lg:col-span-7">
          {activeArticle ? (
            <div className="bg-[#0E1626] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              {/* Story Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    উৎস: {activeArticle.source_name || "সরকারি বিজ্ঞপ্তি"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmark}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  {activeArticle.source_url && (
                    <a
                      href={activeArticle.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Title & Summary */}
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white leading-snug">
                  {activeArticle.title_bn || activeArticle.title}
                </h2>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {activeArticle.summary}
                </p>
              </div>

              {/* Important Key Facts (Exam Takeaways) */}
              {activeArticle.important_facts && activeArticle.important_facts.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    বিসিএস ও ব্যাংক প্রিলিমিনারি মূল তথ্য (Key Facts):
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 pl-2">
                    {activeArticle.important_facts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feature: Generate MCQs from this story */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      এই খবর থেকে তৈরি এমসিকিউ (Generated Practice MCQs)
                    </h3>
                    <p className="text-xs text-slate-400">
                      পরীক্ষার হলে এই সাম্প্রতিক ঘটনা থেকে কেমন প্রশ্ন আসতে পারে তা যাচাই করুন
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateMcqs}
                    disabled={isGeneratingMcq}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingMcq ? "তৈরি হচ্ছে..." : "এমসিকিউ তৈরি করুন"}</span>
                  </button>
                </div>

                {/* Display Generated MCQs */}
                {activeArticle.mcqs && activeArticle.mcqs.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {activeArticle.mcqs.map((mcq, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3"
                      >
                        <div className="text-xs font-bold text-violet-400">
                          মডেল প্রশ্ন #{mIdx + 1}
                        </div>
                        <h4 className="text-sm font-medium text-slate-100">
                          {mcq.question_text}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {mcq.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-lg border ${
                                oIdx === mcq.correct_option_index
                                  ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-300 font-semibold"
                                  : "bg-slate-950 border-slate-800 text-slate-400"
                              }`}
                            >
                              ({chr(oIdx)}) {opt}
                            </div>
                          ))}
                        </div>
                        {mcq.explanation && (
                          <p className="text-[11px] text-slate-400 italic pt-1">
                            ব্যাখ্যা: {mcq.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl bg-[#0E1626] border border-slate-800 text-slate-400">
              <Newspaper className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">খবর নির্বাচন করুন বিস্তারিত তথ্য দেখতে</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function chr(idx: number) {
  return ["ক", "খ", "গ", "ঘ"][idx] || "ক";
}

export default function CurrentAffairsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">কারেন্ট অ্যাফেয়ার্স লোড হচ্ছে...</div>}>
      <CurrentAffairsContent />
    </Suspense>
  );
}
