'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const startups = [
  {
    id: 1,
    name: 'AgroTech Solutions',
    category: 'Agriculture',
    description: 'Innovative agricultural technology platform connecting farmers with modern farming solutions.',
    image: '/images/startups/agro.jpg',
  },
  {
    id: 2,
    name: 'EduConnect',
    category: 'Education Technology',
    description: 'Digital learning platform providing quality education to remote communities across the region.',
    image: '/images/startups/edu.jpg',
  },
  {
    id: 3,
    name: 'HealthHub',
    category: 'Healthcare',
    description: 'Telemedicine platform bringing healthcare services to underserved areas.',
    image: '/images/startups/health.jpg',
  },
  {
    id: 4,
    name: 'GreenEnergy Co',
    category: 'Clean Energy',
    description: 'Renewable energy solutions for sustainable urban and rural communities.',
    image: '/images/startups/energy.jpg',
  },
  {
    id: 5,
    name: 'FinLink',
    category: 'FinTech',
    description: 'Smart digital financial services for growing communities.',
    image: '/images/startups/fintech.jpg',
  },
];

export default function StartupCarousel() {
  const [index, setIndex] = useState(0);

  const cardWidth = 330;
  const gap = 32;
  const visibleCards = 3;

  const maxIndex = startups.length - visibleCards;

  const next = () => {
    setIndex((i) => Math.min(i + 1, maxIndex));
  };

  const prev = () => {
    setIndex((i) => Math.max(i - 1, 0));
  };

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
            Discover Verified <span className="text-blue-600 dark:text-blue-400">Innovators</span>
          </h2>

          <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore startups that are driving innovation and creating impact across Sidama&apos;s ecosystem
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
          <div className="overflow-hidden">

            {/* Track */}
            <motion.div
              animate={{ x: -(index * (cardWidth + gap)) }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex gap-8"
            >
              {startups.map((startup) => (
                <Card
                  key={startup.id}
                  className="w-82.5 shrink-0 rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-47.5">
                    <Image
                      src={startup.image}
                      alt={startup.name}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-green-500/90 text-white shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {startup.name}
                    </h3>

                    <Badge className="mt-3 mb-4 bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                      {startup.category}
                    </Badge>

                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {startup.description}
                    </p>

                    <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>

          {/* Fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white dark:from-[#0B1220] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white dark:from-[#0B1220] to-transparent" />

        </div>
         {/* VIEW ALL */}
        <div className="mt-14 text-center">
          <button className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all">
            View All Startups
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
