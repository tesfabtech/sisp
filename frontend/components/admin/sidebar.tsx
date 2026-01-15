'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Rocket,
  Target,
  Calendar,
  BookOpen,
  Handshake,
  Megaphone,
  Shield,
  Settings,
  FileText,
} from 'lucide-react'
import clsx from 'clsx'

const items = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/dashboard/admin/users', icon: Users },
  { label: 'Startups', href: '/dashboard/admin/startups', icon: Rocket },
  { label: 'Challenges', href: '/dashboard/admin/challenges', icon: Target },
  { label: 'Events', href: '/dashboard/admin/events', icon: Calendar },
  { label: 'Knowledge Hub', href: '#', icon: BookOpen },
  { label: 'Mentorship', href: '#', icon: Handshake },
  { label: 'Announcements', href: '#', icon: Megaphone },
  { label: 'Moderation', href: '#', icon: Shield },
  { label: 'Settings', href: '#', icon: Settings },
  { label: 'Audit Logs', href: '#', icon: FileText },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <div className="px-6 py-5 text-xl font-bold">
        InnoAdmin
      </div>

      <nav className="px-3 space-y-1">
        {items.map(item => {
          const active = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
