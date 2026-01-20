'use client'

import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import Overview from '@/components/admin/overview'

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <Overview />
        </main>
      </div>
    </div>
  )
}
