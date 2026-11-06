"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, GraduationCap, Menu, X, Sparkles, BookOpen } from "lucide-react";
import { Logo } from "./Logo";

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/question-bank?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 lg:px-8 bg-[#090E1A]/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Mobile view Logo & Hamburger */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onToggleMobileNav}
          aria-label="Toggle Navigation"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Logo collapsed={true} />
      </div>

      {/* Global Quick Search Bar */}
      <div className="flex-1 max-w-xl mx-2 lg:mx-0">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বিগত বিসিএস ও ব্যাংকের প্রশ্ন, টপিক বা অনুচ্ছেদ খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900/90 text-slate-100 placeholder-slate-400 rounded-xl border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-inner"
          />
        </form>
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-3">
        {/* Exam Focus Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-medium text-slate-200">লক্ষ্য:</span>
          <span>৪৭তম বিসিএস ও ব্যাংক এডি</span>
        </div>

        {/* Quick Mock Exam Trigger */}
        <Link
          href="/exam-hall"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden md:inline">মক পরীক্ষা দিন</span>
          <span className="md:hidden">পরীক্ষা</span>
        </Link>
      </div>
    </header>
  );
};
