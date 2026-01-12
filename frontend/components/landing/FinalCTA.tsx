'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden text-white">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0B3A7A] via-[#1B5DBF] to-[#00A7C2] dark:from-[#071A33] dark:via-[#0B2D5C] dark:to-[#062A33]" />

      {/* DOTTED BACKGROUND */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* SOFT LIGHT BLOBS */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          Join the Ecosystem
        </motion.div>

        {/* TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
        >
          Join Sidama&apos;s Growing <br />
          Innovation Community
        </motion.h2>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-lg text-white/80 max-w-2xl mx-auto"
        >
          Connect with startups, access funding opportunities, participate in
          challenges, and grow your innovation journey with us.
        </motion.p>

        {/* CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <Button
            size="lg"
            className="h-12 px-8 bg-white text-blue-700 hover:bg-white/90 font-semibold shadow-xl rounded-xl"
          >
            Create Your Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* FOOTER NOTE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-sm text-white/70"
        >
          Free to join · No credit card required · Join 500+ innovators
        </motion.div>
      </div>
    </section>
  );
}
