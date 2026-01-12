'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Star, ArrowRight } from 'lucide-react';

type Mentor = {
  id: number;
  name: string;
  role: string;
  expertise: string;
  rating: number;
  image: string;
};

const mentors: Mentor[] = [
  {
    id: 1,
    name: 'Dr. Bekele Amare',
    role: 'Tech Entrepreneur',
    expertise: 'Product Strategy',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=200',
  },
  {
    id: 2,
    name: 'Tigist Haile',
    role: 'Venture Partner',
    expertise: 'Fundraising',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
  },
  {
    id: 3,
    name: 'Samuel Girma',
    role: 'Growth Advisor',
    expertise: 'Marketing & Sales',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?w=200',
  },
  {
    id: 4,
    name: 'Helen Tadesse',
    role: 'Legal Expert',
    expertise: 'Business Law',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200',
  },
];

export default function MentorshipSection() {
  return (
    <section className="relative py-28 overflow-hidden text-white">
      {/* MODERATE GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-linear-to-br 
        from-[#EAF1FF] via-[#F3F7FF] to-[#EAFBFA]
        dark:from-[#071A2F] dark:via-[#0B2447] dark:to-[#062A2F]
      " />

      {/* GRID / NET BACKGROUND */}
      {/* Light mode grid */}
      <div
        className="absolute inset-0 opacity-30 dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Dark mode grid */}
      <div
        className="absolute inset-0 opacity-25 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* SOFT GLOW */}
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-cyan-400/10 dark:bg-cyan-400/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-gray-900 dark:text-white"
        >
          <Badge className="mb-6 bg-black/5 text-gray-800 border-black/10 dark:bg-white/15 dark:text-white dark:border-white/20">
            Expert Mentorship
          </Badge>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Learn from <br />
            Experienced{' '}
            <span className="text-emerald-600 dark:text-emerald-300">
              Mentors
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-700 dark:text-white/80 max-w-xl">
            Connect with industry leaders and seasoned entrepreneurs who
            can guide your journey from idea to successful venture.
          </p>

          {/* STATS */}
          <div className="mt-10 flex gap-10">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
              <div>
                <div className="text-2xl font-bold">80+</div>
                <div className="text-sm text-gray-600 dark:text-white/70">
                  Active Mentors
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-gray-600 dark:text-white/70">
                  Sessions Completed
                </div>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-10 bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-blue-700 dark:hover:bg-white/90 font-semibold"
          >
            Explore Mentorship
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* RIGHT MENTOR CARDS */}
        <div className="grid sm:grid-cols-2 gap-8">
          {mentors.map((mentor, i) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-black/5 dark:border-white/15 rounded-2xl p-6 shadow-xl text-gray-900 dark:text-white"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{mentor.name}</div>
                  <div className="text-sm text-gray-600 dark:text-white/70">
                    {mentor.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm bg-black/5 dark:bg-white/20 px-3 py-1 rounded-full">
                  {mentor.expertise}
                </span>
                <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {mentor.rating}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
