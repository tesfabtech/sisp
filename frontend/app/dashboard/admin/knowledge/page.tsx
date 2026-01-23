'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import Sidebar from '@/components/admin/sidebar'
import Header from '@/components/admin/header'
import KnowledgeCard from '@/components/admin/knowledge/knowledge-card'
import { KnowledgeHub } from '@/components/admin/knowledge/types'
import Link from 'next/link'
import { Trash2, Plus, Star, Search } from 'lucide-react'

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

export default function AdminKnowledgePage() {
  const [items, setItems] = useState<KnowledgeHub[]>([])
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    axios
      .get('/admin/knowledge', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setItems(res.data.data))
  }, [])

  /* ───────── Filtered Items ───────── */
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (type !== 'all' && item.type !== type) return false
      if (status !== 'all' && item.status !== status) return false
      if (featuredOnly && !item.is_featured) return false
      if (
        search &&
        !item.title.toLowerCase().includes(search.toLowerCase())
      )
        return false

      return true
    })
  }, [items, type, status, featuredOnly, search])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6 max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Knowledge Hub</h1>

            <div className="flex items-center gap-3">
              {/* Featured */}
              <button
                onClick={() => setFeaturedOnly(p => !p)}
                className={`p-2 rounded-md transition ${
                  featuredOnly
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                title="Featured articles"
              >
                <Star size={18} />
              </button>

              {/* Trash */}
              <Link
                href="/dashboard/admin/knowledge/trash"
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <Trash2 size={18} />
              </Link>

              {/* Create */}
              <Link
                href="/dashboard/admin/knowledge/create"
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <Plus size={18} />
              </Link>
            </div>
          </div>

          {/* Filters + Search */}
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

          {/* Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              No articles found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <KnowledgeCard
                  key={item.id}
                  item={item}
                  onUpdate={(id, changes) =>
                    setItems(p =>
                      p.map(i =>
                        i.id === id ? { ...i, ...changes } : i
                      )
                    )
                  }
                  onRemove={id =>
                    setItems(p => p.filter(i => i.id !== id))
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
