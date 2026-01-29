'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CalendarClock,
  Users,
  Award,
  ArrowLeft,
} from 'lucide-react';

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

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
  description: string;
  deadline?: string;
  award?: string;
  participant_number?: number;
  organization: Organization;
};

/* =========================
   SKELETON (NO STRUCTURE CHANGE)
========================= */
function OpportunitySkeleton() {
  return (
    <>
      <Header />
      <div className="bg-gray-50 dark:bg-[#0B1220] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

        {/* HERO */}
        <section className="text-white pb-20">
          <div className="max-w-7xl mx-auto px-6 py-14 mt-10 space-y-4">
            <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-2/3 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-32 bg-blue-500/20 rounded-lg animate-pulse" />
          </div>
        </section>

        {/* STATS */}
        <section className="max-w-7xl mx-auto px-6 mt-10">
          <div className="flex gap-8">
            {[1, 2, 3].map(i => (
              <Card
                key={i}
                className="p-4 w-72 rounded-xl bg-white/90 dark:bg-[#0F172A]"
              >
                <div className="h-4 w-24 bg-gray-300/40 dark:bg-white/10 rounded mb-2 animate-pulse" />
                <div className="h-5 w-32 bg-gray-300/40 dark:bg-white/10 rounded animate-pulse" />
              </Card>
            ))}
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/90 dark:bg-[#0F172A] space-y-3">
              <div className="h-5 w-48 bg-gray-300/40 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-300/40 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-300/40 dark:bg-white/10 rounded animate-pulse" />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-[#0F172A] space-y-3">
              <div className="h-4 w-32 bg-gray-300/40 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-8 w-48 bg-gray-300/40 dark:bg-white/10 rounded animate-pulse" />
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

/* =========================
   PAGE
========================= */
export default function OpportunityDetailPage() {
  const { type, id } = useParams();
  const [data, setData] = useState<Opportunity | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!type || !id) return;
    axios.get(`/opportunities/${type}/${id}`).then(res => setData(res.data));
  }, [type, id]);

  /* 🔥 ONLY CHANGE: skeleton instead of text */
  if (!data) return <OpportunitySkeleton />;

  return (
    <>
      <Header />
      <div className="bg-gray-50 dark:bg-[#0B1220] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

        {/* HERO */}
        <section className="text-white pb-20">
          <div className="max-w-7xl mx-auto px-6 py-14 mt-10">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-300 mb-6 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Opportunities
            </button>

            <div className="flex gap-7 mb-4">
              <Badge className="capitalize bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {type}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {data.title}
            </h1>

            <p className="max-w-2xl text-gray-300 mb-6 leading-relaxed">
              {data.short_description}
            </p>

            <div className="flex gap-4">
              <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium">
                Apply Now
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="max-w-7xl mx-auto px-6 mt-10">
          <div className="flex gap-8">
            {data.deadline && (
              <Card className="p-2 w-72 rounded-xl bg-white/90 dark:bg-[#0F172A]">
                <div className="flex gap-2">
                  <CalendarClock className="w-5 h-5 text-blue-600" />
                  <p className="text-xs text-gray-500">Deadline</p>
                </div>
                <p className="text-sm font-semibold">
                  {new Date(data.deadline).toLocaleDateString()}
                </p>
              </Card>
            )}

            {data.award && (
              <Card className="p-4 rounded-xl bg-white/90 dark:bg-[#0F172A]">
                <div className="flex gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <p className="text-xs text-gray-500">Award</p>
                </div>
                <p className="text-sm font-semibold">{data.award}</p>
              </Card>
            )}

            {data.participant_number && (
              <Card className="p-4 w-72 rounded-xl bg-white/90 dark:bg-[#0F172A]">
                <div className="flex gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <p className="text-xs text-gray-500">Participants</p>
                </div>
                <p className="text-sm font-semibold">
                  {data.participant_number}
                </p>
              </Card>
            )}
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/90 dark:bg-[#0F172A]">
              <h2 className="text-xl font-semibold mb-4">
                About This Opportunity
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {data.description}
              </p>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-[#0F172A]">
              <h3 className="font-semibold mb-4">Organized By</h3>
              <div className="flex items-center gap-3">
                {data.organization.logo && (
                  <img
                    src={`http://localhost:8000/storage/${data.organization.logo}`}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <p className="font-medium">
                  {data.organization.user.first_name}{' '}
                  {data.organization.user.last_name}
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/90 dark:bg-[#0F172A]">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Have questions about this opportunity?
              </p>
              <button className="w-full px-4 py-2 rounded-lg border">
                Contact Support
              </button>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
