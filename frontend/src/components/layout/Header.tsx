"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, GraduationCap, Menu } from "lucide-react";
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
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 lg:px-8 bg-[#F6F4ED]/95 backdrop-blur-md border-b border-[#E7E3D9]">
      {/* Mobile view Logo & Hamburger */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onToggleMobileNav}
          aria-label="Toggle Navigation"
          className="p-2 rounded-lg text-[#252A27] hover:bg-[#EFECE3] focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Logo collapsed={true} />
      </div>

      {/* Global Quick Search Bar */}
      <div className="flex-1 max-w-xl mx-2 lg:mx-0">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737A73]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বিগত বিসিএস ও ব্যাংকের প্রশ্ন, টপিক বা অনুচ্ছেদ খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white text-[#252A27] placeholder-[#737A73] rounded-xl border border-[#E7E3D9] focus:border-[#24483B] focus:ring-1 focus:ring-[#24483B]/20 outline-none transition-all shadow-xs"
          />
        </form>
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-3">
        {/* Exam Focus Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EFECE3] border border-[#E7E3D9] text-xs text-[#252A27]">
          <span className="w-2 h-2 rounded-full bg-[#24483B]"></span>
          <span className="font-semibold text-[#24483B]">লক্ষ্য:</span>
          <span>৪৭তম বিসিএস ও ব্যাংক এডি</span>
        </div>

        {/* Quick Mock Exam Trigger */}
        <Link
          href="/exam-hall"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#24483B] hover:bg-[#1B362C] text-white text-xs font-semibold shadow-xs transition-all active:scale-98"
        >
          <GraduationCap className="w-4 h-4 text-[#FAF8F5]" />
          <span className="hidden md:inline">মক পরীক্ষা দিন</span>
          <span className="md:hidden">পরীক্ষা</span>
        </Link>
      </div>
    </header>
  );
};
