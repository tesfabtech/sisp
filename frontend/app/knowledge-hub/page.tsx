"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import ArticleCard, { Article } from "@/components/knowledge/ArticleCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "How to Build a Successful Startup in Sidama",
    description: "Learn key strategies and local insights for launching your venture.",
    image: "/images/startup.jpg",
    author: "Dr. Abebe Tessema",
    readTime: "8 min read",
    category: "Entrepreneurship",
    tagColor: "bg-green-400/20 text-green-400",
  },
  {
    id: 2,
    title: "Securing Your First Round of Funding",
    description: "Preparing your pitch and approaching investors in Ethiopia.",
    image: "/images/funding.jpg",
    author: "Sara Mengistu",
    readTime: "12 min read",
    category: "Funding",
    tagColor: "bg-yellow-400/20 text-yellow-400",
  },
  {
    id: 3,
    title: "The Rise of AgriTech in Sidama",
    description: "How technology is transforming agriculture and new opportunities.",
    image: "/images/agritech.jpg",
    author: "Yonas Bekele",
    readTime: "6 min read",
    category: "Industry Insights",
    tagColor: "bg-pink-400/20 text-pink-400",
  },
  {
    id: 4,
    title: "Digital Marketing Strategies for Ethiopian Startups",
    description: "Master digital marketing techniques tailored for Ethiopia.",
    image: "/images/marketing.jpg",
    author: "Meron Haile",
    readTime: "10 min read",
    category: "Business",
    tagColor: "bg-purple-400/20 text-purple-400",
  },
  {
    id: 5,
    title: "AI and Machine Learning Opportunities in East Africa",
    description: "How AI creates new opportunities for tech entrepreneurs.",
    image: "/images/ai.jpg",
    author: "Dawit Tesfaye",
    readTime: "7 min read",
    category: "Technology",
    tagColor: "bg-blue-400/20 text-blue-400",
  },
  {
    id: 6,
    title: "Building a Strong Company Culture from Day One",
    description: "Tips for creating a productive and positive work environment.",
    image: "/images/team.jpg",
    author: "Helen Tadesse",
    readTime: "5 min read",
    category: "Business",
    tagColor: "bg-purple-400/20 text-purple-400",
  },
];

export default function KnowledgeHubPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(ARTICLES.map((a) => a.category))];

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        category === "All" || a.category === category;

      return matchSearch && matchCategory;
    });
  }, [search, category]);

  const featured = filtered.slice(0, 3);
  const others = filtered.slice(3);

  return (
    <>
      {/* ✅ HEADER */}
      <Header />

      <main className="min-h-screen bg-[#0b1220] text-white">

        {/* HERO */}
        <section className="text-center py-16 px-4">
          <span className="bg-cyan-400/10 text-cyan-400 px-4 py-1 rounded-full text-sm">
            Knowledge Hub
          </span>

          <h1 className="text-5xl font-bold mt-6">Learn & Grow</h1>

          <p className="text-gray-400 mt-4">
            Expert insights, guides, and resources to help innovators succeed.
          </p>

          {/* Search + Filter */}
          <div className="max-w-3xl mx-auto mt-8 flex gap-3">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0f1b33] border border-white/10 rounded-xl pl-10 py-3 focus:border-cyan-400 outline-none"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#0f1b33] border border-white/10 rounded-xl px-4 text-sm"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </section>

        {/* FEATURED */}
        <section className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-semibold mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((a) => (
              <ArticleCard key={a.id} data={a} />
            ))}
          </div>
        </section>

        {/* ALL ARTICLES */}
        {others.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mt-14 pb-20">
            <h2 className="text-xl font-semibold mb-6">All Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {others.map((a) => (
                <ArticleCard key={a.id} data={a} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ✅ FOOTER */}
      <Footer />
    </>
  );
}
