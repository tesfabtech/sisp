'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import ChallengeCard from '@/components/admin/challenges/challenge-card'
import { Challenge } from '@/components/admin/challenges/types'
import axios from '@/lib/axios'
import { Search, Star, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  // filters
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [showFeatured, setShowFeatured] = useState(false)

  /* ───────── Fetch challenges ───────── */
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)

    axios
      .get('/admin/challenges', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setChallenges(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  /* ───────── Instant UI updates (IMPORTANT) ───────── */

  const updateChallenge = (id: number, changes: Partial<Challenge>) => {
    setChallenges(prev =>
      prev.map(c => (c.id === id ? { ...c, ...changes } : c))
    )
  }

  const removeChallenge = (id: number) => {
    setChallenges(prev => prev.filter(c => c.id !== id))
  }

  /* ───────── Filters ───────── */
  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      if (showFeatured && !c.is_featured) return false
      if (status && c.status !== status) return false
      if (type && c.type !== type) return false

      if (search) {
        const q = search.toLowerCase()
        if (!c.title.toLowerCase().includes(q)) return false
      }

      return true
    })
  }, [challenges, search, status, type, showFeatured])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Challenges</h1>
              <p className="text-sm text-gray-500">
                Total challenges: {filteredChallenges.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFeatured(p => !p)}
                className={`p-2 rounded-md transition ${
                  showFeatured
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Star size={18} />
              </button>

              <Link
                href="/dashboard/admin/challenges/trash"
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Trash2 size={18} />
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search challenges..."
                className="w-full h-8 pl-3 pr-7 text-xs rounded-md border bg-white dark:bg-gray-900"
              />
              <Search
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="h-8 px-2 text-xs rounded-md border bg-white dark:bg-gray-900"
            >
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="open">Open</option>
              <option value="cancelled">Cancelled</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="h-8 px-2 text-xs rounded-md border bg-white dark:bg-gray-900"
            >
              <option value="">All types</option>
              <option value="innovation">Innovation</option>
              <option value="hackathon">Hackathon</option>
              <option value="pitch">Pitch</option>
            </select>
          </div>

          {loading && (
            <p className="text-sm text-gray-400">Loading challenges...</p>
          )}

          {!loading && !filteredChallenges.length && (
            <p className="text-sm text-gray-400">No challenges found.</p>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onUpdate={updateChallenge}
                  onRemove={removeChallenge}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
