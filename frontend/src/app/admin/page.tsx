"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Upload,
  Database,
  FileCheck,
  AlertTriangle,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw
} from "lucide-react";
import { getAdminStats, getReportedQuestions, updateReportStatus, getFilterMetadata } from "@/lib/api";
import { AdminStats, FilterMetadata } from "@/lib/types";

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [meta, setMeta] = useState<FilterMetadata | null>(null);

  // Tabs: "STATS" | "BULK_IMPORT" | "REPORTS" | "NEW_QUESTION"
  const [activeTab, setActiveTab] = useState<"STATS" | "BULK_IMPORT" | "REPORTS" | "NEW_QUESTION">("STATS");

  // Bulk import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  // Add question form state
  const [newQText, setNewQText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [subjectId, setSubjectId] = useState<number>(1);
  const [examId, setExamId] = useState<number | undefined>(undefined);
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [sourceRef, setSourceRef] = useState("");
  const [questionCreated, setQuestionCreated] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [sData, rData, mData] = await Promise.all([
        getAdminStats(),
        getReportedQuestions(),
        getFilterMetadata(),
      ]);
      setStats(sData);
      setReports(rData);
      setMeta(mData);
      if (mData.subjects.length > 0) {
        setSubjectId(mData.subjects[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setIsImporting(true);
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const res = await fetch("/api/v1/admin/bulk-import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Import failed");
      setImportResult(data);
      loadAdminData();
    } catch (e: any) {
      alert("ইমপোর্ট ব্যর্থ: " + e.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleUpdateReport = async (reportId: number, status: string) => {
    try {
      await updateReportStatus(reportId, status);
      setReports(
        reports.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !optA || !optB || !optC || !optD) {
      alert("অনুগ্রহ করে প্রশ্নের বক্তব্য এবং ৪টি অপশন সঠিকভাবে পূরণ করুন।");
      return;
    }

    try {
      const res = await fetch("/api/v1/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: newQText.trim(),
          question_text_bn: newQText.trim(),
          options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
          correct_option_index: correctIdx,
          explanation: explanation.trim(),
          explanation_bn: explanation.trim(),
          subject_id: subjectId,
          examination_id: examId || undefined,
          difficulty: difficulty,
          language: "BN",
          question_type: "AUTHENTIC_PREVIOUS",
          source_reference: sourceRef.trim() || "মৌলিক প্রশ্নপত্র",
        }),
      });

      if (!res.ok) throw new Error("প্রশ্ন যুক্ত করতে ব্যর্থ হয়েছে");

      setQuestionCreated(true);
      setNewQText("");
      setOptA("");
      setOptB("");
      setOptC("");
      setOptD("");
      setExplanation("");
      setSourceRef("");
      loadAdminData();
      setTimeout(() => setQuestionCreated(false), 3000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-6 md:p-8 bg-white border border-[#E7E3D9] rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF8F3] text-[#24483B] border border-[#E7E3D9]">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[#252A27]">
              প্রস্তুতি এডমিন কনসোল (Administration Panel)
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#737A73] mt-1 max-w-xl font-bengali">
            প্রশ্নব্যাংক ব্যবস্থাপনা, বাল্ক ইমপোর্ট, ডুপ্লিকেট চেকার এবং ব্যবহারকারীদের ত্রুটি রিপোর্ট সমাধান।
          </p>
        </div>

        <div className="text-xs font-semibold text-[#24483B] px-3 py-1.5 rounded-xl bg-[#FAF8F3] border border-[#E7E3D9]">
          Super Admin Mode
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E7E3D9] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("STATS")}
          className={`px-4 py-2 rounded-xl transition-colors font-bengali ${
            activeTab === "STATS"
              ? "bg-[#24483B] text-white shadow-xs"
              : "text-[#737A73] hover:text-[#252A27]"
          }`}
        >
          পরিসংখ্যান ড্যাশবোর্ড
        </button>
        <button
          onClick={() => setActiveTab("BULK_IMPORT")}
          className={`px-4 py-2 rounded-xl transition-colors font-bengali ${
            activeTab === "BULK_IMPORT"
              ? "bg-[#24483B] text-white shadow-xs"
              : "text-[#737A73] hover:text-[#252A27]"
          }`}
        >
          বাল্ক প্রশ্ন ইমপোর্ট (CSV / JSON)
        </button>
        <button
          onClick={() => setActiveTab("REPORTS")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 font-bengali ${
            activeTab === "REPORTS"
              ? "bg-[#24483B] text-white shadow-xs"
              : "text-[#737A73] hover:text-[#252A27]"
          }`}
        >
          <span>রিপোর্ট পর্যালোচনা</span>
          {stats?.pending_reports ? (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-700 text-white text-[10px]">
              {stats.pending_reports}
            </span>
          ) : null}
        </button>
        <button
          onClick={() => setActiveTab("NEW_QUESTION")}
          className={`px-4 py-2 rounded-xl transition-colors font-bengali ${
            activeTab === "NEW_QUESTION"
              ? "bg-[#24483B] text-white shadow-xs"
              : "text-[#737A73] hover:text-[#252A27]"
          }`}
        >
          নতুন প্রশ্ন যুক্ত করুন
        </button>
      </div>

      {/* TAB 1: STATS */}
      {activeTab === "STATS" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-white border border-[#E7E3D9] shadow-sm">
              <div className="text-xs text-[#737A73] font-medium font-bengali">মোট প্রশ্ন সংখ্যা</div>
              <div className="text-3xl font-serif font-bold text-[#24483B] mt-2">
                {stats.total_questions}
              </div>
              <div className="text-[11px] text-[#737A73] font-medium mt-1 font-bengali">
                মৌলিক: {stats.authentic_questions}টি
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E7E3D9] shadow-sm">
              <div className="text-xs text-[#737A73] font-medium font-bengali">এআই সম্ভাব্য প্রশ্ন</div>
              <div className="text-3xl font-serif font-bold text-[#B69A70] mt-2">
                {stats.ai_questions}
              </div>
              <div className="text-[11px] text-[#737A73] font-medium mt-1 font-bengali">
                অনুশীলন: {stats.practice_questions}টি
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E7E3D9] shadow-sm">
              <div className="text-xs text-[#737A73] font-medium font-bengali">সিলেবাস বিষয় ও পরীক্ষা</div>
              <div className="text-3xl font-serif font-bold text-[#166534] mt-2">
                {stats.total_subjects} / {stats.total_exams}
              </div>
              <div className="text-[11px] text-[#737A73] font-medium mt-1 font-bengali">
                রিসোর্স: {stats.total_resources}টি
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E7E3D9] shadow-sm">
              <div className="text-xs text-[#737A73] font-medium font-bengali">অমীমাংসিত রিপোর্ট</div>
              <div className="text-3xl font-serif font-bold text-rose-700 mt-2">
                {stats.pending_reports}
              </div>
              <div className="text-[11px] text-[#737A73] font-medium mt-1 font-bengali">
                সমসাময়িক ঘটনা: {stats.total_current_affairs}টি
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BULK IMPORT */}
      {activeTab === "BULK_IMPORT" && (
        <div className="p-6 md:p-8 bg-white border border-[#E7E3D9] rounded-3xl max-w-2xl space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#FAF8F3] text-[#24483B] border border-[#E7E3D9]">
              <Upload className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-[#252A27]">
                বাল্ক প্রশ্ন আপলোড ইঞ্জিন (Bulk Question Uploader)
              </h3>
              <p className="text-xs text-[#737A73] font-bengali">
                JSON অথবা CSV ফরম্যাটের ফাইল আপলোড করুন। স্বয়ংক্রিয় ডুপ্লিকেট ডিটেকশন কার্যকর থাকবে।
              </p>
            </div>
          </div>

          <form onSubmit={handleBulkUpload} className="space-y-4">
            <div className="border-2 border-dashed border-[#E7E3D9] hover:border-[#24483B] bg-[#FAF8F3] rounded-2xl p-6 text-center cursor-pointer transition-colors">
              <input
                type="file"
                accept=".json,.csv"
                onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-[#252A27] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#24483B] file:text-white hover:file:bg-[#1B362C]"
              />
              <p className="text-[11px] text-[#737A73] mt-2 font-bengali">
                সমর্থিত ফাইল: .json, .csv (কলাম: question_text, option_a, option_b, option_c, option_d, correct_option_index, explanation)
              </p>
            </div>

            <button
              type="submit"
              disabled={!importFile || isImporting}
              className="w-full py-3 rounded-xl bg-[#24483B] hover:bg-[#1B362C] text-white font-semibold text-xs disabled:opacity-40 transition-colors shadow-sm font-bengali"
            >
              {isImporting ? "ফাইল প্রসেস হচ্ছে..." : "প্রশ্নসমূহ ইমপোর্ট করুন"}
            </button>
          </form>

          {importResult && (
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs space-y-1 font-bengali">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                ইমপোর্ট প্রক্রিয়া সম্পন্ন!
              </div>
              <div>সফলভাবে যুক্ত হয়েছে: {importResult.imported}টি নতুন প্রশ্ন</div>
              <div>ডুপ্লিকেট বাদ পড়েছে: {importResult.duplicates_skipped}টি প্রশ্ন</div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REPORTS */}
      {activeTab === "REPORTS" && (
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#737A73] font-bengali">
            ব্যবহারকারীদের প্রদত্ত সংশোধন ও রিপোর্ট তালিকা ({reports.length})
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E7E3D9] rounded-3xl text-[#737A73] text-xs font-bengali shadow-sm">
              বর্তমানে কোনো অমীমাংসিত রিপোর্ট নেই।
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-white border border-[#E7E3D9] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        {r.reason}
                      </span>
                      <span className="text-xs text-[#737A73]">
                        প্রশ্ন #{r.question_id}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          r.status === "PENDING"
                            ? "bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]"
                            : "bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <h4 className="font-serif font-semibold text-sm text-[#252A27] font-bengali">
                      {r.question_text}
                    </h4>
                    {r.details && (
                      <p className="text-xs text-[#737A73] italic font-bengali">
                        ব্যবহারকারীর মন্তব্য: &quot;{r.details}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleUpdateReport(r.id, "RESOLVED")}
                      className="px-3 py-1.5 rounded-lg bg-[#24483B] hover:bg-[#1B362C] text-white font-semibold text-xs shadow-xs font-bengali"
                    >
                      সমাধান চিহ্নিত করুন
                    </button>
                    <button
                      onClick={() => handleUpdateReport(r.id, "REJECTED")}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF8F3] hover:bg-[#EFECE3] border border-[#E7E3D9] text-[#252A27] text-xs font-bengali"
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: NEW QUESTION FORM */}
      {activeTab === "NEW_QUESTION" && (
        <form onSubmit={handleCreateQuestion} className="bg-white border border-[#E7E3D9] rounded-3xl p-6 md:p-8 space-y-5 max-w-3xl shadow-sm">
          <h3 className="font-serif font-bold text-base text-[#252A27] flex items-center gap-2 font-bengali">
            <PlusCircle className="w-5 h-5 text-[#24483B]" />
            নতুন প্রামাণ্য প্রশ্ন যুক্তকরণ
          </h3>

          {questionCreated && (
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs rounded-xl flex items-center gap-2 font-bengali">
              <CheckCircle2 className="w-4 h-4" />
              প্রশ্নটি ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে।
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
              প্রশ্নের বক্তব্য (Question Statement) *
            </label>
            <textarea
              required
              rows={2}
              value={newQText}
              onChange={(e) => setNewQText(e.target.value)}
              placeholder="প্রশ্নের পুরো বাক্যটি এখানে লিখুন..."
              className="w-full p-3 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
                বিকল্প ক (Option A) *
              </label>
              <input
                required
                type="text"
                value={optA}
                onChange={(e) => setOptA(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
                বিকল্প খ (Option B) *
              </label>
              <input
                required
                type="text"
                value={optB}
                onChange={(e) => setOptB(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
                বিকল্প গ (Option C) *
              </label>
              <input
                required
                type="text"
                value={optC}
                onChange={(e) => setOptC(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
                বিকল্প ঘ (Option D) *
              </label>
              <input
                required
                type="text"
                value={optD}
                onChange={(e) => setOptD(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
                সঠিক উত্তর নির্বাচন করুন *
              </label>
              <select
                value={correctIdx}
                onChange={(e) => setCorrectIdx(Number(e.target.value))}
                className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
              >
                <option value={0}>বিকল্প ক (Option A)</option>
                <option value={1}>বিকল্প খ (Option B)</option>
                <option value={2}>বিকল্প গ (Option C)</option>
                <option value={3}>বিকল্প ঘ (Option D)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
                বিষয় (Subject) *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(Number(e.target.value))}
                className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
              >
                {meta?.subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name_bn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
                কঠিন্য মাত্রা
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
              >
                <option value="EASY">সহজ (Easy)</option>
                <option value="MEDIUM">মাঝারি (Medium)</option>
                <option value="HARD">কঠিন (Hard)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
              বিস্তারিত ব্যাখ্যা ও প্রামাণ্য তথ্য (Explanation)
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="কেন এই বিকল্পটি সঠিক এবং সংশ্লিষ্ট ঐতিহাসিক বা সাংবিধানিক তথ্য..."
              className="w-full p-3 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252A27] mb-1 font-bengali">
              মূল পরীক্ষার সূত্র / রেফারেন্স (Source Reference)
            </label>
            <input
              type="text"
              value={sourceRef}
              onChange={(e) => setSourceRef(e.target.value)}
              placeholder="যেমন: ৪৫তম বিসিএস প্রিলিমিনারি, প্রশ্ন নং-০৮"
              className="w-full p-2.5 bg-[#FAF8F3] border border-[#E7E3D9] rounded-xl text-xs text-[#252A27] outline-none focus:border-[#24483B] font-bengali"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#24483B] hover:bg-[#1B362C] text-white font-semibold text-xs transition-colors shadow-sm font-bengali"
          >
            প্রশ্নটি ডাটাবেজে সংরক্ষণ করুন
          </button>
        </form>
      )}
    </div>
  );
}
