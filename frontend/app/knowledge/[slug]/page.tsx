'use client';

import * as React from 'react';
import axios from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

type Article = {
  title: string;
  short_description: string;
  description: string;
  type: string;
  image: string | null;
  max_read_time: number | null;
  created_at: string;
  author: string;
};

export default function KnowledgeDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [article, setArticle] = React.useState<Article | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axios
      .get(`/knowledge-hub/${slug}`)
      .then(res => setArticle(res.data))
      .catch(() => router.push('/404'))
      .finally(() => setLoading(false));
  }, [slug, router]);

  if (loading) {
    return (
      <>
        <Header />
        <KnowledgeDetailSkeleton />
        <Footer />
      </>
    );
  }

  if (!article) return null;

  return (
    <>
      <Header />

      <div className="bg-[#0B1220] min-h-screen text-white">
        {/* HERO */}
        <div className="relative h-96 overflow-hidden mb-20">
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/80" />

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#0B1220] to-transparent" />

          <div className="relative max-w-5xl mx-auto px-6 pt-10 mt-10">
            {/* Back */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-6 px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Category */}
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-semibol">
              {article.type.toUpperCase()}
            </span>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold max-w-3xl leading-tight py-5">
              {article.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-2 max-w-2xl text-gray-300">
              {article.short_description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-gray-300">
              <span>{article.author}</span>

              {article.max_read_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.max_read_time} min read
                </span>
              )}

              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {article.created_at}
              </span>

              <button className="flex items-center gap-1 hover:text-white">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative max-w-5xl mx-auto px-6 -mt-24 pb-28">
          <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-12 shadow-xl border border-white/5">
            <article
              className="prose prose-invert max-w-none
                prose-headings:font-bold
                prose-li:marker:text-blue-400
                prose-p:text-gray-300"
              dangerouslySetInnerHTML={{ __html: article.description }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* =======================
   Skeleton Loader
======================= */
function KnowledgeDetailSkeleton() {
  return (
    <div className="bg-[#0B1220] min-h-screen text-white animate-pulse">
      {/* HERO */}
      <div className="relative h-96 bg-gray-800 mb-20">
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/80" />

        <div className="relative max-w-5xl mx-auto px-6 pt-20">
          <div className="h-8 w-24 bg-gray-700 rounded-full mb-6" />
          <div className="h-6 w-32 bg-gray-700 rounded-full mb-4" />
          <div className="h-10 w-3/4 bg-gray-700 rounded mb-4" />
          <div className="h-10 w-2/3 bg-gray-700 rounded mb-6" />
          <div className="h-4 w-1/2 bg-gray-700 rounded" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative max-w-5xl mx-auto px-6 -mt-24 pb-28">
        <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-12 border border-white/5 space-y-4">
          <div className="h-4 w-full bg-gray-700 rounded" />
          <div className="h-4 w-11/12 bg-gray-700 rounded" />
          <div className="h-4 w-10/12 bg-gray-700 rounded" />
          <div className="h-4 w-9/12 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}
