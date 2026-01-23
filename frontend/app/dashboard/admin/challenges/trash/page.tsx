'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import ChallengeCard from '@/components/admin/challenges/challenge-card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Challenge } from '@/components/admin/challenges/types'

export default function TrashedChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  // filters
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const router = useRouter()

  /* ───────── Fetch trashed challenges ───────── */
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)

    axios
      .get('/admin/challenges/trashed', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setChallenges(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  /* ───────── Client-side filters ───────── */
  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      if (type && c.type !== type) return false

      if (search) {
        const q = search.toLowerCase()
        if (!c.title.toLowerCase().includes(q)) return false
      }

      return true
    })
  }, [challenges, search, type])

  /* ───────── Instant UI remove ───────── */
  const removeChallenge = (id: number) => {
    setChallenges(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Back */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm text-muted-foreground w-fit"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Back to challenges
          </Button>

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">
              Trashed Challenges
            </h1>
            <p className="text-sm text-gray-500">
              Deleted challenges can be restored or permanently removed
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search challenges..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-8 pl-3 pr-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <Search
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Type */}
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="h-8 px-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="">All types</option>
              <option value="innovation">Innovation</option>
              <option value="hackathon">Hackathon</option>
              <option value="pitch">Pitch</option>
            </select>

            <span className="text-xs text-gray-400 ml-auto">
              Showing {filteredChallenges.length}
            </span>
          </div>

          {loading && (
            <p className="text-sm text-gray-400">
              Loading trashed challenges...
            </p>
          )}

          {!loading && !filteredChallenges.length && (
            <p className="text-sm text-gray-400">
              No challenges found.
            </p>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
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
