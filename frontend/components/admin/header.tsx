'use client'

import { useEffect, useState } from 'react'
import { Bell, Sun, Moon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdminHeader() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark'
    setDark(!dark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', next)
  }

  return (
    <header className="flex items-center justify-between gap-6 px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Left: Title + Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Administer the platform in one place.
        </p>
      </div>

      {/* Middle: Search */}
      <div className="w-72">
        <Input placeholder="Search..." />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border flex items-center justify-center"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>

        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          T
        </div>
      </div>
    </header>
  )
}
