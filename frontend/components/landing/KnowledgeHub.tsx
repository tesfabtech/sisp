'use client';

import * as React from 'react';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


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

export default function KnowledgeHub() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    axios
      .get('/knowledge-hub/featured')
      .then(res => setArticles(res.data))
      .catch(err => console.error('KnowledgeHub error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="knowledge"
      className="py-32 bg-linear-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <Badge className="mb-6 px-4 py-1.5 font-semibold bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-700/50">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Knowledge Hub
            </Badge>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Learn & Grow
            </h2>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Expert insights, guides, and resources to help innovators succeed.
            </p>
          </div>

          <Link href="/knowledge">
  <Button
    variant="outline"
    className="mt-6 md:mt-0 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer"
  >
    View All Articles
    <ArrowRight className="w-4 h-4 ml-2" />
  </Button>
</Link>

        </motion.div>

        {/* CARDS */}
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading featured articles...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
