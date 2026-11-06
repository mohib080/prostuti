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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 bg-gradient-to-r from-[#0E1626] to-[#141C30] border border-slate-800 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <BookmarkCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white">
              আমার সংগ্রহ ও বুকমার্ক (My Collections)
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
            আপনার পছন্দের প্রশ্ন, পাঠ্য উপকরণ এবং ব্যক্তিগত কাস্টম প্র্যাকটিস সেট এক জায়গায় সাজিয়ে রাখুন।
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <FolderPlus className="w-4 h-4" />
          <span>নতুন সংগ্রহ ফোল্ডার</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("COLLECTIONS")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "COLLECTIONS"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          কাস্টম সংগ্রহ ফোল্ডার ({collections.length})
        </button>
        <button
          onClick={() => setActiveTab("BOOKMARKS")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "BOOKMARKS"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          বুকমার্ক করা আইটেম ({bookmarks.length})
        </button>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <form onSubmit={handleCreateCollection} className="p-5 rounded-2xl bg-[#0E1626] border border-blue-500/50 shadow-xl space-y-4 max-w-lg">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-blue-400" />
            নতুন সংগ্রহ তৈরি করুন
          </h3>
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">
              সংগ্রহের নাম (যেমন: কঠিন ইংরেজি ভোকাবুলারি, সংবিধান অনুচ্ছেদ)
            </label>
            <input
              type="text"
              required
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">
              বিবরণ (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={newCollectionDesc}
              onChange={(e) => setNewCollectionDesc(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
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
              <div className="p-8 text-center bg-[#0E1626] border border-slate-800 rounded-2xl text-xs text-slate-400">
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
                        ? "bg-blue-600/15 border-blue-500 shadow-md"
                        : "bg-[#0E1626] border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Folder className={`w-5 h-5 ${isSelected ? "text-blue-400" : "text-slate-400"}`} />
                      <div>
                        <h4 className="font-semibold text-sm text-slate-100">
                          {c.name}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {c.question_count}টি সংরক্ষিত প্রশ্ন
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                );
              })
            )}
          </div>

          {/* Collection Questions Canvas (8 of 12) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedCollection ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0E1626] border border-slate-800 rounded-2xl">
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {selectedCollection.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedCollection.description || "ব্যক্তিগত কাস্টম সংগ্রহ"}
                    </p>
                  </div>
                  {collectionQuestions.length > 0 && (
                    <Link
                      href={`/exam-hall?custom_collection_id=${selectedCollection.id}`}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      অনুশীলন পরীক্ষা দিন
                    </Link>
                  )}
                </div>

                {loadingQuestions ? (
                  <div className="h-40 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
                ) : collectionQuestions.length === 0 ? (
                  <div className="p-12 text-center bg-[#0E1626] border border-slate-800 rounded-3xl text-slate-400 space-y-2">
                    <p className="text-sm font-semibold text-slate-300">
                      এই ফোল্ডারে এখনও কোনো প্রশ্ন যুক্ত করা হয়নি
                    </p>
                    <p className="text-xs">
                      প্রশ্নব্যাংক থেকে যেকোনো প্রশ্নের বুকমার্ক বা অ্যাড আইকনে ক্লিক করে এখানে যুক্ত করতে পারেন।
                    </p>
                    <Link
                      href="/question-bank"
                      className="inline-block mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold rounded-xl"
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
              <div className="p-12 text-center bg-[#0E1626] border border-slate-800 rounded-2xl text-slate-400 text-xs">
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
            <div className="p-12 text-center bg-[#0E1626] border border-slate-800 rounded-3xl text-slate-400 text-xs">
              এখনও কোনো আইটেম বুকমার্ক করা হয়নি।
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-[#0E1626] border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    {b.item_type}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100 mt-1">
                    {b.item_data?.title || `আইটেম #${b.item_id}`}
                  </h4>
                  {b.item_data?.subject && (
                    <span className="text-xs text-slate-400">
                      বিষয়: {b.item_data.subject}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={b.item_type === "RESOURCE" ? `/study-resources?id=${b.item_id}` : `/question-bank?q=${b.item_id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold"
                  >
                    দেখুন
                  </Link>
                  <button
                    onClick={() => handleRemoveBookmark(b.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
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
