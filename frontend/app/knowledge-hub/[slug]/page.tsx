import Image from "next/image";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";
import ArticleContent from "@/components/knowledge/ArticleContent";
import Link from "next/link";

const ARTICLE = {
  title: "Securing Your First Round of Funding",
  description:
    "A practical guide to preparing your pitch and approaching investors in Ethiopia.",
  image: "/images/funding.jpg",
  category: "Funding",
  author: "Sara Mengistu",
  readTime: "12 min read",
  date: "Jan 20, 2024",
};

export default function ArticleDetailPage() {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white">

      {/* HERO */}
      <div className="relative h-[420px]">
        <Image
          src={ARTICLE.image}
          alt={ARTICLE.title}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0b1220]" />

        {/* Top Bar */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-sm text-gray-300">
          <Link href="/knowledge-hub" className="flex items-center gap-2 hover:text-white">
            <ArrowLeft size={16} /> Back to Articles
          </Link>
          <span className="flex items-center gap-2 text-cyan-400 font-medium">
            📘 Knowledge Hub
          </span>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 max-w-4xl w-full px-6">
          <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full mb-4">
            {ARTICLE.category}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {ARTICLE.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mt-4">
            <span className="flex items-center gap-1">
              <User size={14} /> {ARTICLE.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {ARTICLE.readTime}
            </span>
            <span>{ARTICLE.date}</span>
          </div>

          <p className="text-gray-300 mt-4 max-w-2xl">
            {ARTICLE.description}
          </p>

          <button className="mt-6 inline-flex items-center gap-2 bg-[#0f1b33] px-4 py-2 rounded-lg border border-white/10 hover:border-cyan-400/40 transition">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <ArticleContent />
    </div>
  );
}
