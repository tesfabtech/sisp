'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import { KnowledgeHub } from '@/components/admin/knowledge/types'
import KnowledgeCard from '@/components/admin/knowledge/knowledge-card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'

const TYPES = [
  'startup',
  'funding',
  'marketing',
  'product',
  'technology',
  'legal',
  'finance',
  'operations',
  'leadership',
  'design',
  'ai',
  'general',
]

export default function TrashedKnowledgePage() {
  const [items, setItems] = useState<KnowledgeHub[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')

    if (!token) {
      router.push('/login')
      return
    }

    axios
      .get('/admin/knowledge/trashed', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setItems(res.data.data))
      .finally(() => setLoading(false))
  }, [router])

  /* ───────── Filtered Items ───────── */
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (
        search &&
        !item.title.toLowerCase().includes(search.toLowerCase())
      )
        return false

      if (type !== 'all' && item.type !== type) return false
      if (status !== 'all' && item.status !== status) return false

      return true
    })
  }, [items, search, type, status])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 max-w-7xl mx-auto space-y-6">

          {/* Back */}
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Back
          </Button>

          {/* Title */}
          <h1 className="text-2xl font-semibold">
            Trashed Articles
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-md border bg-background text-sm w-64"
              />
            </div>

            {/* Type */}
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="h-9 px-3 rounded-md border bg-background text-sm"
            >
              <option value="all">All Types</option>
              {TYPES.map(t => (
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
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl bg-muted"
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filteredItems.length === 0 && (
            <div className="text-center text-muted-foreground py-20">
              No trashed articles found
            </div>
          )}

          {/* Cards */}
          {!loading && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <KnowledgeCard
                  key={item.id}
                  item={item}
                  onRemove={id =>
                    setItems(p =>
                      p.filter(i => i.id !== id)
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
