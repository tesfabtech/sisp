'use client'

import axios from '@/lib/axios'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { Mentor } from './types'

type Props = {
  mentor: Mentor & { deleted_at?: string | null }
  onUpdate: (id: number, changes: Partial<Mentor>) => void
  onRemove: (id: number) => void
}

export default function MentorCard({ mentor, onUpdate, onRemove }: Props) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  const btn = 'h-7 px-3 text-[11px]'

  const statusColor =
    mentor.status === 'approved'
      ? 'text-emerald-600'
      : mentor.status === 'pending'
      ? 'text-yellow-600'
      : 'text-red-600'

  const expertise = mentor.expertise ?? []
  const visibleExpertise = expertise.slice(0, 3)
  const extraCount = expertise.length - visibleExpertise.length

  /* ───────── Actions ───────── */
  const approve = async () => {
    if (!token) return

    onUpdate(mentor.id, {
      status: 'approved',
      is_available: true,
    })

    await axios.patch(
      `/admin/mentors/${mentor.id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const reject = async () => {
    if (!token) return

    onUpdate(mentor.id, {
      status: 'rejected',
      is_available: false,
    })

    await axios.patch(
      `/admin/mentors/${mentor.id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const toggleAvailability = async () => {
    if (!token) return

    onUpdate(mentor.id, {
      is_available: !mentor.is_available,
    })

    await axios.patch(
      `/admin/mentors/${mentor.id}/availability`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const toggleFeatured = async () => {
    if (!token) return

    onUpdate(mentor.id, {
      featured: !mentor.featured,
    })

    await axios.patch(
      `/admin/mentors/${mentor.id}/featured`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const softDelete = async () => {
    if (!token) return
    if (!confirm('Delete this mentor?')) return

    onRemove(mentor.id)

    await axios.delete(`/admin/mentors/${mentor.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  const restore = async () => {
    if (!token) return

    onRemove(mentor.id)

    await axios.patch(
      `/admin/mentors/${mentor.id}/restore`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const forceDelete = async () => {
    if (!token) return
    if (!confirm('This is permanent. Continue?')) return

    onRemove(mentor.id)

    await axios.delete(`/admin/mentors/${mentor.id}/force`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  /* ───────── Render ───────── */

  return (
    <Card className="relative p-4 bg-white dark:bg-[#0b1220] flex flex-col gap-4">
      {/* Status with oval background */}
      {!mentor.deleted_at && (
        <span
          className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusColor} border-current`}
        >
          {mentor.status}
        </span>
      )}

      {/* Mentor Info */}
      <div className="flex items-start gap-3">
        {mentor.profile_image ? (
          <Image
            src={`http://localhost:8000/storage/${mentor.profile_image}`}
            alt="Mentor"
            width={40}
            height={40}
            className="rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold">
            {mentor.user.first_name[0]}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold flex items-center gap-2">
  {mentor.user.first_name} {mentor.user.last_name}
  {/* Availability dot */}
  <span
    className={`h-3 w-3 rounded-full shrink-0 ${   mentor.is_available ? 'bg-green-500' : 'bg-yellow-500'
    }`}
  />
</p>

          <p className="text-xs text-gray-500">{mentor.user.email}</p>

          {mentor.title && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {mentor.title}
            </p>
          )}
        </div>
      </div>

      {/* Expertise */}
      {visibleExpertise.length > 0 && (
        <div className="text-xs">
          <p className="font-medium mb-1">Expertise</p>
          <ul className="space-y-0.5 text-muted-foreground">
            {visibleExpertise.map(item => (
              <li key={item}>• {item}</li>
            ))}
            {extraCount > 0 && <li>+{extraCount}</li>}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex justify-between gap-2">
        {mentor.deleted_at ? (
          <>
            <Button size="sm" className={btn} onClick={restore}>
              Restore
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className={btn}
              onClick={forceDelete}
            >
              Delete Forever
            </Button>
          </>
        ) : mentor.status === 'approved' ? (
          <>
            <Link href={`/dashboard/admin/mentorship/${mentor.id}`}>
              <Button size="sm" className={btn}>
                View
              </Button>
            </Link>

            <Button
              size="sm"
              className={btn}
              variant="secondary"
              onClick={toggleAvailability}
            >
              {mentor.is_available ? 'Suspend' : 'Unsuspend'}
            </Button>

            <Button
              size="sm"
              className={btn}
              variant="secondary"
              onClick={reject}
            >
              Reject
            </Button>

            <Button
              size="sm"
              className={btn}
              variant={mentor.featured ? 'default' : 'secondary'}
              onClick={toggleFeatured}
            >
              <Star
                size={14}
                className={
                  mentor.featured ? 'fill-yellow-400 text-yellow-400' : ''
                }
              />
            </Button>
          </>
        ) : mentor.status === 'rejected' ? (
          <>
            <Link href={`/dashboard/admin/mentorship/${mentor.id}`}>
              <Button size="sm" className={btn}>
                View
              </Button>
            </Link>

            <Button size="sm" className={btn} onClick={approve}>
              Approve
            </Button>

            <Button
              size="sm"
              variant="destructive"
              className={btn}
              onClick={softDelete}
            >
              Delete
            </Button>
          </>
        ) : (
          /* pending */
          <>
            <Link href={`/dashboard/admin/mentorship/${mentor.id}`}>
              <Button size="sm" className={btn}>
                View
              </Button>
            </Link>

            <Button size="sm" className={btn} onClick={approve}>
              Approve
            </Button>

            <Button
              size="sm"
              className={btn}
              variant="secondary"
              onClick={reject}
            >
              Reject
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
