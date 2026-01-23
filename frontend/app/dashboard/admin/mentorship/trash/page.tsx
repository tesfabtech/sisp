'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import axios from '@/lib/axios'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, ArrowLeft, Search } from 'lucide-react'
import { Mentor } from '@/components/admin/mentorship/types'
import Link from 'next/link'

export default function MentorshipTrashPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  /* ───────── Fetch deleted mentors ───────── */
  useEffect(() => {
    if (!token) return

    axios
      .get('/admin/mentors/deleted', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setMentors(res.data))
      .finally(() => setLoading(false))
  }, [token])

  /* ───────── Actions ───────── */
  const restore = async (id: number) => {
    if (!token) return

    await axios.patch(
      `/admin/mentors/${id}/restore`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setMentors(prev => prev.filter(m => m.id !== id))
  }

  const forceDelete = async (id: number) => {
    if (!token) return
    if (!confirm('This action is permanent. Continue?')) return

    await axios.delete(`/admin/mentors/${id}/force`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    setMentors(prev => prev.filter(m => m.id !== id))
  }

  /* ───────── Search filter ───────── */
  const filteredMentors = useMemo(() => {
    if (!search) return mentors

    const q = search.toLowerCase()

    return mentors.filter(m =>
      `${m.user.first_name} ${m.user.last_name} ${m.user.email}`
        .toLowerCase()
        .includes(q)
    )
  }, [mentors, search])

  const btn = 'h-7 px-3 text-[11px]'

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Mentorship Trash</h1>
              <p className="text-sm text-muted-foreground">
                Deleted mentors can be restored or permanently removed.
              </p>
            </div>

            <Link href="/dashboard/admin/mentorship">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft size={14} />
                Back
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-8 pl-3 pr-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <Search
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Content */}
          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading deleted mentors...
            </p>
          )}

          {!loading && filteredMentors.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Trash is empty.
            </p>
          )}

          {!loading && filteredMentors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMentors.map(mentor => (
                <Card
  key={mentor.id}
  className="p-3 flex flex-col text-xs bg-white dark:bg-[#0b1220]"
>
  {/* Status */}
  <span className="self-end text-[10px] text-red-600">
    deleted
  </span>

  {/* Mentor Info */}
  <div className="flex items-center gap-2 mt-1 mb-2">
    {mentor.profile_image ? (
      <Image
        src={`http://localhost:8000/storage/${mentor.profile_image}`}
        alt="Mentor"
        width={32}
        height={32}
        className="rounded-full object-cover"
        unoptimized
      />
    ) : (
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-semibold text-[11px]">
        {mentor.user.first_name[0]}
      </div>
    )}

    <div className="min-w-0 leading-tight">
      <p className="font-semibold truncate text-[13px]">
        {mentor.user.first_name} {mentor.user.last_name}
      </p>
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
        <Mail size={11} />
        {mentor.user.email}
      </div>
    </div>
  </div>

  {/* Actions */}
  <div className="mt-auto flex justify-between gap-2">
    <Button
      size="sm"
      className="h-6 px-2 text-[10px]"
      onClick={() => restore(mentor.id)}
    >
      Restore
    </Button>

    <Button
      size="sm"
      variant="destructive"
      className="h-6 px-2 text-[10px]"
      onClick={() => forceDelete(mentor.id)}
    >
      Delete Forever
    </Button>
  </div>
</Card>



              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
