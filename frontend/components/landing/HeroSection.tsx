'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gray-100 dark:bg-[#0B1220]"
    >
      {/* GRID / NET BACKGROUND */}
<div
  className="pointer-events-none absolute inset-0 opacity-40"
  style={{
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  }}
/>

{/* DARK MODE GRID */}
<div
  className="pointer-events-none absolute inset-0 opacity-40 hidden dark:block"
  style={{
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  }}
/>


      {/* SOFT GRADIENT GLOWS */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-125 h-125 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 mb-6">
              <Rocket className="h-4 w-4" />
              Innovation Ecosystem Platform
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
              <span className="bg-linear-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                Empowering
              </span>{' '}
              Sidama&apos;s
              <br />
              Innovation Ecosystem
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              A centralized platform connecting startups, innovators, mentors,
              investors, challenges, funding opportunities, and knowledge
              resources across Sidama.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register/role">
                <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer">
                  Register Now
                </Button>
              </Link>

             <Link href="/opportunities">
              <Button
                variant="outline"
                className="h-12 px-6 dark:border-gray-700 cursor-pointer"
              >
                Explore Opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-12">
              <Stat value="50+" label="Verified Startups" />
              <Stat value="30+" label="Active Challenges" />
              <Stat value="$2M+" label="In Funding" />
            </div>
          </motion.div>

          {/* RIGHT IMAGE + FLOATING CARDS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/hero.png"
                alt="Innovation team"
                width={700}
                height={520}
                className="object-cover"
                priority
              />
            </div>

            {/* Floating Card: Startups */}
            <div className="absolute -left-10 top-20 rounded-xl bg-white dark:bg-[#111827] shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Startups
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Innovation Hub
                </p>
              </div>
            </div>

            {/* Floating Card: Funding */}
            <div className="absolute -right-7.5 bottom-16 rounded-xl bg-white dark:bg-[#111827] shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Funding
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Growth Capital
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* Stat Component */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
  );
}
