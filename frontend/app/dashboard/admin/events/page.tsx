'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import EventCard from '@/components/admin/events/event-card'
import { Event } from '@/components/admin/events/types'
import axios from '@/lib/axios'
import Link from 'next/link'
import { Search, Star, Trash2 } from 'lucide-react'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // filters
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [venue, setVenue] = useState('')
  const [type, setType] = useState('')
  const [showFeatured, setShowFeatured] = useState(false)

  /* ───────── Fetch events ───────── */
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)

    axios
      .get('/admin/events', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setEvents(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  /* ───────── Filters (client-side) ───────── */
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (showFeatured && !e.is_featured) return false
      if (status && e.status !== status) return false
      if (venue && e.venue !== venue) return false
      if (type && e.event_type !== type) return false

      if (search) {
        const q = search.toLowerCase()
        if (!e.title.toLowerCase().includes(q)) return false
      }

      return true
    })
  }, [events, search, status, venue, type, showFeatured])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Events</h1>
              <p className="text-sm text-gray-500">
                Total events: {filteredEvents.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Featured toggle */}
              <button
                onClick={() => setShowFeatured(p => !p)}
                title="Featured events"
                className={`p-2 rounded-md transition ${
                  showFeatured
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Star size={18} />
              </button>

              {/* Trash */}
              <Link
                href="/dashboard/admin/events/trash"
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
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-8 pl-3 pr-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <Search
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Status */}
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="h-8 px-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>

            {/* Venue */}
            <select
              value={venue}
              onChange={e => setVenue(e.target.value)}
              className="h-8 px-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="">All venues</option>
              <option value="physical">Physical</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>

            {/* Type */}
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="h-8 px-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="">All types</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="networking">Networking</option>
              <option value="bootcamp">Bootcamp</option>
              <option value="training">Training</option>
            </select>
          </div>

          {/* States */}
          {loading && (
            <p className="text-sm text-gray-400">Loading events...</p>
          )}

          {!loading && !filteredEvents.length && (
            <p className="text-sm text-gray-400">No events found.</p>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onUpdate={(id, changes) =>
                    setEvents(p =>
                      p.map(ev =>
                        ev.id === id ? { ...ev, ...changes } : ev
                      )
                    )
                  }
                  onRemove={id =>
                    setEvents(p => p.filter(ev => ev.id !== id))
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
