"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

// -------------------- TYPES --------------------
type Article = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string | null;
  image: string;
  slug: string;
  featured?: boolean;
};

// -------------------- COMPONENTS --------------------
function ArticleCard({ item }: { item: Article }) {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition">
      <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
      <div className="p-4">
        <span className="text-xs px-2 py-1 rounded-full bg-teal-600/20 text-teal-400">
          {item.category}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
        <p className="mt-2 text-sm text-slate-400">
          {item.author}
          {item.readTime ? ` · ${item.readTime}` : ""}
        </p>
        <p className="mt-2 text-sm text-slate-500 line-clamp-2">
          {item.excerpt}
        </p>
        <a
          href={`/knowledge-hub/${item.slug}`}
          className="inline-block mt-4 text-sm text-teal-400 hover:underline"
        >
          Read More →
        </a>
      </div>
    </div>
  );
}

// -------------------- PAGE --------------------
export default function KnowledgeHubPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  // FETCH FROM BACKEND API
  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/knowledge-hub/articles", {
          cache: "no-store",
        });
        const data: Article[] = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Failed to load articles", err);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(articles.map(a => a.category))),
    ];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch =
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.author.toLowerCase().includes(search.toLowerCase()) ||
        article.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, search, selectedCategory]);

  const featuredArticles = filteredArticles.filter(a => a.featured);
  const normalArticles = filteredArticles.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block mb-3 px-4 py-1 rounded-full bg-teal-600/20 text-teal-400 text-sm">
            Knowledge Hub
          </span>
          <h1 className="text-4xl font-bold">Learn & Grow</h1>
          <p className="mt-3 text-slate-400">
            Expert insights, guides, and resources to help innovators succeed.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-10 relative">
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl w-full">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(v => !v)}
              className="flex items-center justify-between gap-2 bg-slate-800 px-4 py-2 rounded-xl text-sm min-w-40"
            >
              <span>{selectedCategory}</span>
              <ChevronDown size={16} />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-lg z-10">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 ${
                      selectedCategory === cat
                        ? "text-teal-400"
                        : "text-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-slate-400">Loading articles...</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Featured Articles</h2>
            {featuredArticles.length === 0 ? (
              <p className="text-slate-400 mb-12">No featured articles.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {featuredArticles.map(item => (
                  <ArticleCard key={item.id} item={item} />
                ))}
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">All Articles</h2>
            {normalArticles.length === 0 ? (
              <p className="text-slate-400">No articles found.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {normalArticles.map(item => (
                  <ArticleCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
