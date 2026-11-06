"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Calculator,
  BookOpen,
  FileText,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  User,
  Copy,
  Check
} from "lucide-react";
import { chatProstutiAI } from "@/lib/api";
import { AIChatMessage } from "@/lib/types";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: "assistant",
      content:
        "স্বাগতম! আমি **প্রস্তুতি এআই (Prostuti AI)**—বিসিএস, বাংলাদেশ ব্যাংক এবং সরকারি চাকরি পরীক্ষার আপনার ব্যক্তিগত স্টাডি মেন্টর।\n\nআপনি যেকোনো জটিল বিষয় সহজ বাংলায় বুঝতে পারেন, বিগত প্রিলিমিনারির বিভ্রান্তিকর অপশন বিশ্লেষণ করতে পারেন, গাণিতিক সমস্যার প্রতিটি ধাপ শিখতে পারেন, কিংবা বিসিএস লিখিত পরীক্ষার মডেল উত্তর তৈরি করতে পারেন।\n\nআপনি কীভাবে শুরু করতে চান?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "বাংলাদেশের সংবিধানের মৌলিক অধিকার ও অনুচ্ছেদ ১০২ এর রিট বিশ্লেষণ করুন",
    "শতকরা ও লাভ-ক্ষতির অংক দ্রুত সমাধানের শর্টকাট সূত্র দেখান",
    "Appropriate Preposition: 'concur with' বনাম 'concur in' এর পার্থক্য কী?",
    "৪৭তম বিসিএস লিখিত পরীক্ষার জন্য 'কৃত্রিম বুদ্ধিমত্তা ও সুশাসন' শীর্ষক মডেল প্রশ্ন ও রূপরেখা দিন",
  ]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const newMessages: AIChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await chatProstutiAI({
        messages: newMessages,
        context_type: "GENERAL",
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);

      if (response.suggested_followups && response.suggested_followups.length > 0) {
        setSuggestedPrompts(response.suggested_followups);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "দুঃখিত, উত্তর তৈরিতে সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন। (" +
            e.message +
            ")",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto pb-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Prostuti AI — স্টাডি অ্যাসিস্ট্যান্ট
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active Mentor
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              বিসিএস, ব্যাংক ও সরকারি চাকরি প্রস্তুতির জন্য সার্বক্ষণিক একাডেমিক সহায়তা
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content:
                  "নতুন আলোচনা শুরু হয়েছে। আপনার প্রশ্ন বা সমস্যার বিবরণ লিখুন।",
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>নতুন চ্যাট</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-3xl p-4 md:p-5 text-sm leading-relaxed shadow-md relative group ${
                  isUser
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-[#0E1626] border border-slate-800 text-slate-200 rounded-tl-sm"
                }`}
              >
                <div className="whitespace-pre-line prose prose-invert max-w-none text-xs md:text-sm">
                  {m.content}
                </div>

                {!isUser && (
                  <button
                    onClick={() => handleCopy(m.content, idx)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all text-xs"
                    title="কপি করুন"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-600 text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl bg-[#0E1626] border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>প্রস্তুতি এআই বিশ্লেষণ করছে এবং উত্তর প্রস্তুত করছে...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Followups */}
      {suggestedPrompts.length > 0 && !isLoading && (
        <div className="py-2 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> প্রস্তাবিত প্রশ্ন:
          </span>
          {suggestedPrompts.slice(0, 3).map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 text-slate-300 hover:text-white text-xs whitespace-nowrap transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="pt-2"
      >
        <div className="relative flex items-center bg-[#0E1626] border border-slate-800 rounded-2xl p-1.5 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 shadow-xl transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="আপনার প্রশ্ন, গাণিতিক সমস্যা বা ব্যাখ্যার অনুরোধ লিখুন (Enter চাপুন)..."
            rows={1}
            className="w-full pl-4 pr-12 py-2.5 bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none resize-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white disabled:opacity-40 shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
