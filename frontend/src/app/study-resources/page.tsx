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
    <div className="space-y-6 pb-20 font-sans">
      {/* Header */}
      <div className="p-6 md:p-8 bg-white border border-[#E7E3D9] rounded-3xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#FAF8F3] text-[#24483B] border border-[#E7E3D9]">
            <BookOpen className="w-5 h-5" />
          </span>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-[#252A27]">
            স্টাডি রিসোর্স লাইব্রেরি (Study Resources)
          </h1>
        </div>
        <p className="text-xs md:text-sm text-[#737A73] mt-1 max-w-2xl leading-relaxed font-bengali">
          ১০টি মৌলিক বিষয়ের অধ্যায়ভিত্তিক নোট, সংবিধান বিশ্লেষণ, ইংরেজি ও বাংলা ব্যাকরণ বিধি,
          এবং গাণিতিক সূত্রের প্রামাণ্য ডিজিটাল লাইব্রেরি।
        </p>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737A73]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোট বা টপিক খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] placeholder-[#737A73] outline-none focus:border-[#24483B] font-bengali"
            />
          </div>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="p-2 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
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
          <div className="text-xs font-semibold uppercase tracking-wider text-[#737A73] px-1 font-bengali">
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
                      ? "bg-[#F0FDF4] border-[#86EFAC] shadow-xs"
                      : "bg-white border-[#E7E3D9] hover:border-[#24483B]/40 hover:bg-[#FAF8F3]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#24483B] font-bengali">
                    <span>{r.subject_name_bn || "সাধারণ"}</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F3] border border-[#E7E3D9] text-[#737A73]">
                      {r.resource_type}
                    </span>
                  </div>
                  <h4 className="font-serif font-semibold text-sm text-[#252A27] mt-1.5 leading-snug font-bengali">
                    {r.title_bn || r.title}
                  </h4>
                  <p className="text-xs text-[#737A73] mt-1 line-clamp-2 font-bengali">
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
            <div className="bg-white border border-[#E7E3D9] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              {/* Reader Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E7E3D9]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] text-[#24483B] text-xs font-semibold border border-[#E7E3D9] font-bengali">
                      {selectedResource.subject_name_bn || "বিষয়"}
                    </span>
                    <span className="text-xs text-[#737A73] font-medium font-bengali">
                      সম্পাদনা: {selectedResource.author}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-serif font-bold text-[#252A27] mt-2 leading-snug font-bengali">
                    {selectedResource.title_bn || selectedResource.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmarkResource}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors font-bengali ${
                      bookmarked
                        ? "bg-[#FEFCE8] border-[#FEF08A] text-[#854D0E]"
                        : "bg-[#FAF8F3] border-[#E7E3D9] text-[#737A73] hover:text-[#252A27]"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                    <span>{bookmarked ? "সংরক্ষিত" : "বুকমার্ক"}</span>
                  </button>
                </div>
              </div>

              {/* Reader Markdown Content */}
              <div className="max-w-none text-[#252A27] text-sm md:text-base leading-relaxed space-y-4 font-bengali">
                <div className="whitespace-pre-line">
                  {selectedResource.content_markdown}
                </div>
              </div>

              {/* Personal Notes Section */}
              <div className="pt-6 border-t border-[#E7E3D9] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#252A27] flex items-center gap-1.5 font-bengali">
                    <PenSquare className="w-4 h-4 text-[#24483B]" />
                    ব্যক্তিগত স্টাডি নোট (Personal Reflection Notes)
                  </span>
                  {noteSaved && (
                    <span className="text-xs font-bold text-[#166534] flex items-center gap-1 font-bengali">
                      <Check className="w-3.5 h-3.5" /> নোট সংরক্ষিত হয়েছে
                    </span>
                  )}
                </div>
                <textarea
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="এই টপিক বা অধ্যায়ের উপর আপনার নিজস্ব সারসংক্ষেপ বা গুরুত্বপূর্ণ পয়েন্টগুলো লিখে রাখুন..."
                  rows={3}
                  className="w-full p-3 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs md:text-sm text-[#252A27] placeholder-[#737A73] outline-none focus:border-[#24483B] font-bengali"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 bg-[#24483B] hover:bg-[#1B362C] text-white rounded-xl text-xs font-semibold transition-colors font-bengali shadow-sm"
                  >
                    নোট সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl bg-white border border-[#E7E3D9] text-[#737A73] font-bengali">
              <FileText className="w-10 h-10 mx-auto text-[#737A73] mb-2" />
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#737A73] font-bengali">স্টাডি রিসোর্স লোড হচ্ছে...</div>}>
      <StudyResourcesContent />
    </Suspense>
  );
}
