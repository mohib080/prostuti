"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  FileText,
  Share2,
  Check,
  ChevronRight,
  ExternalLink,
  Tag,
  PenSquare
} from "lucide-react";
import { getResources, getFilterMetadata, addBookmark } from "@/lib/api";
import { ResourceItem, FilterMetadata } from "@/lib/types";

function StudyResourcesContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("id");

  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [meta, setMeta] = useState<FilterMetadata | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [personalNote, setPersonalNote] = useState<string>("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resList, metaData] = await Promise.all([
          getResources({
            subject_id: selectedSubjectId || undefined,
            q: searchQuery || undefined,
          }),
          getFilterMetadata(),
        ]);
        setResources(resList);
        setMeta(metaData);

        if (preselectedId && resList.length > 0) {
          const match = resList.find((r) => r.id === Number(preselectedId));
          if (match) setSelectedResource(match);
        } else if (resList.length > 0 && !selectedResource) {
          setSelectedResource(resList[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedSubjectId, searchQuery, preselectedId]);

  const handleBookmarkResource = async () => {
    if (!selectedResource) return;
    try {
      await addBookmark("RESOURCE", selectedResource.id, personalNote);
      setBookmarked(true);
      setTimeout(() => setBookmarked(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#0E1626] to-[#141F36] border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
            <BookOpen className="w-5 h-5" />
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white">
            স্টাডি রিসোর্স লাইব্রেরি (Study Resources)
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          ১০টি মৌলিক বিষয়ের অধ্যায়ভিত্তিক নোট, সংবিধান বিশ্লেষণ, ইংরেজি ও বাংলা ব্যাকরণ বিধি,
          এবং গাণিতিক সূত্রের প্রামাণ্য ডিজিটাল লাইব্রেরি।
        </p>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোট বা টপিক খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 outline-none"
            />
          </div>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
          >
            <option value="">সকল ১০টি বিষয়</option>
            {meta?.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name_bn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Library: List on left (desktop), Reader on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resource Items Column (4 of 12) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            উপলব্ধ রিসোর্স সংকলন ({resources.length})
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {resources.map((r) => {
              const isSelected = selectedResource?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedResource(r)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10"
                      : "bg-[#0E1626] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-400">
                    <span>{r.subject_name_bn || "সাধারণ"}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {r.resource_type}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100 mt-1.5 leading-snug">
                    {r.title_bn || r.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {r.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reader Canvas Column (8 of 12) */}
        <div className="lg:col-span-8">
          {selectedResource ? (
            <div className="bg-[#0E1626] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              {/* Reader Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                      {selectedResource.subject_name_bn || "বিষয়"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      সম্পাদনা: {selectedResource.author}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white mt-2 leading-snug">
                    {selectedResource.title_bn || selectedResource.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmarkResource}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                      bookmarked
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                    <span>{bookmarked ? "সংরক্ষিত" : "বুকমার্ক"}</span>
                  </button>
                </div>
              </div>

              {/* Reader Markdown Content */}
              <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed space-y-4">
                <div className="whitespace-pre-line font-sans">
                  {selectedResource.content_markdown}
                </div>
              </div>

              {/* Personal Notes Section */}
              <div className="pt-6 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <PenSquare className="w-4 h-4 text-blue-400" />
                    ব্যক্তিগত স্টাডি নোট (Personal Reflection Notes)
                  </span>
                  {noteSaved && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> নোট সংরক্ষিত হয়েছে
                    </span>
                  )}
                </div>
                <textarea
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="এই টপিক বা অধ্যায়ের উপর আপনার নিজস্ব সারসংক্ষেপ বা গুরুত্বপূর্ণ পয়েন্টগুলো লিখে রাখুন..."
                  rows={3}
                  className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    নোট সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl bg-[#0E1626] border border-slate-800 text-slate-400">
              <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">বাম পাশ থেকে যেকোনো নোট বা পাঠ্য উপকরণ নির্বাচন করুন</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudyResourcesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">স্টাডি রিসোর্স লোড হচ্ছে...</div>}>
      <StudyResourcesContent />
    </Suspense>
  );
}
