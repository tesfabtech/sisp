'use client'

import { useState } from 'react'
import AdminHeader from '@/components/admin/header'
import AdminSidebar from '@/components/admin/sidebar'
import ProfileTab from '@/components/admin/settings/profileTab'
import SecurityTab from '@/components/admin/settings/SecurityTab'
import clsx from 'clsx'

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<'profile' | 'security'>('profile')

  return (
    <div className="flex min-h-screen bg-[#0B1220]">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader />

        <main className="p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('profile')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium',
                tab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              )}
            >
              Profile
            </button>

            <button
              onClick={() => setTab('security')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium',
                tab === 'security'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              )}
            >
              Security
            </button>
          </div>

          {/* Content */}
          <div className="bg-[#111827] rounded-xl p-6 border border-gray-800">
            {tab === 'profile' && <ProfileTab />}
            {tab === 'security' && <SecurityTab />}
          </div>
        </main>
      </div>
    </div>
  )
}
