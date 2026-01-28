'use client';

import * as React from 'react';
import axios from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';


import {
 Trophy,
  Calendar,
  Wallet,
  ArrowRight,
  MapPin,
  Users,
  CalendarClock,
  Award,
  DollarSign,
} from 'lucide-react';

type Organization = {
  id: number;
  user: {
    first_name: string;
    last_name: string;
  };
  logo: string | null;
};

type Challenge = {
  id: number;
  title: string;
  short_description: string;
  deadline: string;
  award: string;
  participant_number: number;
  organization: Organization;
};

type Event = {
  id: number;
  title: string;
  short_description: string;
  event_datetime: string;
  location: string;
  organization: Organization;
};

type Funding = {
  id: number;
  title: string;
  short_description: string;
  deadline: string;
  amount: string;
  funding_type: string;
  organization: Organization;
};

type OpportunityMap = {
  challenges: Challenge[];
  events: Event[];
  funding: Funding[];
};

export default function OpportunitiesSection() {
  const [activeTab, setActiveTab] =
    React.useState<keyof OpportunityMap>('challenges');

  const [data, setData] = React.useState<OpportunityMap>({
    challenges: [],
    events: [],
    funding: [],
  });

  React.useEffect(() => {
    axios.get('/opportunities/featured').then(res => setData(res.data));
  }, []);


const router = useRouter();




  return (
    <section
    id="opportunities"
    className="relative py-32 bg-gray-50 dark:bg-[#0B1220] overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-20">
          <Badge className="mb-5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            ✨ Opportunities
          </Badge>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Unlock{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Growth Opportunities
            </span>
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Discover challenges, events, and funding opportunities designed to
            accelerate innovation across the ecosystem.
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-16">
          <Tabs
            value={activeTab}
            onValueChange={v => setActiveTab(v as any)}
          >
            <TabsList className="flex gap-2 p-6 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-lg">
              <TabsTrigger
                value="challenges"
                className="flex items-center gap-2 px-6 py-4 rounded-full text-sm font-medium transition-all
                data-[state=active]:bg-blue-600 data-[state=active]:text-white
                data-[state=active]:shadow-md"
              >
                <Trophy className="w-4 h-4" />
                Challenges
              </TabsTrigger>

              <TabsTrigger
                value="events"
                className="flex items-center gap-2 px-6 py-4 rounded-full text-sm font-medium transition-all
                data-[state=active]:bg-blue-600 data-[state=active]:text-white
                data-[state=active]:shadow-md"
              >
                <Calendar className="w-4 h-4" />
                Events
              </TabsTrigger>

              <TabsTrigger
                value="funding"
                className="flex items-center gap-2 px-6 py-4 rounded-full text-sm font-medium transition-all
                data-[state=active]:bg-blue-600 data-[state=active]:text-white
                data-[state=active]:shadow-md"
              >
                <Wallet className="w-4 h-4" />
                Funding
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* CARDS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {data[activeTab]?.map((item: any) => (
              <Card
  key={item.id}
  className="relative p-8 rounded-2xl bg-white overflow-hidden dark:bg-[#0F172A]
  border border-black/5 dark:border-white/10
  shadow-lg hover:shadow-2xl transition-all"
>
  {/* Top gradient line */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-700 to-blue-400" />

  {/* TOP */}
  <div className="flex justify-between mb-1">
    {/* Org */}
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

    {/* TYPE ICON */}
    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
      {activeTab === 'challenges' && <Trophy className="w-5 h-5 text-blue-600" />}
      {activeTab === 'events' && <Calendar className="w-5 h-5 text-blue-600" />}
      {activeTab === 'funding' && <Wallet className="w-5 h-5 text-blue-600" />}
    </div>
  </div>

  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
    {item.title}
  </h3>

  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
    {item.short_description}
  </p>

  {/* META */}
  <div className="text-sm space-y-3 text-gray-500 dark:text-gray-400">

    {'deadline' in item && (
  <div className="flex items-center gap-2">
    <CalendarClock className="w-4 h-4 text-blue-500" />
    {new Date(item.deadline).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })}
  </div>
)}

{'event_datetime' in item && (
  <div className="flex items-center gap-2">
    <CalendarClock className="w-4 h-4 text-blue-500" />
    {new Date(item.event_datetime).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}
  </div>
)}


    {'location' in item && (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-500" />
        {item.location}
      </div>
    )}

    {'award' in item && (
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4 text-blue-500" />
        {item.award}
      </div>
    )}

    {'participant_number' in item && (
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-500" />
        {item.participant_number} Participants
      </div>
    )}

    {'amount' in item && (
      <div className="flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-blue-500" />
        {item.amount} ({item.funding_type})
      </div>
    )}
  </div>

  <div
  className="mt-8 flex justify-center text-blue-600 dark:text-blue-400 font-medium text-sm group cursor-pointer"
  onClick={() => router.push(`/opportunities/${activeTab}/${item.id}`)}
>
  View Details
  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
</div>

</Card>

            ))}
          </motion.div>
        </AnimatePresence>


        {/* VIEW ALL */}
        <div className="mt-14 text-center">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold hover:gap-3 transition-all cursor-pointer"
          >
            View All Opportunities
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
