'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import Sidebar from '@/components/admin/sidebar'
import Header from '@/components/admin/header'
import FundingCard from '@/components/admin/funding/fund-card'
import { FundingOpportunity } from '@/components/admin/funding/types'
import Link from 'next/link'
import { Trash2, Star } from 'lucide-react'

const FUNDING_TYPES = [
  'grant',
  'equity',
  'loan',
  'convertible_note',
]

const STATUSES = [
  'pending',
  'open',
  'closed',
  'cancelled',
]

export default function AdminFundingPage() {
  const [items, setItems] = useState<FundingOpportunity[]>([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  /* ───────── Fetch Data ───────── */
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    axios
      .get('/admin/funding', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setItems(res.data.data))
  }, [])

  /* ───────── Instant Update Handler ───────── */
  const handleUpdate = (
    id: number,
    changes: Partial<FundingOpportunity>
  ) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...changes } : item
      )
    )
  }

  /* ───────── Filters ───────── */
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (
        search &&
        !item.title.toLowerCase().includes(search.toLowerCase())
      )
        return false

      if (type !== 'all' && item.funding_type !== type)
        return false

      if (status !== 'all' && item.status !== status)
        return false

      if (featuredOnly && !item.is_featured) return false

      return true
    })
  }, [items, search, type, status, featuredOnly])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6 max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">
              Funding Opportunities
            </h1>

            <div className="flex items-center gap-3">
              {/* Featured */}
              <button
                onClick={() => setFeaturedOnly(p => !p)}
                className={`p-2 rounded-md transition ${
                  featuredOnly
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                title="Featured funding"
              >
                <Star size={18} />
              </button>

              {/* Trash */}
              <Link
                href="/dashboard/admin/funding/trash"
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <Trash2 size={18} />
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">

            {/* Search */}
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 px-3 rounded-md border bg-background text-sm w-64"
            />

            {/* Type */}
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="h-9 px-3 rounded-md border bg-background text-sm"
            >
              <option value="all">All Types</option>
              {FUNDING_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="h-9 px-3 rounded-md border bg-background text-sm"
            >
              <option value="all">All Status</option>
              {STATUSES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              No funding opportunities found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <FundingCard
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdate}
                  onRemove={id =>
                    setItems(prev =>
                      prev.filter(i => i.id !== id)
                    )
                  }
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
