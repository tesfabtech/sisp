'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Bell, Sun, Moon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'

type AdminUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: 'admin' | 'super_admin'
}

export default function AdminHeader() {
  const [dark, setDark] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  /* =========================
     Load theme + admin user
  ========================== */
  useEffect(() => {
    // Theme
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }

    // Admin basic info
    const storedUser = localStorage.getItem('admin_user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)
      console.log('[AdminHeader] admin from localStorage:', parsed)
    }

    // Fetch admin profile image
    const token = localStorage.getItem('admin_token')
    if (!token) return

    axios
      .get('/admin/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        if (res.data?.profile_photo) {
          setProfileImage(res.data.profile_photo)
          console.log('[AdminHeader] profile image:', res.data.profile_photo)
        }
      })
      .catch(err => {
        console.warn('[AdminHeader] profile fetch failed')
      })
  }, [])

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark'
    setDark(!dark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', next)
  }

  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : ''

  return (
    <header className="flex items-center justify-between gap-6 px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Administer the platform in one place.
        </p>
      </div>

      {/* Middle */}
      <div className="w-72">
        <Input placeholder="Search..." />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border flex items-center justify-center"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>

        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.first_name} {user.last_name}
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${
                    user.role === 'super_admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }
                `}
              >
                {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </span>
            </div>

            {/* Avatar */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-semibold">
              {profileImage ? (
                <Image
                  src={`http://localhost:8000/storage/${profileImage}`}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                initials
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
