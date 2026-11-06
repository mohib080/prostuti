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
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#24483B] text-white shadow-sm border border-[#1B362C] group-hover:scale-102 transition-transform">
        {/* Stylized Mortarboard / Open Academic Book */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-[#FAF8F5]"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
          <path d="m14 14 3 3 5-5" />
        </svg>
        {/* Antique Gold beacon accent */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B69A70] rounded-full ring-2 ring-[#F6F4ED]" />
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight text-[#24483B] font-serif-heading">
              PROSTUTI
            </span>
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#879887]/20 text-[#24483B] border border-[#879887]/30">
              প্রস্তুতি
            </span>
          </div>
          <span className="text-[10px] tracking-wider uppercase font-medium text-[#737A73]">
            Prepare. Practice. Prevail.
          </span>
        </div>
      )}
    </Link>
  );
};
