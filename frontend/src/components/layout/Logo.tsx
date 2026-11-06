import React from "react";
import Link from "next/link";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ collapsed = false, className = "" }) => {
  return (
    <Link href="/" className={`flex items-center gap-3 group transition-all ${className}`}>
      {/* Icon emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 shadow-lg shadow-indigo-500/25 border border-indigo-400/30 group-hover:scale-105 transition-transform">
        {/* Stylized Mortarboard / Book Emblem */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
          <path d="m14 14 3 3 5-5" />
        </svg>
        {/* Beacon dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#080C14] animate-pulse" />
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
              PROSTUTI
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
              প্রস্তুতি
            </span>
          </div>
          <span className="text-[10px] tracking-wider uppercase font-medium text-slate-400">
            Prepare. Practice. Prevail.
          </span>
        </div>
      )}
    </Link>
  );
};
