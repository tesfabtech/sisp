'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import MentorTable from '@/components/admin/mentorship/mentor-table'
import { Mentor } from '@/components/admin/mentorship/types'
import axios from '@/lib/axios'
import { Search, Star, Trash2 } from 'lucide-react'

export default function MentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'approved' | 'requests'>('approved')
  const [showTrash, setShowTrash] = useState(false)

  // 🔹 Featured toggle
  const [showFeatured, setShowFeatured] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [availability, setAvailability] = useState('')

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token) return

      try {
        setLoading(true)
        const url =
          showTrash
            ? '/admin/mentors/deleted'
            : viewMode === 'requests'
            ? '/admin/mentors/requests'
            : '/admin/mentors'

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setMentors(res.data)
      } catch (error) {
        console.error('Failed to fetch mentors', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMentors()
  }, [viewMode, showTrash])

  // 🔹 Filtered mentors
  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      // ⭐ Featured filter (only in approved view)
      if (showFeatured && !mentor.featured) return false

      const q = search.toLowerCase()

      const matchesSearch =
        !search ||
        mentor.user.first_name.toLowerCase().includes(q) ||
        mentor.user.last_name.toLowerCase().includes(q) ||
        mentor.user.email.toLowerCase().includes(q) ||
        mentor.expertise?.some(e => e.toLowerCase().includes(q)) ||
        mentor.industries?.some(i => i.toLowerCase().includes(q))

      if (!matchesSearch) return false

      if (availability === 'available' && !mentor.is_available) return false
      if (availability === 'unavailable' && mentor.is_available) return false

      return true
    })
  }, [mentors, search, availability, showFeatured])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Mentorship
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage mentors, expertise, and availability
              </p>
            </div>

            {/* View Mode + Featured + Trash */}
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-2 rounded-lg ${
                  viewMode === 'approved'
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
                }`}
                onClick={() => {
                  setViewMode('approved')
                  setShowFeatured(false)
                  setShowTrash(false)
                }}
              >
                Approved
              </button>

              <button
                className={`px-3 py-2 rounded-lg ${
                  viewMode === 'requests'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
                }`}
                onClick={() => {
                  setViewMode('requests')
                  setShowFeatured(false)
                  setShowTrash(false)
                }}
              >
                Requests
              </button>

              {/* ⭐ Featured Button */}
              {viewMode === 'approved' && !showTrash && (
                <button
                  title="Featured mentors"
                  onClick={() => setShowFeatured(prev => !prev)}
                  className={`p-2 rounded-lg transition ${
                    showFeatured
                      ? 'bg-yellow-400/20 text-yellow-500'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}
                >
                  <Star
                    size={18}
                    className={showFeatured ? 'fill-yellow-400' : ''}
                  />
                </button>
              )}

              {/* 🗑 Trash Button */}
              {viewMode === 'approved' && (
                <button
                  title="Deleted mentors"
                  onClick={() => setShowTrash(prev => !prev)}
                  className={`p-2 rounded-lg transition ${
                    showTrash
                      ? 'bg-red-400/20 text-red-600'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search name, email, expertise..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Availability */}
            <select
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="">All availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-gray-500 dark:text-gray-400">
              Loading mentors...
            </div>
          ) : (
            <MentorTable
              mentors={filteredMentors}
              viewMode={viewMode}
              showTrash={showTrash}
            />
          )}
        </main>
      </div>
    </div>
  )
}
