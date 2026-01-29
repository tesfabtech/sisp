"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Users,
  Lightbulb,
  Handshake,
  MessageSquare,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

/* =================================================
   Helpers
================================================= */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const heroPattern = "/hero-pattern.jpg";

/* =================================================
   HERO
================================================= */
function Hero() {
  return (
    <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden text-white">
      <Image 
        src={heroPattern} 
        alt="" 
        fill 
        priority 
        className="object-cover" 
      />

      {/* Dark blue gradient matching community section */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-navy-900 to-teal-900 opacity-95" />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.span
          {...fadeUp}
          className="inline-block px-4 py-1.5 mb-6 text-xs tracking-wider font-semibold bg-teal-500 text-white rounded-full"
        >
          SIDAMA INNOVATION & STARTUP PORTAL
        </motion.span>

        <motion.h1
          {...fadeUp}
          className="text-5xl md:text-7xl font-extrabold mb-5"
        >
          About <span className="text-teal-300">SISP</span>
        </motion.h1>

        <motion.p {...fadeUp} className="text-lg md:text-xl text-white/90">
          Strengthening Sidama's Innovation Ecosystem
        </motion.p>

        <motion.p
          {...fadeUp}
          className="mt-6 text-sm text-white/70 tracking-widest"
        >
          — LEARN MORE BELOW —
        </motion.p>
      </div>

      {/* curved bottom */}
      <svg
        viewBox="0 0 1440 120"
        className="absolute bottom-0 w-full fill-white dark:fill-gray-900"
      >
        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" />
      </svg>
    </section>
  );
}

/* =================================================
   CENTRALIZED PLATFORM SECTION
================================================= */
function PlatformSection() {
  const items = [
    "SISP is developed under the mandate of the Sidama Science and Technology Agency (SSTA) to improve coordination, visibility, and access to innovation opportunities.",
    "The platform brings together startups, innovators, mentors, investors, academic institutions, and government bodies into a single digital ecosystem.",
    "By centralizing innovation programs, challenges, events, funding opportunities, and knowledge resources, SISP reduces fragmentation and supports data-driven decision-making.",
    "SISP enables structured collaboration through role-based access, verified profiles, and secure communication tools.",
    "Administrative governance features support transparency, program monitoring, and effective management of innovation initiatives across the region.",
    "The system is designed as a scalable platform that can evolve with future innovation needs and regional development priorities.",
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="px-4 py-1 text-sm bg-gradient-to-r from-blue-900 to-navy-800 text-white rounded-full">
            Centralized Platform
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4 dark:text-white">
            A Centralized Digital Platform
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Sidama Innovation and Startup Portal (SISP) is designed to support
            innovation, entrepreneurship, and startup development across the
            Sidama Region.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((text, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.06 }}
              className="
                group
                bg-white dark:bg-gradient-to-br dark:from-blue-950 dark:via-navy-900 dark:to-teal-900
                p-7
                rounded-3xl
                shadow-md dark:shadow-blue-950/30
                hover:shadow-xl dark:hover:shadow-blue-950/50
                hover:-translate-y-1
                transition-all
                border border-gray-100 dark:border-navy-700/30
                backdrop-blur-sm
              "
            >
              <div className="flex gap-5 items-start">
                {/* gradient number badge matching hero gradient */}
                <div className="
                  w-17 h-10
                  rounded-xl
                  bg-gradient-to-br from-blue-800 via-navy-700 to-teal-700
                  dark:from-blue-700 dark:via-navy-600 dark:to-teal-600
                  text-white font-bold
                  flex items-center justify-center
                  shadow-lg shadow-blue-900/30
                ">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* =================================================
   MISSION / VISION
================================================= */
function MissionVision() {
  const Card = ({ icon: Icon, title, desc }) => (
    <motion.div
      {...fadeUp}
      className="
        relative overflow-hidden
        p-10 rounded-3xl text-white
        bg-gradient-to-br from-blue-950 via-navy-900 to-teal-900
        shadow-xl
        hover:-translate-y-2
        hover:shadow-2xl
        transition-all
      "
    >
      {/* glow circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-teal-500/10 rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full" />

      <div className="relative">
        <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur">
          <Icon size={26} />
        </div>

        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-white/90 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );

  return (
    <section className="py-24 dark:from-blue-700 dark:via-navy-600 dark:to-teal-600">
      <div className="max-w-6xl mx-auto px-6 text-center mb-14">
        <span className="px-4 py-1 text-sm bg-gradient-to-r from-blue-900 to-navy-800 text-white rounded-full">
          Our Purpose
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-4 dark:text-white">
          Driving Innovation Forward
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        <Card
          icon={Target}
          title="Our Mission"
          desc="To empower Sidama's innovation ecosystem by providing a transparent, inclusive, and efficient digital platform that supports startups, innovators, and stakeholders."
        />

        <Card
          icon={Eye}
          title="Our Vision"
          desc="To build a connected and sustainable regional innovation ecosystem that drives economic growth, job creation, and technological advancement."
        />
      </div>
    </section>
  );
}


/* =================================================
   FEATURES
================================================= */
function Features() {
  const features = [
    { icon: Users, title: "Centralized Profiles", desc: "Comprehensive startup and innovator profiles in one place" },
    { icon: Lightbulb, title: "Opportunities", desc: "Innovation challenges, events, and funding opportunities" },
    { icon: Handshake, title: "Mentorship", desc: "Structured mentorship and stakeholder engagement programs" },
    { icon: MessageSquare, title: "Communication", desc: "Secure communication and collaboration tools" },
    { icon: BookOpen, title: "Knowledge Hub", desc: "Learning resources, policies, and best practices" },
    { icon: ShieldCheck, title: "Governance", desc: "Administrative oversight and ecosystem monitoring" },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="text-center mb-14">
        <span className="px-4 py-1 text-sm bg-gradient-to-r from-blue-900 to-navy-800 text-white rounded-full">
          Platform Features
        </span>

        <h2 className="text-3xl md:text-4xl font-bold mt-4 dark:text-white">
          What SISP Provides
        </h2>

        <p className="text-gray-600 dark:text-gray-300">
          Everything you need to innovate, collaborate, and grow within Sidama's ecosystem
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ delay: i * 0.06 }}
            className="
              group
              bg-white dark:bg-gradient-to-br dark:from-blue-950 dark:via-navy-900 dark:to-teal-900
              p-8
              rounded-3xl
              shadow-sm dark:shadow-blue-950/20
              hover:shadow-xl dark:hover:shadow-blue-950/40
              hover:-translate-y-2
              transition-all duration-300
              text-center
              border border-gray-100 dark:border-navy-700/20
            "
          >
            {/* ICON WITH HOVER EFFECT - matches hero gradient */}
            <div
              className="
                w-14 h-14 mx-auto mb-5
                flex items-center justify-center
                rounded-xl
                bg-white dark:bg-navy-800
                text-blue-700 dark:text-teal-400
                shadow dark:shadow-blue-950/30
                transition-all duration-300

                group-hover:bg-gradient-to-br group-hover:from-blue-800 group-hover:via-navy-700 group-hover:to-teal-600
                group-hover:text-white
                group-hover:scale-110
                group-hover:shadow-lg group-hover:shadow-blue-900/30
              "
            >
              <f.icon size={24} />
            </div>

            <h3 className="font-semibold mb-2 dark:text-white">{f.title}</h3>

            <p className="text-gray-600 dark:text-gray-300 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* =================================================
   CTA SECTION
================================================= */
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-950 via-navy-900 to-teal-900">
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <motion.div
          {...fadeUp}
          className="inline-block px-6 py-2 mb-6 text-sm bg-white/20 backdrop-blur rounded-full"
        >
          Join Our Community
        </motion.div>

        <motion.h2
          {...fadeUp}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Strengthening Sidama's Innovation Ecosystem
        </motion.h2>

        <motion.p
          {...fadeUp}
          className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Join us in building a connected and sustainable future for innovation in the Sidama Region.
        </motion.p>

        <motion.div
          {...fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="px-8 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20">
            Get Started
          </button>
          <button className="px-8 py-3 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-colors">
            Learn More
          </button>
        </motion.div>

        <motion.p
          {...fadeUp}
          className="mt-10 text-sm text-white/60"
        >
          Free to join · No credit card required · Join 500+ innovators
        </motion.p>
      </div>
    </section>
  );
}

/* =================================================
   PAGE
================================================= */
export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <Hero />
      <PlatformSection />
      <MissionVision />
      <Features />
      <CTASection />
      <Footer />
    </main>
  );
}