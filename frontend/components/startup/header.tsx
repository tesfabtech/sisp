'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Sun, Moon, LogOut, User, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function Header() {
  const router = useRouter()
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ first_name: string; role?: string } | null>(null)

  // Load user and theme after mount
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
  }, [])

  const toggleTheme = () => {
    const nextTheme = dark ? 'light' : 'dark'
    setDark(!dark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', nextTheme)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back{user ? `, ${user.first_name}` : ''} 👋
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your startup in one place.
        </p>
      </div>

      <div className="flex items-center gap-2 relative">
        {/* Home Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push('/')}
          className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition currsor-pointer"
          title="Home"
        >
          <Home size={18} />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user?.first_name?.[0] || <User size={18} />}
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user?.first_name}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
