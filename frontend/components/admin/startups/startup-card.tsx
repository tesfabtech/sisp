'use client'

import axios from '@/lib/axios'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Briefcase, Star, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Startup } from './types'

type Props = {
  startup: Startup & { deleted_at?: string | null }
}

export default function StartupCard({ startup }: Props) {
  const [status, setStatus] = useState(startup.status)
  const [featured, setFeatured] = useState(startup.featured)
  const [loading, setLoading] = useState(false)
  const [isTrashed, setIsTrashed] = useState(!!startup.deleted_at)

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  const request = async (url: string, nextStatus?: typeof status) => {
    if (!token) return

    try {
      setLoading(true)

      const res = await axios.patch(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status) {
        setStatus(res.data.status)
      }

      if (typeof res.data.featured === 'boolean') {
        setFeatured(res.data.featured)
      } else if (typeof nextStatus !== 'undefined') {
        setStatus(nextStatus)
      }
    } catch (error) {
      console.error('Action failed', error)
    } finally {
      setLoading(false)
    }
  }

  /* ───────────── Status actions ───────────── */

  const handleApprove = () =>
    request(`/admin/startups/${startup.id}/approve`, 'approved')

  const handleReject = () =>
    request(`/admin/startups/${startup.id}/reject`, 'rejected')

  const handleSuspend = () =>
    request(`/admin/startups/${startup.id}/reject`, 'rejected')

  /* ───────────── Featured toggle ───────────── */

  const handleToggleFeatured = () =>
    request(`/admin/startups/${startup.id}/featured`)

  /* ───────────── Trash actions ───────────── */

  const handleRestore = async () => {
    if (!token) return

    try {
      setLoading(true)

      await axios.patch(
        `/admin/startups/${startup.id}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setIsTrashed(false)
      setStatus('rejected')
    } catch (error) {
      console.error('Restore failed', error)
    } finally {
      setLoading(false)
    }
  }

  const handleForceDelete = async () => {
    if (!token) return

    const confirmed = confirm(
      'This will permanently delete the startup. This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      setLoading(true)

      await axios.delete(`/admin/startups/${startup.id}/force`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      console.error('Permanent delete failed', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSoftDelete = async () => {
    if (!token) return

    const confirmed = confirm(
      'Are you sure you want to delete this startup? This can be restored later.'
    )

    if (!confirmed) return

    try {
      setLoading(true)

      await axios.delete(`/admin/startups/${startup.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setIsTrashed(true)
    } catch (error) {
      console.error('Soft delete failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-linear-to-br from-white to-gray-50 dark:from-[#0b1220] dark:to-[#0e1628] shadow-sm">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-blue-500 via-sky-400 to-emerald-400" />

      <div className="p-4 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {startup.logo && (
              <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <Image
                  src={`http://localhost:8000/storage/${startup.logo}`}
                  alt={startup.name}
                  width={22}
                  height={22}
                  className="rounded"
                  unoptimized
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {startup.name}
                </h3>

                {!isTrashed && (
                  <Badge
                    variant="outline"
                    className={
                      status === 'pending'
                        ? 'border-yellow-400/60 text-yellow-600'
                        : status === 'approved'
                        ? 'border-emerald-400/60 text-emerald-600'
                        : 'border-red-400/60 text-red-600'
                    }
                  >
                    {status}
                  </Badge>
                )}

                {featured && !isTrashed && (
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                )}

                {isTrashed && (
                  <Badge variant="outline" className="border-red-400 text-red-600">
                    deleted
                  </Badge>
                )}
              </div>

              {/* ───────── Founder Name ───────── */}
              {startup.founder?.name && (
                <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                  <User size={12} />
                  {startup.founder.name}
                </div>
              )}

              <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                {startup.stage && (
                  <span className="flex items-center gap-1">
                    <Briefcase size={12} />
                    {startup.stage}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />
                  {new Date(startup.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {!isTrashed && (
            <Link href={`/dashboard/admin/startups/${startup.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 rounded-full text-xs"
              >
                View
              </Button>
            </Link>
          )}
        </div>

        {startup.tagline && (
          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
            {startup.tagline}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          {isTrashed ? (
            <>
              <Button size="sm" disabled={loading} onClick={handleRestore}>
                Restore
              </Button>

              <Button
                size="sm"
                disabled={loading}
                onClick={handleForceDelete}
                variant="ghost"
                className="text-red-600"
              >
                Delete Forever
              </Button>
            </>
          ) : (
            <>
              {status === 'pending' && (
                <>
                  <Button size="sm" disabled={loading} onClick={handleApprove}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    disabled={loading}
                    onClick={handleReject}
                    variant="ghost"
                  >
                    Reject
                  </Button>
                </>
              )}

              {status === 'approved' && (
                <>
                  <Button
                    size="sm"
                    disabled={loading}
                    onClick={handleSuspend}
                    variant="ghost"
                  >
                    Suspend
                  </Button>

                  <Button
                    size="sm"
                    disabled={loading}
                    onClick={handleToggleFeatured}
                    variant="ghost"
                    className={
                      featured
                        ? 'text-yellow-600'
                        : 'text-gray-500'
                    }
                  >
                    {featured ? 'Unfeature' : 'Feature'}
                  </Button>
                </>
              )}

              {status === 'rejected' && (
                <>
                  <Button size="sm" disabled={loading} onClick={handleApprove}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    disabled={loading}
                    onClick={handleSoftDelete}
                    variant="ghost"
                  >
                    Delete
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
