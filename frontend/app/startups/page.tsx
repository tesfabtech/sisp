'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from '@/lib/axios-public';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Layers, User, ArrowRight } from 'lucide-react';

interface Startup {
  id: number;
  name: string;
  tagline?: string | null;
  logo: string | null;
  cover_image: string | null;
  industry: string | null;
  stage: string | null;
  user: {
    first_name: string;
    last_name: string;
  };
}

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState<string>('all');
  const [stage, setStage] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const isDesktop = useIsDesktop();
  useEffect(() => {
    axios
      .get('/startups')
      .then((res) => setStartups(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filteredStartups = useMemo(() => {
    return startups.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase());

      const matchesIndustry =
        industry === 'all' || s.industry === industry;

      const matchesStage =
        stage === 'all' || s.stage === stage;

      return matchesSearch && matchesIndustry && matchesStage;
    });
  }, [startups, search, industry, stage]);

  const INDUSTRIES = [
  'all',
  'Tech',
  'AgriTech',
  'FinTech',
  'HealthTech',
  'EdTech',
  'Commerce',
  'Social',
  'Other',
];


function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    check(); // initial run
    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
}


  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative py-28 bg-[#0B1220] text-center overflow-hidden">
        {/* SOFT GRADIENT GLOWS */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-125 h-125 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-6">
          <Badge className="mb-5 px-4 py-2 pl-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            🚀 Startup Directory
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Explore <span className="bg-linear-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">All Startups</span>
          </h1>

          <p className="mt-5 text-lg text-gray-400">
            Discover innovative startups shaping the future of Sidama’s
            entrepreneurial ecosystem
          </p>
        </div>
      </section>

{/* FILTER BAR */}
<section className="bg-[#0B1220] border-b border-t border-white/10">
  <div className="max-w-7xl mx-auto px-6 py-6 flex gap-4 lg:flex-row lg:items-center">

    {/* SEARCH */}
    <Input
      placeholder="Search startups..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-[#0F172A] border-white/10 text-white lg:w-72"
    />

    {/* INDUSTRY — BUTTONS (DESKTOP ONLY) */}
    {isDesktop && (
      <div className="flex  gap-2">
        {INDUSTRIES.map((item) => (
          <button
            key={item}
            onClick={() => setIndustry(item)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${
                industry === item
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#0F172A] text-gray-400 hover:text-white hover:bg-white/10'
              }`}
          >
            {item === 'all' ? 'All' : item}
          </button>
        ))}
      </div>
    )}

    {/* INDUSTRY — DROPDOWN (MOBILE + TABLET ONLY) */}
    {!isDesktop && (
      <div className="w-full">
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="bg-[#0F172A] border-white/10 text-white">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item === 'all' ? 'All Industries' : item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )}

    {/* STAGE — ALL DEVICES */}
    <div className="w-full lg:w-48">
      <Select value={stage} onValueChange={setStage}>
        <SelectTrigger className="bg-[#0F172A] border-white/10 text-white">
          <SelectValue placeholder="All Stages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          <SelectItem value="idea">Idea</SelectItem>
          <SelectItem value="mvp">MVP</SelectItem>
          <SelectItem value="launched">Launched</SelectItem>
          <SelectItem value="scaling">Scaling</SelectItem>
        </SelectContent>
      </Select>
    </div>

  </div>
</section>



      {/* GRID */}
      <section className="bg-[#0B1220] py-16">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
            
          {filteredStartups.map((startup) => (
            <Card
              key={startup.id}
              className="rounded-2xl overflow-hidden border border-white/10 bg-[#0F172A] shadow-lg hover:shadow-xl transition"
            >
              {/* COVER */}
              <div className="relative h-44 ">
                {startup.cover_image && (
                  <Image
                    src={`${API_URL}/storage/${startup.cover_image}`}
                    alt={startup.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}

                {startup.industry && (
                  <span className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full bg-[#14B8A6] text-white">
                    {startup.industry}
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col justify-between h-65">
                <div className="space-y-4">
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
                  <h3 className="text-lg font-bold text-white">
                    {startup.name}
                  </h3>
</div>
                  {startup.tagline && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {startup.tagline}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-gray-400">
                    {startup.stage && (
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        {startup.stage}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {startup.user.first_name} {startup.user.last_name}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 flex justify-center">
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
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
