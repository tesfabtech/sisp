'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import axios from '@/lib/axios';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ArrowRight, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

/* ======================
   TYPES
====================== */
type Article = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string | null;
  image: string;
  slug: string;
};

/* ======================
   CONSTANTS
====================== */
const CATEGORIES = [
  'all',
  'startup',
  'funding',
  'marketing',
  'product',
  'technology',
  'legal',
  'finance',
  'operations',
  'leadership',
  'design',
  'ai',
  'general',
];

/* ======================
   PAGE
====================== */
export default function KnowledgeIndexPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const isDesktop = useIsDesktop();
  const router = useRouter();

  /* FETCH */
  useEffect(() => {
    axios
      .get('/knowledge-hub')
      .then(res =>
        setArticles(
          res.data.map((a: Article) => ({
            ...a,
            category: a.category?.toLowerCase().trim() ?? 'general',
          }))
        )
      )
      .finally(() => setLoading(false));
  }, []);

  /* FILTER */
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch =
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'all' || article.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [articles, search, category]);

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative py-28 bg-[#0B1220] text-center overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -left-40 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 w-125 h-125 bg-cyan-500/10 rounded-full blur-3xl" />

      {/* BACK BUTTON */}
  <button
    onClick={() => router.back()}
    className="absolute top-2 left-6 z-10 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
  >
    ← Back
  </button>


        <div className="relative max-w-4xl mx-auto px-6">
          <Badge className="mb-5 px-4 py-2 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            📚 Knowledge Hub
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Explore{' '}
            <span className="bg-linear-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              All Articles
            </span>
          </h1>

          <p className="mt-5 text-lg text-gray-400">
            Practical insights, guides, and expert knowledge for founders and
            builders.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="bg-[#0B1220] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex gap-4 flex-wrap items-center">
          {/* SEARCH */}
          <Input
  placeholder="Search articles..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="
    bg-[#0F172A] border-white/10 text-white
    w-full sm:w-64 lg:w-72
    flex-none
  "
/>


          {/* CATEGORY BUTTONS (DESKTOP) */}
          {isDesktop && (
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(item => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition
                    ${
                      category === item
                        ? 'bg-blue-500 text-white'
                        : 'bg-[#0F172A] text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {item === 'all' ? 'All' : item.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* CATEGORY DROPDOWN (MOBILE) */}
          {!isDesktop && (
            <div className="w-full sm:w-56">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-[#0F172A] border-white/10 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(item => (
                    <SelectItem key={item} value={item}>
                      {item === 'all' ? 'All Categories' : item.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </section>

      {/* GRID */}
      <section className="bg-[#0B1220] py-16">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <KnowledgeSkeleton />
          ) : (
            filteredArticles.map((article, index) => (
              <motion.div
  key={article.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
  <Card className="h-full overflow-hidden bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2">
    {/* IMAGE */}
    <div className="relative overflow-hidden">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
      />

      <div className="absolute top-4 left-4">
        <Badge className="bg-white/90 dark:bg-gray-900/90 text-white">
          {article.category}
        </Badge>
      </div>
    </div>

    {/* CONTENT */}
    <div className="p-6">
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {article.author}
        </span>

        {article.readTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
        {article.title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {article.excerpt}
      </p>

      <div
        className="mt-6 flex items-center text-blue-600 font-medium text-sm group cursor-pointer"
        onClick={() => router.push(`/knowledge/${article.slug}`)}
      >
        Read More
        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </Card>
</motion.div>

            ))
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ======================
   SKELETON
====================== */
function KnowledgeSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-white/10 bg-[#0F172A] animate-pulse"
        >
          <div className="h-48 bg-white/10" />
          <div className="p-6 space-y-4">
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/10 rounded" />
            <div className="h-4 w-5/6 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

/* ======================
   DESKTOP DETECTOR
====================== */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
}
