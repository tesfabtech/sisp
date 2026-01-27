'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  ArrowRight,
  CalendarClock,
  Trophy,
  DollarSign,
  Calendar,
  Wallet,
  Users,
  MapPin,
} from 'lucide-react';

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

type Organization = {
  id: number;
  logo: string | null;
  user: {
    first_name: string;
    last_name: string;
  };
};

type Opportunity = {
  id: number;
  title: string;
  short_description: string;
  deadline?: string;
  event_datetime?: string;
  award?: string;
  amount?: string;
  funding_type?: string;
  participant_number?: number;
  location?: string;
  organization: Organization;
  type: 'challenges' | 'events' | 'funding';
};

type OpportunitiesMap = {
  all: Opportunity[];
  challenges: Opportunity[];
  events: Opportunity[];
  funding: Opportunity[];
};

const TABS = ['all', 'challenges', 'events', 'funding'] as const;

export default function OpportunitiesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>('all');

  const [data, setData] = useState<OpportunitiesMap>({
    all: [],
    challenges: [],
    events: [],
    funding: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [chRes, evRes, fuRes] = await Promise.all([
        axios.get('/opportunities?type=challenges'),
        axios.get('/opportunities?type=events'),
        axios.get('/opportunities?type=funding'),
      ])

      const challenges = chRes.data.map((c: any) => ({
        ...c,
        type: 'challenges',
      }))

      const events = evRes.data.map((e: any) => ({
        ...e,
        type: 'events',
      }))

      const funding = fuRes.data.map((f: any) => ({
        ...f,
        type: 'funding',
      }))

      setData({
        challenges,
        events,
        funding,
        all: [...challenges, ...events, ...funding],
      })
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])


  return (
    <>
      <Header />

      <main className="bg-[#0B1220] min-h-screen text-white">
       {/* HERO */}
<section className="relative pt-36 pb-28 text-center">
  <div className="pointer-events-none absolute -top-40 -left-40 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl" />
  <div className="pointer-events-none absolute -bottom-40 right-0 w-125 h-125 bg-cyan-500/10 rounded-full blur-3xl" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

  {/* BACK BUTTON */}
  <button
    onClick={() => router.back()}
    className="absolute top-8 left-6 mt-10 z-10 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
  >
    ← Back
  </button>

  <div className="relative max-w-4xl mx-auto px-6">
    <Badge className="mb-5 mt-10 px-4 py-2 text-sm font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
      ✨ Opportunities
    </Badge>

    <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 mt-6">
      Explore{' '}
      <span className="bg-linear-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
        Growth Opportunities
      </span>
    </h1>

    <p className="mt-5 text-lg text-gray-400">
      Access challenges, events, and funding opportunities
      designed to accelerate innovation
    </p>
  </div>
</section>


               {/* TABS */}
        <div className="flex justify-center mb-10 py-6 border-t border-white/10">
          <Tabs
            value={activeTab}
            onValueChange={v => setActiveTab(v as any)}
          >
            <TabsList
              className="
                flex gap-2 p-6 rounded-full
                bg-white dark:bg-white/5
                border border-black/5 dark:border-white/10
                shadow-lg
              "
            >
              <TabsTrigger
                value="all"
                className="
                  flex items-center gap-2 px-6 py-4 rounded-full
                  text-sm font-medium transition-all
                  data-[state=active]:bg-blue-600
                  data-[state=active]:text-white
                  data-[state=active]:shadow-md
                "
              >
                All
              </TabsTrigger>

              <TabsTrigger
                value="challenges"
                className="
                  flex items-center gap-2 px-6 py-4 rounded-full
                  text-sm font-medium transition-all
                  data-[state=active]:bg-blue-600
                  data-[state=active]:text-white
                  data-[state=active]:shadow-md
                "
              >
                <Trophy className="w-4 h-4" />
                Challenges
              </TabsTrigger>

              <TabsTrigger
                value="events"
                className="
                  flex items-center gap-2 px-6 py-4 rounded-full
                  text-sm font-medium transition-all
                  data-[state=active]:bg-blue-600
                  data-[state=active]:text-white
                  data-[state=active]:shadow-md
                "
              >
                <Calendar className="w-4 h-4" />
                Events
              </TabsTrigger>

              <TabsTrigger
                value="funding"
                className="
                  flex items-center gap-2 px-6 py-4 rounded-full
                  text-sm font-medium transition-all
                  data-[state=active]:bg-blue-600
                  data-[state=active]:text-white
                  data-[state=active]:shadow-md
                "
              >
                <Wallet className="w-4 h-4" />
                Funding
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* CARDS */}
        <section className="max-w-7xl mx-auto px-6 py-16 ">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {data[activeTab].map(item => (
                <Card
                  key={`${item.type}-${item.id}`}
                  className="relative p-8 rounded-2xl bg-white dark:bg-[#0F172A]
                  border border-black/5 dark:border-white/10
                  shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-700 to-blue-400" />

                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {item.organization?.logo && (
                        <img
                          src={`http://localhost:8000/storage/${item.organization.logo}`}
                          className="w-10 h-10 rounded-full object-cover border border-black/5"
                        />
                      )}
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {item.organization.user.first_name}{' '}
                        {item.organization.user.last_name}
                      </div>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                      {item.type === 'challenges' && <Trophy className="w-5 h-5 text-blue-600" />}
                      {item.type === 'events' && <CalendarClock className="w-5 h-5 text-blue-600" />}
                      {item.type === 'funding' && <DollarSign className="w-5 h-5 text-blue-600" />}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {item.short_description}
                  </p>

                  <div className="text-sm space-y-3 text-gray-500 dark:text-gray-400">
                    {item.deadline && (
                      <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-blue-500" />
                        {new Date(item.deadline).toLocaleDateString()}
                      </div>
                    )}

                    {item.event_datetime && (
                      <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-blue-500" />
                        {new Date(item.event_datetime).toLocaleString()}
                      </div>
                    )}

                    {item.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {item.location}
                      </div>
                    )}

                    {item.award && (
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-blue-500" />
                        {item.award}
                      </div>
                    )}

                    {item.participant_number && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        {item.participant_number} Participants
                      </div>
                    )}

                    {item.amount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        {item.amount} {item.funding_type && `(${item.funding_type})`}
                      </div>
                    )}
                  </div>

                  <div
                    className="mt-10 flex justify-center text-blue-600 dark:text-blue-400 font-medium text-sm group cursor-pointer"
                    onClick={() => router.push(`/opportunities/${item.type}/${item.id}`)}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </>
  );
}
