'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import MentorCard from '@/components/admin/mentorship/mentor-card'
import { Mentor } from '@/components/admin/mentorship/types'
import axios from '@/lib/axios'
import { Search, Star, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function MentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)

  // filters
  const [search, setSearch] = useState('')
  const [availability, setAvailability] = useState('')
  const [status, setStatus] = useState('')
  const [showFeatured, setShowFeatured] = useState(false)

  /* ───────── Fetch ALL mentors ───────── */
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)

    axios
      .get('/admin/mentors', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setMentors(res.data))
      .finally(() => setLoading(false))
  }, [])

  /* ───────── Parent state helpers ───────── */
  const updateMentor = (id: number, changes: Partial<Mentor>) => {
    setMentors(prev =>
      prev.map(m => (m.id === id ? { ...m, ...changes } : m))
    )
  }

  const removeMentor = (id: number) => {
    setMentors(prev => prev.filter(m => m.id !== id))
  }

  /* ───────── Filters ───────── */
  const filteredMentors = useMemo(() => {
    return mentors.filter(m => {
      if (showFeatured && !m.featured) return false
      if (status && m.status !== status) return false

      if (availability === 'available' && !m.is_available) return false
      if (availability === 'unavailable' && m.is_available) return false

      if (search) {
        const q = search.toLowerCase()
        if (
          !m.user.first_name.toLowerCase().includes(q) &&
          !m.user.last_name.toLowerCase().includes(q) &&
          !m.user.email.toLowerCase().includes(q)
        )
          return false
      }

      return true
    })
  }, [mentors, search, availability, status, showFeatured])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className='space-y-2'>
              <h1 className="text-2xl font-semibold">Mentorship</h1>
              <p className="text-sm text-gray-500">
                Total mentors: {filteredMentors.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Featured */}
              <button
                onClick={() => setShowFeatured(p => !p)}
                title="Featured"
                className={`p-2 rounded-md transition ${
                  showFeatured
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Star size={18} />
              </button>

              {/* Trash (navigation only) */}
              <Link
                href="/dashboard/admin/mentorship/trash"
                title="Trash"
                className="p-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Trash2 size={18} />
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search mentors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-8 pl-3 pr-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <Search
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Availability */}
            <select
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              className="h-8 px-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="">All availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="h-8 px-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading && (
            <p className="text-sm text-gray-400">Loading mentors...</p>
          )}

          {!loading && !filteredMentors.length && (
            <p className="text-sm text-gray-400">No mentors found.</p>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMentors.map(mentor => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onUpdate={updateMentor}
                  onRemove={removeMentor}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
