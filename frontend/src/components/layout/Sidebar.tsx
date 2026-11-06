"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Database,
  GraduationCap,
  BookOpen,
  Sparkles,
  Newspaper,
  Bot,
  BookmarkCheck,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { Logo } from "./Logo";

const navItems = [
  {
    name: "Home",
    name_bn: "হোম",
    href: "/",
    icon: Home,
  },
  {
    name: "Question Bank",
    name_bn: "প্রশ্নব্যাংক",
    href: "/question-bank",
    icon: Database,
    badge: "10-45th BCS",
  },
  {
    name: "Exam Hall",
    name_bn: "পরীক্ষা হল",
    href: "/exam-hall",
    icon: GraduationCap,
    badge: "Live Mock",
  },
  {
    name: "Study Resources",
    name_bn: "পড়াশোনা ও নোট",
    href: "/study-resources",
    icon: BookOpen,
  },
  {
    name: "Probable Questions",
    name_bn: "সম্ভাব্য প্রশ্ন",
    href: "/probable-questions",
    icon: Sparkles,
    highlight: true,
  },
  {
    name: "Current Affairs",
    name_bn: "সাম্প্রতিক সমাচার",
    href: "/current-affairs",
    icon: Newspaper,
  },
  {
    name: "Prostuti AI",
    name_bn: "এআই মেন্টর",
    href: "/ai-assistant",
    icon: Bot,
    badge: "RAG",
  },
  {
    name: "My Collections",
    name_bn: "আমার সংগ্রহ",
    href: "/my-collections",
    icon: BookmarkCheck,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0A101D] border-r border-slate-800/80 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/60">
        <Logo />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          মূল মেনু (Main Navigation)
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white border border-blue-500/40 shadow-sm shadow-blue-500/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 group-hover:text-blue-400 group-hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="leading-tight">{item.name}</span>
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-300 font-normal">
                    {item.name_bn}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-blue-300 border border-slate-700">
                  {item.badge}
                </span>
              )}

              {item.highlight && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Administration & System Status */}
      <div className="p-3 border-t border-slate-800/60 bg-[#080D18]">
        <Link
          href="/admin"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
            pathname.startsWith("/admin")
              ? "bg-amber-500/15 text-amber-200 border border-amber-500/40"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">Admin Console</span>
              <span className="text-[10px] text-slate-500">প্রশ্ন ব্যবস্থাপনা ও রিপোর্ট</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </Link>
      </div>
    </aside>
  );
};
