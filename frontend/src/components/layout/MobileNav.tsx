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
  X
} from "lucide-react";
import { Logo } from "./Logo";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Home", name_bn: "হোম", href: "/", icon: Home },
  { name: "Question Bank", name_bn: "প্রশ্নব্যাংক", href: "/question-bank", icon: Database },
  { name: "Exam Hall", name_bn: "পরীক্ষা হল", href: "/exam-hall", icon: GraduationCap },
  { name: "Study Resources", name_bn: "পড়াশোনা ও নোট", href: "/study-resources", icon: BookOpen },
  { name: "Probable Questions", name_bn: "সম্ভাব্য প্রশ্ন", href: "/probable-questions", icon: Sparkles },
  { name: "Current Affairs", name_bn: "সাম্প্রতিক সমাচার", href: "/current-affairs", icon: Newspaper },
  { name: "Prostuti AI", name_bn: "এআই মেন্টর", href: "/ai-assistant", icon: Bot },
  { name: "My Collections", name_bn: "আমার সংগ্রহ", href: "/my-collections", icon: BookmarkCheck },
  { name: "Admin Console", name_bn: "এডমিন প্যানেল", href: "/admin", icon: ShieldAlert },
];

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-full bg-[#FAF8F3] border-r border-[#E7E3D9] p-5 flex flex-col shadow-xl z-10 animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E3D9]">
          <Logo />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#737A73] hover:text-[#252A27] hover:bg-[#EFECE3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#24483B] text-white shadow-xs"
                    : "text-[#252A27] hover:bg-[#EFECE3]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#737A73]"}`} />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className={`text-xs ${isActive ? "text-white/80" : "text-[#737A73]"}`}>
                    {item.name_bn}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#E7E3D9] text-center text-xs text-[#737A73]">
          PROSTUTI (প্রস্তুতি) • Warm Academic Edition
        </div>
      </div>
    </div>
  );
};
