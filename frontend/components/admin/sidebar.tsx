'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Rocket,
  Target,
  Calendar,
  BookOpen,
  Handshake,
  Building2,
  Megaphone,
  Shield,
  ShieldCheck,
  Settings,
  FileText,
} from 'lucide-react'
import clsx from 'clsx'

type AdminUser = {
  role: 'admin' | 'super_admin'
}

const items = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/dashboard/admin/users', icon: Users },
  { label: 'Startups', href: '/dashboard/admin/startups', icon: Rocket },
  { label: 'Challenges', href: '/dashboard/admin/challenges', icon: Target },
  { label: 'Events', href: '/dashboard/admin/events', icon: Calendar },
  { label: 'Knowledge Hub', href: '/dashboard/admin/knowledge', icon: BookOpen },
  { label: 'Mentorship', href: '/dashboard/admin/mentorship', icon: Handshake },
  { label: 'Organizations', href: '/dashboard/admin/organization', icon: Building2 },
  { label: 'Announcements', href: '#', icon: Megaphone },
  { label: 'Moderation', href: '#', icon: Shield },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

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

        {/* ✅ SUPER ADMIN ONLY */}
        {user?.role === 'super_admin' && (
          <Link
            href="/dashboard/admin/admins"
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition',
              pathname === '/dashboard/admin/admins'
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <ShieldCheck size={18} />
            Admins
          </Link>
        )}

        {/* Bottom section */}
        <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/dashboard/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings size={18} />
            Settings
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FileText size={18} />
            Audit Logs
          </Link>
        </div>
      </nav>
    </aside>
  )
}
