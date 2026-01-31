'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  X,
} from 'lucide-react';

import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

/* =========================
   TYPES
========================= */
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

type Startup = {
  id: number;
  name: string;
};

/* =========================
   TYPE NORMALIZER
========================= */
const normalizeType = (
  type: string
): 'funding' | 'event' | 'challenge' | null => {
  if (type === 'event' || type === 'events') return 'event';
  if (type === 'challenge' || type === 'challenges') return 'challenge';
  if (type === 'funding' || type === 'fundings') return 'funding';
  return null;
};

/* =========================
   API TYPE MAP
========================= */
const apiTypeMap: Record<'funding' | 'challenge' | 'event', string> = {
  funding: 'fundings',
  challenge: 'challenges',
  event: 'events',
};

/* =========================
   PAGE
========================= */
export default function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams();

  const rawType = params.type as string;
  const id = params.id as string;
  const type = normalizeType(rawType);

  const [data, setData] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  /* Funding modal */
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [pitchDeck, setPitchDeck] = useState('');
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState<number | null>(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const storedUser =
    typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = storedUser ? JSON.parse(storedUser) : null;

  /* =========================
     FETCH OPPORTUNITY
========================= */
  useEffect(() => {
    if (!rawType || !id) return;

    setIsLoading(true);
    axios
      .get(`/opportunities/${rawType}/${id}`)
      .then(res => setData(res.data))
      .finally(() => setIsLoading(false));
  }, [rawType, id]);

  /* =========================
     FETCH USER STARTUPS
========================= */
  useEffect(() => {
    if (type !== 'funding' || !token) return;

    axios
      .get('/startups/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setStartups(res.data))
      .catch(() => setStartups([]));
  }, [type, token]);

  /* =========================
     APPLY HANDLER
========================= */
  const handleApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'startup') {
      router.push('/register/role');
      return;
    }

    if (!type) return;

    if (type === 'funding') {
      setShowFundingModal(true);
      return;
    }

    try {
      setIsApplying(true);
      const apiType = apiTypeMap[type];
      await axios.post(`/opportunities/${apiType}/${id}/apply`);
      alert('Application submitted successfully');
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert('You already applied.');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      setIsApplying(false);
    }
  };

  /* =========================
     SKELETON
========================= */
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="bg-gray-50 dark:bg-[#0B1220] min-h-screen animate-pulse">
          <div className="max-w-7xl mx-auto px-6 py-20 space-y-10">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
              <div className="lg:col-span-2 h-48 bg-gray-300 dark:bg-gray-700 rounded-xl" />
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!data) return null;

  return (
    <>
      <Header />
      <div className="bg-gray-50 dark:bg-[#0B1220] overflow-hidden">

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

            <Badge className="capitalize bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {rawType}
            </Badge>

            <h1 className="text-4xl font-bold mb-4">{data.title}</h1>

            <p className="max-w-2xl text-gray-300 mb-6">
              {data.short_description}
            </p>

            <button
              onClick={handleApply}
              disabled={isApplying}
              className="
                px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition
                text-white text-sm font-medium
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center gap-2
              "
            >
              {isApplying && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {!user
                ? 'Login to apply'
                : user.role !== 'startup'
                ? 'Register as a startup to apply'
                : isApplying
                ? 'Applying...'
                : 'Apply Now'}
            </button>
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
          </div>
        </section>
      </div>

      {/* FUNDING MODAL */}
      {showFundingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowFundingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Apply for Funding
            </h3>

            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Startup (optional)
            </label>
            <select
              value={selectedStartupId ?? ''}
              onChange={(e) =>
                setSelectedStartupId(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="
                w-full rounded-lg border px-3 py-2 text-sm mb-4
                bg-white text-gray-900 border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-[#0F172A] dark:text-gray-100 dark:border-gray-700
              "
            >
              <option value="">-- None --</option>
              {startups.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Pitch Deck *
            </label>
            <textarea
              value={pitchDeck}
              onChange={(e) => setPitchDeck(e.target.value)}
              rows={6}
              className="w-full rounded-lg border px-3 py-2 text-sm mb-4"
            />

            <button
              disabled={isApplying}
              onClick={async () => {
                if (!pitchDeck.trim()) {
                  alert('Pitch deck is required.');
                  return;
                }

                try {
                  setIsApplying(true);
                  await axios.post(
                    `/opportunities/fundings/${id}/apply`,
                    {
                      startup_id: selectedStartupId,
                      pitch_deck: pitchDeck,
                    },
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  alert('Application submitted successfully');
                  setShowFundingModal(false);
                  setPitchDeck('');
                  setSelectedStartupId(null);
                } catch (error: any) {
      if (error.response?.status === 409) {
        alert('You already applied.');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      setIsApplying(false);
    }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
