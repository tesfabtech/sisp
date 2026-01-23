'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import EventCard from '@/components/admin/events/event-card'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Event } from '@/components/admin/events/types'

export default function TrashedEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // filters
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [venue, setVenue] = useState('')
  const [type, setType] = useState('')

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)

    axios
      .get('/admin/events/trashed', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setEvents(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  /* ───────── Client-side filters ───────── */
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (status && e.status !== status) return false
      if (venue && e.venue !== venue) return false
      if (type && e.event_type !== type) return false

      if (search) {
        const q = search.toLowerCase()
        if (!e.title.toLowerCase().includes(q)) return false
      }

      return true
    })
  }, [events, search, status, venue, type])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Back
              </Button>

              <h1 className="text-xl font-semibold">
                Trashed Events
              </h1>
            </div>

            <p className="text-sm text-gray-500">
              Total: {filteredEvents.length}
            </p>
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
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

          

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
            <p className="text-sm text-gray-400">
              Loading trashed events...
            </p>
          )}

          {!loading && !filteredEvents.length && (
            <p className="text-sm text-gray-400">
              No events found.
            </p>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRemove={id =>
                    setEvents(p =>
                      p.filter(ev => ev.id !== id)
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
