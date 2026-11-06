"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookmarkCheck,
  FolderPlus,
  Play,
  Trash2,
  BookOpen,
  HelpCircle,
  Folder,
  Layers,
  ArrowRight
} from "lucide-react";
import { getCollections, createCollection, getBookmarks, removeBookmark, getCollectionQuestions } from "@/lib/api";
import { CollectionItem, Question } from "@/lib/types";
import { QuestionCard } from "@/components/question/QuestionCard";

export default function MyCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"COLLECTIONS" | "BOOKMARKS">("COLLECTIONS");

  // Create Collection modal
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDesc, setNewCollectionDesc] = useState("");

  // Selected collection inspection
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);
  const [collectionQuestions, setCollectionQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cols, bms] = await Promise.all([getCollections(), getBookmarks()]);
      setCollections(cols);
      setBookmarks(bms);
      if (cols.length > 0 && !selectedCollection) {
        setSelectedCollection(cols[0]);
        loadQuestionsForCol(cols[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadQuestionsForCol = async (id: number) => {
    setLoadingQuestions(true);
    try {
      const qList = await getCollectionQuestions(id);
      setCollectionQuestions(qList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      const created = await createCollection(newCollectionName.trim(), newCollectionDesc.trim());
      setCollections([created, ...collections]);
      setSelectedCollection(created);
      setIsCreating(false);
      setNewCollectionName("");
      setNewCollectionDesc("");
    } catch (e: any) {
      alert("সংগ্রহ তৈরি করতে ত্রুটি: " + e.message);
    }
  };

  const handleRemoveBookmark = async (id: number) => {
    try {
      await removeBookmark(id);
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 bg-white border border-[#E7E3D9] rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF8F3] text-[#24483B] border border-[#E7E3D9]">
              <BookmarkCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[#252A27]">
              আমার সংগ্রহ ও বুকমার্ক (My Collections)
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#737A73] mt-1 max-w-xl font-bengali">
            আপনার পছন্দের প্রশ্ন, পাঠ্য উপকরণ এবং ব্যক্তিগত কাস্টম প্র্যাকটিস সেট এক জায়গায় সাজিয়ে রাখুন।
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#24483B] hover:bg-[#1B362C] text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto font-bengali"
        >
          <FolderPlus className="w-4 h-4" />
          <span>নতুন সংগ্রহ ফোল্ডার</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E7E3D9] pb-2">
        <button
          onClick={() => setActiveTab("COLLECTIONS")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors font-bengali ${
            activeTab === "COLLECTIONS"
              ? "bg-[#24483B] text-white shadow-xs"
              : "text-[#737A73] hover:text-[#252A27]"
          }`}
        >
          কাস্টম সংগ্রহ ফোল্ডার ({collections.length})
        </button>
        <button
          onClick={() => setActiveTab("BOOKMARKS")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors font-bengali ${
            activeTab === "BOOKMARKS"
              ? "bg-[#24483B] text-white shadow-xs"
              : "text-[#737A73] hover:text-[#252A27]"
          }`}
        >
          বুকমার্ক করা আইটেম ({bookmarks.length})
        </button>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <form onSubmit={handleCreateCollection} className="p-5 rounded-2xl bg-white border border-[#E7E3D9] shadow-sm space-y-4 max-w-lg">
          <h3 className="font-serif font-bold text-sm text-[#252A27] flex items-center gap-2 font-bengali">
            <FolderPlus className="w-4 h-4 text-[#24483B]" />
            নতুন সংগ্রহ তৈরি করুন
          </h3>
          <div>
            <label className="block text-xs text-[#252A27] font-semibold mb-1 font-bengali">
              সংগ্রহের নাম (যেমন: কঠিন ইংরেজি ভোকাবুলারি, সংবিধান অনুচ্ছেদ)
            </label>
            <input
              type="text"
              required
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
            />
          </div>
          <div>
            <label className="block text-xs text-[#252A27] font-semibold mb-1 font-bengali">
              বিবরণ (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={newCollectionDesc}
              onChange={(e) => setNewCollectionDesc(e.target.value)}
              className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F3] border border-[#E7E3D9] text-xs text-[#252A27] font-bengali"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#24483B] hover:bg-[#1B362C] text-white text-xs font-semibold shadow-xs font-bengali"
            >
              তৈরি করুন
            </button>
          </div>
        </form>
      )}

      {/* VIEW: COLLECTIONS */}
      {activeTab === "COLLECTIONS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Collection Folders List (4 of 12) */}
          <div className="lg:col-span-4 space-y-3">
            {collections.length === 0 ? (
              <div className="p-8 text-center bg-white border border-[#E7E3D9] rounded-2xl text-xs text-[#737A73] font-bengali shadow-sm">
                এখনও কোনো কাস্টম সংগ্রহ তৈরি করা হয়নি। &quot;নতুন সংগ্রহ ফোল্ডার&quot; বাটনে ক্লিক করে তৈরি করুন।
              </div>
            ) : (
              collections.map((c) => {
                const isSelected = selectedCollection?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCollection(c);
                      loadQuestionsForCol(c.id);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#F0FDF4] border-[#86EFAC] shadow-xs"
                        : "bg-white border-[#E7E3D9] hover:border-[#24483B]/40 hover:bg-[#FAF8F3]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Folder className={`w-5 h-5 ${isSelected ? "text-[#166534]" : "text-[#737A73]"}`} />
                      <div>
                        <h4 className="font-serif font-semibold text-sm text-[#252A27] font-bengali">
                          {c.name}
                        </h4>
                        <span className="text-xs text-[#737A73] font-bengali">
                          {c.question_count}টি সংরক্ষিত প্রশ্ন
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#737A73]" />
                  </div>
                );
              })
            )}
          </div>

          {/* Collection Questions Canvas (8 of 12) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedCollection ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border border-[#E7E3D9] rounded-2xl shadow-sm">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#252A27] font-bengali">
                      {selectedCollection.name}
                    </h3>
                    <p className="text-xs text-[#737A73] font-bengali">
                      {selectedCollection.description || "ব্যক্তিগত কাস্টম সংগ্রহ"}
                    </p>
                  </div>
                  {collectionQuestions.length > 0 && (
                    <Link
                      href={`/exam-hall?custom_collection_id=${selectedCollection.id}`}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#24483B] hover:bg-[#1B362C] text-white font-semibold text-xs shadow-sm font-bengali"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      অনুশীলন পরীক্ষা দিন
                    </Link>
                  )}
                </div>

                {loadingQuestions ? (
                  <div className="h-40 rounded-2xl bg-white border border-[#E7E3D9] animate-pulse" />
                ) : collectionQuestions.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-[#E7E3D9] rounded-3xl text-[#737A73] space-y-2 shadow-sm font-bengali">
                    <p className="text-sm font-semibold text-[#252A27]">
                      এই ফোল্ডারে এখনও কোনো প্রশ্ন যুক্ত করা হয়নি
                    </p>
                    <p className="text-xs">
                      প্রশ্নব্যাংক থেকে যেকোনো প্রশ্নের বুকমার্ক বা অ্যাড আইকনে ক্লিক করে এখানে যুক্ত করতে পারেন।
                    </p>
                    <Link
                      href="/question-bank"
                      className="inline-block mt-3 px-4 py-2 bg-[#FAF8F3] border border-[#E7E3D9] hover:bg-[#EFECE3] text-[#24483B] text-xs font-semibold rounded-xl"
                    >
                      প্রশ্নব্যাংক ব্রাউজ করুন
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {collectionQuestions.map((q, idx) => (
                      <QuestionCard key={q.id} question={q} indexNumber={idx + 1} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center bg-white border border-[#E7E3D9] rounded-2xl text-[#737A73] text-xs font-bengali shadow-sm">
                একটি সংগ্রহ নির্বাচন করুন
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: BOOKMARKS */}
      {activeTab === "BOOKMARKS" && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E7E3D9] rounded-3xl text-[#737A73] text-xs font-bengali shadow-sm">
              এখনও কোনো আইটেম বুকমার্ক করা হয়নি।
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-white border border-[#E7E3D9] flex items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF8F3] text-[#24483B] border border-[#E7E3D9]">
                    {b.item_type}
                  </span>
                  <h4 className="font-serif font-semibold text-sm text-[#252A27] mt-1 font-bengali">
                    {b.item_data?.title || `আইটেম #${b.item_id}`}
                  </h4>
                  {b.item_data?.subject && (
                    <span className="text-xs text-[#737A73] font-bengali">
                      বিষয়: {b.item_data.subject}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={b.item_type === "RESOURCE" ? `/study-resources?id=${b.item_id}` : `/question-bank?q=${b.item_id}`}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF8F3] border border-[#E7E3D9] hover:bg-[#EFECE3] text-[#24483B] text-xs font-semibold font-bengali"
                  >
                    দেখুন
                  </Link>
                  <button
                    onClick={() => handleRemoveBookmark(b.id)}
                    className="p-1.5 rounded-lg text-[#737A73] hover:text-rose-700 hover:bg-[#FAF8F3]"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
