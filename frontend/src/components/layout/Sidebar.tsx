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
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#FAF8F3] border-r border-[#E7E3D9] z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E7E3D9]">
        <Logo />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#737A73]">
          মূল মেনু (Navigation)
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
                  ? "bg-[#24483B] text-white shadow-sm"
                  : "text-[#252A27] hover:text-[#24483B] hover:bg-[#EFECE3] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-[#737A73] group-hover:text-[#24483B] group-hover:bg-[#E7E3D9]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="leading-tight font-medium">{item.name}</span>
                  <span
                    className={`text-[11px] font-normal ${
                      isActive ? "text-white/80" : "text-[#737A73]"
                    }`}
                  >
                    {item.name_bn}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#EAE6DB] text-[#24483B] border border-[#D5CFC1]"
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.highlight && (
                <span className="flex h-2 w-2 relative">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B69A70]"></span>
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Administration Link */}
      <div className="p-3 border-t border-[#E7E3D9] bg-[#F4F1E8]">
        <Link
          href="/admin"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
            pathname.startsWith("/admin")
              ? "bg-[#24483B] text-white shadow-sm"
              : "text-[#252A27] hover:bg-[#EAE6DB] border border-transparent"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#B69A70]" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Admin Console</span>
              <span
                className={`text-[10px] ${
                  pathname.startsWith("/admin") ? "text-white/80" : "text-[#737A73]"
                }`}
              >
                প্রশ্ন ও তথ্য ব্যবস্থাপনা
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#737A73]" />
        </Link>
      </div>
    </aside>
  );
};
