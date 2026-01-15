'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Users,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { label: 'Overview', href: '/dashboard/startup', icon: LayoutDashboard },
  { label: 'Startup Profile', href: '/dashboard/startup/profile', icon: User },
  { label: 'Mentor Requests', href: '/dashboard/startup/mentor_request', icon: Users },
  { label: 'Messages', href: '/dashboard/startup/messages', icon: MessageSquare },
  { label: 'Notifications', href: '/dashboard/startup/notifications', icon: Bell },
  { label: 'Team', href: '/dashboard/startup/team', icon: Users },
  { label: 'Analytics', href: '/dashboard/startup/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/startup/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        InnoHub
      </h1>

      <nav className="space-y-1">
        {items.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
              pathname === href
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
