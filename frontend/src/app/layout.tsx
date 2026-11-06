import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "PROSTUTI (প্রস্তুতি) - Prepare. Practice. Prevail.",
  description:
    "Bangladesh's All-in-One Competitive Job Preparation & Examination Platform (BCS, Bank Recruitment, Government Jobs, Teaching Recruitment). Authentic question bank, realistic mock exams, and AI-powered probable questions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F6F4ED] text-[#252A27] min-h-screen antialiased selection:bg-[#24483B]/15 selection:text-[#24483B]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
