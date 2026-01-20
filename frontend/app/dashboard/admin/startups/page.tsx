'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import StartupCard from '@/components/admin/startups/startup-card'
import { Startup } from '@/components/admin/startups/types'
import axios from '@/lib/axios'
import { Trash2, Search, Star } from 'lucide-react'

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [showTrash, setShowTrash] = useState(false)

  // 🔹 filters
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('')
  const [status, setStatus] = useState('')

  // ⭐ featured toggle
  const [showFeatured, setShowFeatured] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)

    axios
      .get(showTrash ? '/admin/startups/deleted' : '/admin/startups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setStartups(res.data.startups)
      })
      .catch(() => {
        console.error('Failed to fetch startups')
      })
      .finally(() => setLoading(false))
  }, [showTrash])

  // 🔹 filtered list
  const filteredStartups = useMemo(() => {
    return startups.filter(startup => {
      if (showFeatured && !startup.featured) return false

      if (
        search &&
        !startup.name.toLowerCase().includes(search.toLowerCase())
      )
        return false

      if (stage && startup.stage !== stage) return false
      if (status && startup.status !== status) return false

      return true
    })
  }, [startups, search, stage, status, showFeatured])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {showTrash
                  ? 'Trash'
                  : showFeatured
                  ? 'Featured Startups'
                  : 'Startups'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {showTrash
                  ? `Deleted startups: ${filteredStartups.length}`
                  : `Total startups: ${filteredStartups.length}`}
              </p>
            </div>

            {/* ⭐ Star + Trash toggles */}
            <div className="flex items-center gap-2">
              {!showTrash && (
                <button
                  onClick={() => setShowFeatured(prev => !prev)}
                  title="Featured"
                  className={`p-2 rounded-md transition ${
                    showFeatured
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Star size={18} />
                </button>
              )}

              <button
                onClick={() => {
                  setShowTrash(prev => !prev)
                  setShowFeatured(false)
                }}
                title="Trash"
                className={`p-2 rounded-md transition ${
                  showTrash
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* 🔹 Filters */}
          {!showTrash && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Stage */}
              <select
                value={stage || ''}
                onChange={e => setStage(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <option value="">All stages</option>
                <option value="idea">Idea</option>
                <option value="mvp">MVP</option>
                <option value="launched">Launched</option>
                <option value="scaling">Scaling</option>
              </select>

              {/* Status */}
              <select
                value={status || ''}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <option value="">All status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}

          {loading && (
            <p className="text-sm text-gray-400">
              Loading {showTrash ? 'deleted startups...' : 'startups...'}
            </p>
          )}

          {!loading && !filteredStartups.length && (
            <p className="text-sm text-gray-400">
              {showTrash
                ? 'Trash is empty.'
                : showFeatured
                ? 'No featured startups.'
                : 'No startups found.'}
            </p>
          )}

          <div className="grid grid-cols-1 gap-6">
            {filteredStartups.map(startup => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
