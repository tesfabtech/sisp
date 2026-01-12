'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Building2,
  Trophy,
  Wallet,
  Users,
  TrendingUp,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type StatItem = {
  icon: React.ElementType;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  gradient: string;
};

type CountUpProps = {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const stats: StatItem[] = [
  {
    icon: Building2,
    value: 150,
    suffix: '+',
    label: 'Verified Startups',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Trophy,
    value: 45,
    label: 'Active Challenges',
    gradient: 'from-amber-500 to-orange-400',
  },
  {
    icon: Wallet,
    value: 2,
    prefix: '$',
    suffix: 'M+',
    label: 'Funding Distributed',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    icon: Users,
    value: 80,
    suffix: '+',
    label: 'Mentors & Partners',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
];

/* -------------------------------------------------------------------------- */
/*                                COUNT UP                                    */
/* -------------------------------------------------------------------------- */

function CountUp({
  end,
  prefix = '',
  suffix = '',
  duration = 1800,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setValue(end);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, isInView]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

export default function StatsSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-white dark:bg-[#0B1220]">
      {/* Dark mode glow */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Growing{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Together
            </span>
          </h2>

          <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The Sidama innovation ecosystem is scaling faster every quarter.
          </p>
        </motion.div>

        {/* STATS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full rounded-2xl overflow-hidden bg-white dark:bg-[#0F172A] border border-black/5 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                  {/* Top gradient bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${stat.gradient}`}
                  />

                  <div className="p-8 text-center">

                    {/* Icon */}
                    <div
                      className={`mx-auto mb-6 w-16 h-16 rounded-2xl bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-xl`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Number */}
                    <div className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                      <CountUp
                        end={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </div>

                    {/* Label */}
                    <div className="text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Growth Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 flex justify-center"
        >
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-semibold">
            <TrendingUp className="w-5 h-5" />
            35% growth in the last quarter
          </div>
        </motion.div>

      </div>
    </section>
  );
}
