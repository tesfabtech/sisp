import Image from 'next/image';
import Link from 'next/link';
import axios from '@/lib/axios-public';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import {
  ArrowLeft,
  User,
  Layers,
  Users,
  CreditCard,
  Wrench,
  ExternalLink,
  Globe,
  Building2
} from 'lucide-react';
import { Card } from '@/components/ui/card';

/* =====================
   TYPES (UNCHANGED)
===================== */
interface Startup {
  id: number;
  name: string;
  tagline?: string | null;
  description?: string | null;
  website?: string | null;
  video_url?: string | null;
  logo: string | null;
  cover_image: string | null;
  industry: string | null;
  stage: string | null;
  user: {
    first_name: string;
    last_name: string;
  };
}

/* =====================
   FETCH (UNCHANGED)
===================== */
async function getStartup(id: string): Promise<Startup | null> {
  try {
    const res = await axios.get(`/startups/detail/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

/* =====================
   VIDEO HELPER (UNCHANGED)
===================== */
const getYouTubeEmbedUrl = (url: string) => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const match = url.match(regex);
  if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
};

export default async function StartupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const startup = await getStartup(id);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!startup) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          Startup not found
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* ================= HERO ================= */}
      <section className="relative h-96 md:h-[60vh] overflow-hidden mt-40">
        {startup.cover_image && (
          <Image
            src={`${API_URL}/storage/${startup.cover_image}`}
            alt={startup.name}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/50 to-[#0B1220]" />

        {/* Back Button */}
        <div className="absolute top-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            {startup.industry && (
              <span className="inline-block mb-4 px-4 py-1 text-xs rounded-full bg-blue-600 text-black">
                {startup.industry}
              </span>
            )}

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              {startup.name}
            </h1>

            {startup.tagline && (
              <p className="text-xl md:text-2xl text-gray-300 font-light">
                {startup.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="bg-[#0B1220] py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                About the Project
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                {startup.description}
              </p>
            </section>

            {/* Video */}
            {startup.video_url && (
              <section>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                  Watch Demo
                </h2>

                <div className="w-full h-96 rounded-2xl overflow-hidden bg-black">
                  <iframe
                    className="w-full h-full"
                    src={getYouTubeEmbedUrl(startup.video_url)}
                    title="Startup Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}
          </div>

          {/* RIGHT INFO CARD */}
          <aside className="relative">
            <Card className="h-fit rounded-2xl p-6 bg-white dark:bg-[#0F172A] border border-gray-200/60 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              {startup.logo && (
                <Image
                  src={`${API_URL}/storage/${startup.logo}`}
                  alt={startup.name}
                  width={48}
                  height={48}
                  className="rounded-md border bg-white"
                  unoptimized
                />
              )}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">
                {startup.name}
              </span>
               {startup.tagline && (
              <p >
                {startup.tagline}
              </p>
            )}
            </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {startup.stage && (
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>{startup.stage}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  {startup.user.first_name} {startup.user.last_name}
                </span>
              </div>
              {startup.industry && (
    <div className="flex items-center gap-2">
      <Building2 className="w-4 h-4" />
      <span>{startup.industry}</span>
    </div>
  )}
            </div>

            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Visit Project <Globe className="w-4 h-4" />
              </a>
            )}
          </Card>
          </aside>
        </div>
      </section>

      <Footer />
    </>
  );
}
