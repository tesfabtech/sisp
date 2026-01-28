'use client'

import { useEffect, useState } from 'react'
import { Bell, Sun, Moon, User, Home } from 'lucide-react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'
import router from 'next/dist/shared/lib/router/router'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function MentorHeader() {
  const [dark, setDark] = useState(false)
  const [user, setUser] = useState<{ first_name: string } | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }

    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get('/mentor/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data?.profile_image) {
          setProfileImage(res.data.profile_image)
        }
      })
      .catch(() => {})
  }, [])

  const toggleTheme = () => {
    const nextTheme = dark ? 'light' : 'dark'
    setDark(!dark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', nextTheme)
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back{user ? `, ${user.first_name}` : ''} 👋
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your mentorship activities in one place.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Home Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => router.push('/')}
                  className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                  title="Home"
                >
                  <Home size={18} />
                </motion.button>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border flex items-center justify-center"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>

        {/* Profile Image */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border overflow-hidden"
        >
          {profileImage ? (
            <Image
              src={`http://localhost:8000/storage/${profileImage}`}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <User size={18} />
          )}
        </Button>
      </div>
    </header>
  )
}
