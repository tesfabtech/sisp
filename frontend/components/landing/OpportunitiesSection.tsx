'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Trophy,
  Calendar,
  Wallet,
  ArrowRight,
  MapPin,
  Users,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

type Challenge = {
  id: number;
  title: string;
  date: string;
  summary: string;
  prize: string;
};

type Event = {
  id: number;
  title: string;
  date: string;
  summary: string;
  location: string;
};

type Funding = {
  id: number;
  title: string;
  date: string;
  summary: string;
  amount: string;
  type: string;
};

type OpportunityMap = {
  challenges: Challenge[];
  events: Event[];
  funding: Funding[];
};

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const opportunities: OpportunityMap = {
  challenges: [
    {
      id: 1,
      title: 'Agricultural Innovation Challenge 2024',
      date: 'Dec 31, 2024',
      summary:
        'Design innovative solutions to increase agricultural productivity and sustainability in Sidama region. Win funding and mentorship to bring your ideas to life.',
      prize: '$50,000',
    },
    {
      id: 2,
      title: 'EdTech Hackathon',
      date: 'Nov 15, 2024',
      summary:
        '48-hour hackathon to build educational technology solutions for remote learning. Teams compete for prizes and investment opportunities.',
      prize: '$25,000',
    },
    {
      id: 3,
      title: 'Climate Action Pitch Competition',
      date: 'Oct 30, 2024',
      summary:
        'Pitch your climate-focused startup to investors and win seed funding. Focus on renewable energy, waste management and conservation.',
      prize: '$75,000',
    },
  ],
  events: [
    {
      id: 1,
      title: 'SISP Annual Innovation Summit',
      date: 'Jan 10–12, 2025',
      summary:
        'Networking, workshops, and talks from industry leaders.',
      location: 'Hawassa Convention Center',
    },
    {
      id: 2,
      title: 'Startup Pitch Night',
      date: 'Dec 28, 2024',
      summary:
        'Top startups pitch to investors and ecosystem partners.',
      location: 'SISP Innovation Hub',
    },
  ],
  funding: [
    {
      id: 1,
      title: 'Sidama Seed Fund – Cohort 5',
      date: 'Applications close Jan 31',
      summary:
        'Early-stage capital for scalable startups.',
      amount: 'Up to $50,000',
      type: 'Equity',
    },
    {
      id: 2,
      title: 'Green Innovation Grant',
      date: 'Rolling applications',
      summary:
        'Non-dilutive funding for climate-focused startups.',
      amount: 'Up to $30,000',
      type: 'Grant',
    },
  ],
};

const tabIcons = {
  challenges: Trophy,
  events: Calendar,
  funding: Wallet,
} as const;

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

export default function OpportunitiesSection() {
  const [activeTab, setActiveTab] =
    React.useState<keyof OpportunityMap>('challenges');

  return (
    <section className="relative py-32 overflow-hidden bg-gray-100 dark:bg-[#0B1220]">
      {/* Dark glow */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <Badge className="mb-5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            ✨ Opportunities
          </Badge>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Explore{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Growth Opportunities
            </span>
          </h2>

          <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access challenges, events, and funding opportunities designed to accelerate innovation
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-16">
          <Tabs
            value={activeTab}
            onValueChange={(val) =>
              setActiveTab(val as keyof OpportunityMap)
            }
          >
            <TabsList className="rounded-full p-1.5 bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/10">
              {(Object.keys(opportunities) as Array<
                keyof OpportunityMap
              >).map((tab) => {
                const Icon = tabIcons[tab];
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="capitalize flex items-center gap-2 px-6 py-2.5 rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-[#0F172A]"
                  >
                    <Icon className="w-4 h-4" />
                    {tab}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* CARDS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {opportunities[activeTab].map((item) => {
              const isChallenge = 'prize' in item;
              const isEvent = 'location' in item;
              const isFunding = 'amount' in item;

              return (
                <Card
                  key={item.id}
                  className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0F172A] border border-black/5 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all"
                >
                  {/* Top gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-700 to-blue-400" />

                  <div className="p-8">              

                    {/* Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
                        {isChallenge && <Trophy className="w-6 h-6 text-blue-700" />}
                        {isEvent && <Calendar className="w-6 h-6 text-blue-700" />}
                        {isFunding && <Wallet className="w-6 h-6 text-blue-700" />}
                      </div>

                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        {isChallenge && 'Challenge'}
                        {isEvent && 'Event'}
                        {isFunding && 'Funding'}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div>📅 {item.date}</div>

                      {isChallenge && <div>🏆 Prize: {item.prize}</div>}
                      {isEvent && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> {item.location}
                        </div>
                      )}
                      {isFunding && (
                        <div>
                          💰 {item.amount} • {item.type}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center text-blue-600 dark:text-blue-400 font-medium text-sm group cursor-pointer">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>

                  </div>
                </Card>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      
    </section>
  );
}
