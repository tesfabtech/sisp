'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import axios from '@/lib/axios-public';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  User,
} from 'lucide-react';

interface Startup {
  id: number;
  name: string;
  tagline?: string | null;
  logo: string | null;
  cover_image: string | null;
  industry: string | null;
  stage: string | null;
  featured: boolean;
  user: {
    first_name: string;
    last_name: string;
  };
}

export default function StartupCarousel() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const cardWidth = 330;
  const cardHeight = 520; // ✅ enforce equal height
  const gap = 32;
  const visibleCards = 3;

  useEffect(() => {
    axios
      .get('/startups', { params: { featured: 1 } })
      .then((res) => setStartups(res.data.data ?? res.data))
      .catch((err) =>
        console.error('Failed to fetch featured startups', err),
      )
      .finally(() => setLoading(false));
  }, []);

  const maxIndex = Math.max(startups.length - visibleCards, 0);

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  if (loading || startups.length === 0) return null;

  return (
    <section className="relative py-28 bg-gray-100 dark:bg-[#0B1220] overflow-hidden">
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <Badge className="mb-5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            ⭐ Featured Startups
          </Badge>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Discover Verified{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Innovators
            </span>
          </h2>

          <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hand-picked startups making real impact in the ecosystem
          </p>
        </div>

        {/* CAROUSEL */}
        <div className="relative">
          {/* Buttons */}
          <button
            onClick={prev}
            disabled={index === 0}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow hover:scale-105 transition disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={next}
            disabled={index === maxIndex}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow hover:scale-105 transition disabled:opacity-40"
          >
            <ChevronRight />
          </button>

          {/* Viewport */}
          <div className="overflow-visible">
            <motion.div
              animate={{ x: -(index * (cardWidth + gap)) }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex gap-8"
            >
              {startups.map((startup) => (
                <motion.div
                              key={startup.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 }}
                              className="group"
                            >
                  <Card
                    style={{ height: cardHeight }}
                    className="w-82.5 shrink-0 rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-lg group-hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                  >
                    {/* Cover */}
                    <div className="relative h-48 w-full overflow-hidden">
                      {startup.cover_image && (
                        <Image
                          src={`${API_URL}/storage/${startup.cover_image}`}
                          alt={startup.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {startup.industry && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#14B8A6] text-white shadow">
                            {startup.industry}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div className="flex flex-col gap-4">
                        {/* Logo + Name */}
                        <div className="flex items-center gap-3">
                          {startup.logo && (
                            <Image
                              src={`${API_URL}/storage/${startup.logo}`}
                              alt={startup.name}
                              width={42}
                              height={42}
                              className="rounded-md object-contain border"
                              unoptimized
                            />
                          )}

                          <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors  group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {startup.name}
                          </h3>
                        </div>

                        {/* Tagline (clamped) */}
                        {startup.tagline && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                            {startup.tagline}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                          {startup.stage && (
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-gray-400" />
                              <span>{startup.stage}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>
                              {startup.user.first_name}{' '}
                              {startup.user.last_name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                    
<div className="pt-4 flex justify-center">
  {startup.id && (
  <Link
    href={`/startups/detail/${startup.id}`}
    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group/cta cursor-pointer"
  >
    View Details
    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/cta:translate-x-2" />
  </Link>
)}

</div>

                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
        </div>

 {/* VIEW ALL */}
<div className="mt-14 text-center">
  <Link
    href="/startups"
    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all cursor-pointer"
  >
    View All Startups
    <ArrowRight className="w-5 h-5" />
  </Link>
</div>


      </div>
    </section>
  );
}
