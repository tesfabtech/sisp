'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#0066FF] to-[#00C9B1] flex items-center justify-center text-white font-bold shadow-lg">
              S
            </div>
            <div className="leading-tight">
              <div className="font-bold text-gray-900 dark:text-white">
                SISP
              </div>
              <div className="text-xs tracking-widest text-gray-500 dark:text-gray-400">
                INNOVATION
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Link href="#home" className="hover:text-[#0066FF] transition">Home</Link>
            <Link href="#startups" className="hover:text-[#0066FF] transition">Startups</Link>
            <Link href="#opportunities" className="hover:text-[#0066FF] transition">Opportunities</Link>
            <Link href="#knowledge" className="hover:text-[#0066FF] transition">Knowledge Hub</Link>
            <Link href="#mentorship" className="hover:text-[#0066FF] transition">Mentorship</Link>
            <Link href="#about" className="hover:text-[#0066FF] transition">About</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* Auth */}
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0066FF] transition"
            >
              Login
            </Link>
            <Link href="/register/role">
            <Button 
              className="bg-linear-to-r from-[#0066FF] to-[#0047AB] hover:opacity-90 text-white px-5 rounded-lg shadow-md">
              Register
            </Button>
          </Link>
            
          </div>
        </div>
      </div>
    </header>
  );
}
