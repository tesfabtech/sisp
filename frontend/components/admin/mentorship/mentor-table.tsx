'use client'

import Image from 'next/image'
import { Mentor } from './types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'
import { useState } from 'react'
import { Star, Trash2, Ban, RotateCcw } from 'lucide-react'

type Props = {
  mentors: Mentor[]
  viewMode: 'approved' | 'requests'
  showTrash?: boolean
}

export default function MentorTable({ mentors, viewMode, showTrash = false }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  /* APPROVE / REJECT */
  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    if (!token) return
    try {
      setLoadingId(id)
      await axios.patch(
        `/admin/mentors/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (viewMode === 'requests') {
        const index = mentors.findIndex(m => m.id === id)
        if (index >= 0) mentors.splice(index, 1)
      }
    } catch (error) {
      console.error(`${action} failed`, error)
    } finally {
      setLoadingId(null)
    }
  }

  /* ⭐ FEATURED TOGGLE */
  const toggleFeatured = async (mentor: Mentor) => {
    if (!token) return
    try {
      setLoadingId(mentor.id)
      mentor.featured = !mentor.featured
      await axios.patch(
        `/admin/mentors/${mentor.id}/featured`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (error) {
      mentor.featured = !mentor.featured
      console.error('Toggle featured failed', error)
    } finally {
      setLoadingId(null)
    }
  }

  /* ⛔ SUSPEND / UNSUSPEND */
  const toggleSuspend = async (mentor: Mentor) => {
    if (!token) return
    try {
      setLoadingId(mentor.id)
      mentor.is_available = !mentor.is_available
      await axios.patch(
        `/admin/mentors/${mentor.id}/availability`,
        { is_available: mentor.is_available },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (error) {
      mentor.is_available = !mentor.is_available
      console.error('Suspend toggle failed', error)
    } finally {
      setLoadingId(null)
    }
  }

  /* 🗑 SOFT DELETE (for available mentors) */
  const handleDelete = async (mentor: Mentor) => {
    if (!token) return
    if (!confirm('Are you sure you want to delete this mentor?')) return
    try {
      setLoadingId(mentor.id)
      await axios.delete(`/admin/mentors/${mentor.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const index = mentors.findIndex(m => m.id === mentor.id)
      if (index >= 0) mentors.splice(index, 1)
    } catch (error) {
      console.error('Delete mentor failed', error)
    } finally {
      setLoadingId(null)
    }
  }

  /* 🔄 RESTORE (from trash) */
  const handleRestore = async (mentor: Mentor) => {
    if (!token) return
    try {
      setLoadingId(mentor.id)
      await axios.patch(`/admin/mentors/${mentor.id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const index = mentors.findIndex(m => m.id === mentor.id)
      if (index >= 0) mentors.splice(index, 1)
    } catch (error) {
      console.error('Restore failed', error)
    } finally {
      setLoadingId(null)
    }
  }

  /* ❌ FORCE DELETE (permanent) */
  const handleForceDelete = async (mentor: Mentor) => {
    if (!token) return
    if (!confirm('This will permanently delete the mentor. Continue?')) return
    try {
      setLoadingId(mentor.id)
      await axios.delete(`/admin/mentors/${mentor.id}/force`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const index = mentors.findIndex(m => m.id === mentor.id)
      if (index >= 0) mentors.splice(index, 1)
    } catch (error) {
      console.error('Permanent delete failed', error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b1220] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th className="px-5 py-3 text-left">Mentor</th>
            <th className="px-5 py-3 text-left">Title</th>
            <th className="px-5 py-3 text-left">Expertise</th>
            <th className="px-5 py-3 text-left">Industries</th>
            <th className="px-5 py-3 text-left">Availability</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {mentors.map(mentor => (
            <tr key={mentor.id} className="group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition">
              {/* Mentor */}
              <td className="px-5 py-4 flex items-center gap-4">
                {mentor.profile_image ? (
                  <Image
                    src={`http://localhost:8000/storage/${mentor.profile_image}`}
                    alt="Mentor"
                    width={44}
                    height={44}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold">
                    {mentor.user.first_name[0]}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mentor.user.first_name} {mentor.user.last_name}
                    </span>
                    {mentor.featured && !showTrash && (
                      <Badge className="rounded-full bg-yellow-500/15 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-400 text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{mentor.user.email}</div>
                </div>
              </td>

              <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{mentor.title ?? '—'}</td>

              <td className="px-5 py-4">
                {mentor.expertise?.length ? (
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.map(item => (
                      <Badge key={item} className="rounded-full px-2 py-0.5 text-xs dark:bg-gray-700 dark:text-gray-200">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : <span className="text-gray-400 dark:text-gray-500">—</span>}
              </td>

              <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                {mentor.industries?.length ? mentor.industries.join(', ') : '—'}
              </td>

              <td className="px-5 py-4">
                {mentor.is_available ? (
                  <Badge className="rounded-full bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                    Available
                  </Badge>
                ) : (
                  <Badge className="rounded-full bg-red-500/15 text-red-600 dark:bg-red-400/10 dark:text-red-400">
                    Unavailable
                  </Badge>
                )}
              </td>

              <td className="px-5 py-4 text-right space-x-2">
                {showTrash ? (
                  <>
                    <Button size="sm" disabled={loadingId === mentor.id} onClick={() => handleRestore(mentor)}>
                      Restore
                    </Button>
                    <Button size="sm" variant="destructive" disabled={loadingId === mentor.id} onClick={() => handleForceDelete(mentor)}>
                      Delete Permanently
                    </Button>
                  </>
                ) : viewMode === 'requests' ? (
                  <>
                    <Button size="sm" disabled={loadingId === mentor.id} onClick={() => handleAction(mentor.id, 'approve')}>
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" disabled={loadingId === mentor.id} onClick={() => handleAction(mentor.id, 'reject')}>
                      Reject
                    </Button>
                  </>
                ) : (
                  <>
                    {/* ⭐ Featured */}
                    <Button size="icon" variant="ghost" disabled={loadingId === mentor.id} onClick={() => toggleFeatured(mentor)}>
                      <Star size={18} className={mentor.featured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
                    </Button>

                    {/* ⛔ Suspend / Unsuspend */}
                    <Button size="icon" variant="ghost" disabled={loadingId === mentor.id} onClick={() => toggleSuspend(mentor)} title={mentor.is_available ? 'Suspend' : 'Unsuspend'}>
                      {mentor.is_available ? <Ban size={18} className="text-red-500" /> : <RotateCcw size={18} className="text-emerald-500" />}
                    </Button>

                    {/* 🗑 Delete soft (only if suspended) */}
                    {!mentor.is_available && (
                      <Button size="icon" variant="ghost" title="Delete" disabled={loadingId === mentor.id} onClick={() => handleDelete(mentor)}>
                        <Trash2 size={18} className="text-red-600" />
                      </Button>
                    )}

                    <Button size="sm" variant="outline">View</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mentors.length === 0 && (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">No mentors found.</div>
      )}
    </div>
  )
}
