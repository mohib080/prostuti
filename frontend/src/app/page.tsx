"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  GraduationCap,
  Sparkles,
  Newspaper,
  ShieldCheck,
  Building2,
  Landmark,
  Scale,
  Train,
  ArrowRight,
  CheckCircle2,
  Flame,
  Award,
  Layers,
  FileText
} from "lucide-react";
import { getQuestions, getExamTemplates, getResources, getCurrentAffairs } from "@/lib/api";
import { Question, ExamTemplate, ResourceItem, CurrentAffairItem } from "@/lib/types";
import { QuestionCard } from "@/components/question/QuestionCard";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [mockTemplates, setMockTemplates] = useState<ExamTemplate[]>([]);
  const [studyResources, setStudyResources] = useState<ResourceItem[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [qRes, tmplRes, resRes, caRes] = await Promise.allSettled([
          getQuestions({ page_size: 4 }),
          getExamTemplates(),
          getResources(),
          getCurrentAffairs(),
        ]);

        if (qRes.status === "fulfilled") setRecentQuestions(qRes.value.questions);
        if (tmplRes.status === "fulfilled") setMockTemplates(tmplRes.value);
        if (resRes.status === "fulfilled") setStudyResources(resRes.value.slice(0, 3));
        if (caRes.status === "fulfilled") setCurrentAffairs(caRes.value.slice(0, 2));
      } catch (e) {
        console.error("Error loading home data", e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/question-bank?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    {
      title: "Civil Service",
      title_bn: "বিসিএস ও পিএসসি নন-ক্যাডার",
      desc: "১০ম থেকে ৪৫তম বিসিএস প্রিলিমিনারি ও লিখিত প্রশ্নব্যাংক",
      icon: Landmark,
      color: "from-blue-600/20 to-blue-500/10 border-blue-500/30 text-blue-400",
      slug: "civil-service",
    },
    {
      title: "Bank Recruitment",
      title_bn: "বাংলাদেশ ব্যাংক ও সমন্বিত ব্যাংক",
      desc: "সহকারী পরিচালক (AD), সিনিয়র অফিসার ও অফিসার জেনারেল",
      icon: Building2,
      color: "from-emerald-600/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      slug: "bank-recruitment",
    },
    {
      title: "Government Jobs",
      title_bn: "মন্ত্রণালয় ও অধিদপ্তর নিয়োগ",
      desc: "৯ম-১৬তম গ্রেডের কর্মকর্তা ও কর্মচারী বাছাই পরীক্ষা",
      icon: ShieldCheck,
      color: "from-indigo-600/20 to-violet-500/10 border-indigo-500/30 text-indigo-400",
      slug: "govt-recruitment",
    },
    {
      title: "Teaching Recruitment",
      title_bn: "শিক্ষক নিবন্ধন ও প্রাথমিক নিয়োগ",
      desc: "এনটিআরসিএ (NTRCA) স্কুল/কলেজ ও প্রাথমিক সহকারী শিক্ষক",
      icon: BookOpen,
      color: "from-amber-600/20 to-orange-500/10 border-amber-500/30 text-amber-400",
      slug: "teaching-recruitment",
    },
    {
      title: "Other Competitive",
      title_bn: "বিচার বিভাগ (BJS) ও রেলওয়ে",
      desc: "বাংলাদেশ জুডিশিয়াল সার্ভিস, রেলওয়ে, পুলিশ ও প্রতিরক্ষা",
      icon: Scale,
      color: "from-rose-600/20 to-pink-500/10 border-rose-500/30 text-rose-400",
      slug: "other-competitive",
    },
  ];

  const coreSubjects = [
    { name: "বাংলা ভাষা ও সাহিত্য", marks: "৩৫ নম্বর", code: "BANGLA" },
    { name: "English Language & Literature", marks: "৩৫ নম্বর", code: "ENGLISH" },
    { name: "বাংলাদেশ বিষয়াবলী", marks: "৩০ নম্বর", code: "BD_AFFAIRS" },
    { name: "আন্তর্জাতিক বিষয়াবলী", marks: "২০ নম্বর", code: "INT_AFFAIRS" },
    { name: "সাধারণ বিজ্ঞান", marks: "১৫ নম্বর", code: "GEN_SCIENCE" },
    { name: "কম্পিউটার ও তথ্যপ্রযুক্তি", marks: "১৫ নম্বর", code: "COMPUTER_ICT" },
    { name: "গাণিতিক যুক্তি", marks: "১৫ নম্বর", code: "MATH_REASONING" },
    { name: "মানসিক দক্ষতা", marks: "১৫ নম্বর", code: "MENTAL_ABILITY" },
    { name: "ভূগোল ও পরিবেশ", marks: "১০ নম্বর", code: "GEOGRAPHY" },
    { name: "নৈতিকতা ও সুশাসন", marks: "১০ নম্বর", code: "ETHICS_GOVERNANCE" },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. WELCOME HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D1527] via-[#0A101E] to-[#070B14] border border-slate-800/80 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>বাংলাদেশ প্রতিযোগিতামূলক চাকরি পরীক্ষা প্রস্তুতি প্ল্যাটফর্ম</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            প্রস্তুতি নিন। অনুশীলন করুন।{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
              জয়ী হোন।
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            বিসিএস, বাংলাদেশ ব্যাংক, সরকারি মন্ত্রণালয়, শিক্ষক নিবন্ধন ও অন্যান্য প্রতিযোগিতামূলক পরীক্ষার
            প্রমাণিত প্রশ্নব্যাংক, সমৃদ্ধ পাঠ্য উপকরণ, বাস্তবসম্মত পরীক্ষা ইঞ্জিন এবং এআই চালিত সম্ভাব্য প্রশ্ন সংকলন।
          </p>

          {/* Prominent Search Bar */}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="relative flex items-center max-w-2xl bg-slate-900/90 rounded-2xl border border-slate-700/80 p-1.5 shadow-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="প্রশ্ন, বিষয়, বা পরীক্ষার নাম দিয়ে খুঁজুন (যেমন: চর্যাপদ, ৬ দফা, log, preposition)..."
                className="w-full px-3 py-2 text-sm bg-transparent text-white placeholder-slate-400 outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex-shrink-0"
              >
                অনুসন্ধান
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. EXAMINATION CATEGORIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              পরীক্ষার প্রধান ক্যাটাগরি (Examination Categories)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              আপনার নির্দিষ্ট পরীক্ষার সিলেবাস ও প্রশ্নব্যাংক নির্বাচন করুন
            </p>
          </div>
          <Link
            href="/question-bank"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            সব দেখুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                href={`/question-bank?category_slug=${c.slug}`}
                className={`group p-4 rounded-2xl bg-gradient-to-br ${c.color} border transition-all hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-white" />
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-blue-200">
                  {c.title_bn}
                </h3>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block mt-0.5">
                  {c.title}
                </span>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {c.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED MOCK EXAMINATIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              অনলাইন মক টেস্ট ও পরীক্ষা সিমুলেশন (Live Mock Hall)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রকৃত পরীক্ষার সময়সীমা ও নেগেটিভ মার্কিং সহ বাস্তবসম্মত প্রস্তুতি
            </p>
          </div>
          <Link
            href="/exam-hall"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            পরীক্ষা হলে প্রবেশ করুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTemplates.map((t) => (
            <div
              key={t.id}
              className="bg-[#0E1626] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    {t.target_exam}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {t.duration_minutes} মিনিট
                  </span>
                </div>
                <h3 className="font-bold text-base text-white mt-2 leading-snug">
                  {t.title_bn}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {t.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span className="font-bold text-slate-200">{t.total_questions}টি প্রশ্ন</span> •{" "}
                  <span className="text-rose-400">-{t.negative_mark_rate} নেগেটিভ</span>
                </div>
                <Link
                  href={`/exam-hall?template_id=${t.id}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  পরীক্ষা শুরু করুন
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BCS & BANK 10 CORE SUBJECTS */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            ১০টি মৌলিক বিষয় ভিত্তিক প্রস্তুতি (Syllabus Subjects)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            পিএসসি বিসিএস ও ব্যাংক নিয়োগ সিলেবাসের সম্পূর্ণ বিষয়ভিত্তিক বিভাজন
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {coreSubjects.map((s, idx) => (
            <Link
              key={idx}
              href={`/question-bank?subject_code=${s.code}`}
              className="p-3.5 rounded-xl bg-[#0E1626] border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between"
            >
              <span className="text-xs font-bold text-slate-200 leading-snug">
                {s.name}
              </span>
              <span className="text-[11px] font-semibold text-blue-400 mt-2">
                {s.marks}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. RECENTLY ADDED AUTHENTIC QUESTIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              সম্প্রতি সংযোজিত মৌলিক প্রশ্নসমূহ (Authentic Questions)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              বিগত বিসিএস ও ব্যাংকের প্রশ্নপত্র থেকে বিস্তারিত ব্যাখ্যাসহ তাৎক্ষণিক অনুশীলন
            </p>
          </div>
          <Link
            href="/question-bank"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            প্রশ্নব্যাংক সম্পূর্ণ ব্রাউজ করুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {recentQuestions.map((q, idx) => (
            <QuestionCard key={q.id} question={q} indexNumber={idx + 1} />
          ))}
        </div>
      </section>

      {/* 6. STUDY RESOURCES & CURRENT AFFAIRS BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Notes */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              হাই-ইল্ড পাঠ্য নোট ও সংবিধান বিশ্লেষণ
            </h3>
            <Link href="/study-resources" className="text-xs text-blue-400 hover:underline">
              সকল নোট
            </Link>
          </div>
          <div className="space-y-3">
            {studyResources.map((r) => (
              <Link
                key={r.id}
                href={`/study-resources?id=${r.id}`}
                className="block p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wide">
                  {r.subject_name_bn || "সাধারণ বিষয়"} • {r.resource_type}
                </div>
                <h4 className="text-sm font-semibold text-slate-100 mt-1 line-clamp-1">
                  {r.title_bn || r.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {r.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Current Affairs */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-amber-400" />
              পরীক্ষা উপযোগী সাম্প্রতিক সমাচার (Current Affairs)
            </h3>
            <Link href="/current-affairs" className="text-xs text-amber-400 hover:underline">
              সব খবর
            </Link>
          </div>
          <div className="space-y-3">
            {currentAffairs.map((ca) => (
              <Link
                key={ca.id}
                href={`/current-affairs?id=${ca.id}`}
                className="block p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400">
                  <span>{ca.category}</span>
                  <span className="text-slate-400">{ca.source_name}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 mt-1 line-clamp-1">
                  {ca.title_bn || ca.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {ca.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
