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
      slug: "civil-service",
    },
    {
      title: "Bank Recruitment",
      title_bn: "বাংলাদেশ ব্যাংক ও সমন্বিত ব্যাংক",
      desc: "সহকারী পরিচালক (AD), সিনিয়র অফিসার ও অফিসার জেনারেল",
      icon: Building2,
      slug: "bank-recruitment",
    },
    {
      title: "Government Jobs",
      title_bn: "মন্ত্রণালয় ও অধিদপ্তর নিয়োগ",
      desc: "৯ম-১৬তম গ্রেডের কর্মকর্তা ও কর্মচারী বাছাই পরীক্ষা",
      icon: ShieldCheck,
      slug: "govt-recruitment",
    },
    {
      title: "Teaching Recruitment",
      title_bn: "শিক্ষক নিবন্ধন ও প্রাথমিক নিয়োগ",
      desc: "এনটিআরসিএ (NTRCA) স্কুল/কলেজ ও প্রাথমিক সহকারী শিক্ষক",
      icon: BookOpen,
      slug: "teaching-recruitment",
    },
    {
      title: "Other Competitive",
      title_bn: "বিচার বিভাগ (BJS) ও রেলওয়ে",
      desc: "বাংলাদেশ জুডিশিয়াল সার্ভিস, রেলওয়ে, পুলিশ ও প্রতিরক্ষা",
      icon: Scale,
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
    <div className="space-y-10 pb-16 font-sans">
      {/* 1. WELCOME HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-[#FAF8F3] border border-[#E7E3D9] p-6 md:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFECE3] border border-[#E7E3D9] text-xs font-semibold text-[#24483B] font-bengali">
            <Sparkles className="w-3.5 h-3.5 text-[#B69A70]" />
            <span>বাংলাদেশ প্রতিযোগিতামূলক চাকরি পরীক্ষা প্রস্তুতি প্ল্যাটফর্ম</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#252A27] tracking-tight leading-tight">
            প্রস্তুতি নিন। অনুশীলন করুন।{" "}
            <span className="text-[#24483B]">
              জয়ী হোন।
            </span>
          </h1>

          <p className="text-sm md:text-base text-[#737A73] leading-relaxed max-w-2xl font-bengali">
            বিসিএস, বাংলাদেশ ব্যাংক, সরকারি মন্ত্রণালয়, শিক্ষক নিবন্ধন ও অন্যান্য প্রতিযোগিতামূলক পরীক্ষার
            প্রমাণিত প্রশ্নব্যাংক, সমৃদ্ধ পাঠ্য উপকরণ, বাস্তবসম্মত পরীক্ষা ইঞ্জিন এবং এআই চালিত সম্ভাব্য প্রশ্ন সংকলন।
          </p>

          {/* Prominent Search Bar */}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="relative flex items-center max-w-2xl bg-white rounded-2xl border border-[#E7E3D9] p-1.5 shadow-sm focus-within:border-[#24483B] focus-within:ring-2 focus-within:ring-[#24483B]/20 transition-all">
              <Search className="w-5 h-5 text-[#737A73] ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="প্রশ্ন, বিষয়, বা পরীক্ষার নাম দিয়ে খুঁজুন (যেমন: চর্যাপদ, ৬ দফা, log, preposition)..."
                className="w-full px-3 py-2 text-sm bg-transparent text-[#252A27] placeholder-[#737A73] outline-none font-bengali"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#24483B] hover:bg-[#1B362C] text-white text-xs font-semibold transition-all shadow-sm flex-shrink-0 font-bengali"
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
            <h2 className="text-lg md:text-xl font-serif font-bold text-[#252A27] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#24483B]" />
              পরীক্ষার প্রধান ক্যাটাগরি (Examination Categories)
            </h2>
            <p className="text-xs text-[#737A73] mt-0.5 font-bengali">
              আপনার নির্দিষ্ট পরীক্ষার সিলেবাস ও প্রশ্নব্যাংক নির্বাচন করুন
            </p>
          </div>
          <Link
            href="/question-bank"
            className="text-xs font-semibold text-[#24483B] hover:underline flex items-center gap-1 font-bengali"
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
                className="group p-4 rounded-2xl bg-white border border-[#E7E3D9] transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[#24483B]/40"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E7E3D9] text-[#24483B]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#24483B]" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#252A27] group-hover:text-[#24483B] font-bengali">
                  {c.title_bn}
                </h3>
                <span className="text-[10px] font-semibold text-[#737A73] uppercase tracking-wider block mt-0.5">
                  {c.title}
                </span>
                <p className="text-xs text-[#737A73] mt-2 line-clamp-2 leading-relaxed font-bengali">
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
            <h2 className="text-lg md:text-xl font-serif font-bold text-[#252A27] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#24483B]" />
              অনলাইন মক টেস্ট ও পরীক্ষা সিমুলেশন (Live Mock Hall)
            </h2>
            <p className="text-xs text-[#737A73] mt-0.5 font-bengali">
              প্রকৃত পরীক্ষার সময়সীমা ও নেগেটিভ মার্কিং সহ বাস্তবসম্মত প্রস্তুতি
            </p>
          </div>
          <Link
            href="/exam-hall"
            className="text-xs font-semibold text-[#24483B] hover:underline flex items-center gap-1 font-bengali"
          >
            পরীক্ষা হলে প্রবেশ করুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTemplates.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-[#E7E3D9] rounded-2xl p-5 hover:border-[#24483B]/40 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#FAF8F3] text-[#24483B] border border-[#E7E3D9]">
                    {t.target_exam}
                  </span>
                  <span className="text-xs font-mono font-medium text-[#737A73]">
                    {t.duration_minutes} মিনিট
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#252A27] mt-2 leading-snug font-bengali">
                  {t.title_bn}
                </h3>
                <p className="text-xs text-[#737A73] mt-2 line-clamp-2 font-bengali">
                  {t.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E7E3D9] flex items-center justify-between">
                <div className="text-xs text-[#737A73] font-bengali">
                  <span className="font-semibold text-[#252A27]">{t.total_questions}টি প্রশ্ন</span> •{" "}
                  <span className="text-rose-700 font-medium">-{t.negative_mark_rate} নেগেটিভ</span>
                </div>
                <Link
                  href={`/exam-hall?template_id=${t.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#24483B] hover:bg-[#1B362C] text-white font-semibold text-xs transition-colors shadow-sm font-bengali"
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
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#252A27] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#B69A70]" />
            ১০টি মৌলিক বিষয় ভিত্তিক প্রস্তুতি (Syllabus Subjects)
          </h2>
          <p className="text-xs text-[#737A73] mt-0.5 font-bengali">
            পিএসসি বিসিএস ও ব্যাংক নিয়োগ সিলেবাসের সম্পূর্ণ বিষয়ভিত্তিক বিভাজন
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {coreSubjects.map((s, idx) => (
            <Link
              key={idx}
              href={`/question-bank?subject_code=${s.code}`}
              className="p-3.5 rounded-xl bg-white border border-[#E7E3D9] hover:border-[#24483B] hover:bg-[#FAF8F3] transition-all flex flex-col justify-between shadow-sm"
            >
              <span className="text-xs font-semibold text-[#252A27] leading-snug font-bengali">
                {s.name}
              </span>
              <span className="text-[11px] font-semibold text-[#24483B] mt-2 font-bengali">
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
            <h2 className="text-lg md:text-xl font-serif font-bold text-[#252A27] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#24483B]" />
              সম্প্রতি সংযোজিত মৌলিক প্রশ্নসমূহ (Authentic Questions)
            </h2>
            <p className="text-xs text-[#737A73] mt-0.5 font-bengali">
              বিগত বিসিএস ও ব্যাংকের প্রশ্নপত্র থেকে বিস্তারিত ব্যাখ্যাসহ তাৎক্ষণিক অনুশীলন
            </p>
          </div>
          <Link
            href="/question-bank"
            className="text-xs font-semibold text-[#24483B] hover:underline flex items-center gap-1 font-bengali"
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
        <div className="bg-white border border-[#E7E3D9] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#252A27] flex items-center gap-2 font-bengali">
              <FileText className="w-5 h-5 text-[#24483B]" />
              হাই-ইল্ড পাঠ্য নোট ও সংবিধান বিশ্লেষণ
            </h3>
            <Link href="/study-resources" className="text-xs font-semibold text-[#24483B] hover:underline font-bengali">
              সকল নোট
            </Link>
          </div>
          <div className="space-y-3">
            {studyResources.map((r) => (
              <Link
                key={r.id}
                href={`/study-resources?id=${r.id}`}
                className="block p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E7E3D9] hover:border-[#24483B]/40 hover:bg-[#F5F2E9] transition-all"
              >
                <div className="text-[11px] font-semibold text-[#24483B] uppercase tracking-wide font-bengali">
                  {r.subject_name_bn || "সাধারণ বিষয়"} • {r.resource_type}
                </div>
                <h4 className="text-sm font-serif font-semibold text-[#252A27] mt-1 line-clamp-1 font-bengali">
                  {r.title_bn || r.title}
                </h4>
                <p className="text-xs text-[#737A73] mt-1 line-clamp-2 font-bengali">
                  {r.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Current Affairs */}
        <div className="bg-white border border-[#E7E3D9] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#252A27] flex items-center gap-2 font-bengali">
              <Newspaper className="w-5 h-5 text-[#B69A70]" />
              পরীক্ষা উপযোগী সাম্প্রতিক সমাচার (Current Affairs)
            </h3>
            <Link href="/current-affairs" className="text-xs font-semibold text-[#B69A70] hover:underline font-bengali">
              সব খবর
            </Link>
          </div>
          <div className="space-y-3">
            {currentAffairs.map((ca) => (
              <Link
                key={ca.id}
                href={`/current-affairs?id=${ca.id}`}
                className="block p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E7E3D9] hover:border-[#B69A70]/40 hover:bg-[#F5F2E9] transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#B69A70] font-bengali">
                  <span>{ca.category}</span>
                  <span className="text-[#737A73]">{ca.source_name}</span>
                </div>
                <h4 className="text-sm font-serif font-semibold text-[#252A27] mt-1 line-clamp-1 font-bengali">
                  {ca.title_bn || ca.title}
                </h4>
                <p className="text-xs text-[#737A73] mt-1 line-clamp-2 font-bengali">
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
