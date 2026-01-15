'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  Users,
  Clock,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from 'lucide-react'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/mentor' },
  { label: 'Requests', icon: Inbox, href: '/dashboard/mentor/requests' },
  { label: 'Active Mentorships', icon: Users, href: '/dashboard/mentor/active' },
  { label: 'History', icon: Clock, href: '/dashboard/mentor/history' },
  { label: 'Messages', icon: MessageSquare, href: '/dashboard/mentor/messages' },
  { label: 'Profile', icon: User, href: '/dashboard/mentor/profile' },
  { label: 'Settings', icon: Settings, href: '/dashboard/mentor/settings' },
]

export default function MentorSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <aside className="w-64 border-r bg-white dark:bg-gray-900 flex flex-col">
      <div className="px-6 py-4 text-lg font-bold text-gray-900 dark:text-white">
        MentorHub
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm font-medium transition
                ${
                  active
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
