'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '@/lib/axios'

// Types
interface User {
  first_name: string;
  role: 'startup' | 'mentor' | 'organization' | 'guest';
  profile_image?: string;
  logo?: string;
}


export default function Header() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

const avatarUrl = avatar
  ? `http://localhost:8000/storage/${avatar}`
  : null;

  

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!storedUser || !token) return;

  const parsedUser = JSON.parse(storedUser);
  setUser(parsedUser);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (parsedUser.role === 'mentor') {
    axios.get('/mentor/profile', { headers })
      .then(res => {
        if (res.data?.profile_image) {
          setAvatar(res.data.profile_image);
        }
      });
  }

  if (parsedUser.role === 'organization') {
    axios.get('/organization/profile', { headers })
      .then(res => {
        if (res.data.organization?.logo) {
          setAvatar(res.data.organization.logo);
        }
      });
  }
}, []);


  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  const dashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'startup':
        return '/dashboard/startup';
      case 'mentor':
        return '/dashboard/mentor';
      case 'organization':
        return '/dashboard/organization';
      default:
        return '/';
    }
  };

  const userInitial = user?.first_name?.charAt(0).toUpperCase();

  const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

  

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/logo.png"
                alt="SISP Logo"
                width={36}
                height={36}
              />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-orange-600 dark:text-orange-400">SISP</div>
             
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Link href="/#home" className="hover:text-[#0066FF] transition">Home</Link>
            <Link href="/#startups" className="hover:text-[#0066FF] transition">Startups</Link>
            <Link href="/#opportunities" className="hover:text-[#0066FF] transition">Opportunities</Link>
            <Link href="/#knowledge" className="hover:text-[#0066FF] transition">Knowledge Hub</Link>
            <Link href="/#mentorship" className="hover:text-[#0066FF] transition">Mentorship</Link>
            <Link href="/about" className="hover:text-[#0066FF] transition">About</Link>
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

            {/* Not logged in */}
            {!user && (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0066FF] transition"
                >
                  Login
                </Link>
                <Link href="/register/role">
                  <Button className="bg-linear-to-r from-[#0066FF] to-[#0047AB] hover:opacity-90 text-white px-5 rounded-lg shadow-md">
                    Register
                  </Button>
                </Link>
              </>
            )}

            {/* Logged in */}
            {user && (
              <div className="flex items-center gap-3">

                {/* Dashboard (not for guest) */}
                {user.role !== 'guest' && (
                  <Link href={dashboardPath()}>
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                {/* Profile image / initial */}
                <div className="relative">
  <button
    onClick={() => setOpen(!open)}
    className="w-9 h-9 rounded-full overflow-hidden bg-[#0066FF] text-white flex items-center justify-center cursor-pointer"
  >
    {avatarUrl ? (
      <Image
        src={avatarUrl}
        alt={user.first_name}
        width={36}
        height={36}
        className="object-cover"
        unoptimized
      />
    ) : (
      userInitial
    )}
  </button>

  {open && (
    <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <button
        onClick={logout}
        className="w-full px-2 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-white/10 text-left"
      >
        Logout
      </button>
    </div>
  )}
</div>

              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
