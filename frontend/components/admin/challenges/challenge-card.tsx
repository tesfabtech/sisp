'use client'

import { Challenge } from './types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import axios from '@/lib/axios'
import Link from 'next/link'
import {
  Calendar,
  DollarSign,
  Users,
  Star,
} from 'lucide-react'

type Props = {
  challenge: Challenge & { deleted_at?: string | null }
  onUpdate?: (id: number, changes: Partial<Challenge>) => void
  onRemove?: (id: number) => void
}

export default function ChallengeCard({
  challenge,
  onUpdate,
  onRemove,
}: Props) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  const orgName =
    challenge.organization.user.first_name +
    ' ' +
    challenge.organization.user.last_name

  const btn = 'h-7 px-3 text-[11px]'

  const statusColor =
    challenge.status === 'open'
      ? 'text-emerald-600'
      : challenge.status === 'pending'
      ? 'text-yellow-600'
      : challenge.status === 'cancelled'
      ? 'text-red-600'
      : 'text-gray-600'

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  /* ───────── Actions (OPTIMISTIC) ───────── */

  const updateStatus = async (status: Challenge['status']) => {
    if (!token) return

    onUpdate?.(challenge.id, { status })

    await axios.patch(
      `/admin/challenges/${challenge.id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const toggleFeatured = async () => {
    if (!token) return

    const next = !challenge.is_featured
    onUpdate?.(challenge.id, { is_featured: next })

    await axios.patch(
      `/admin/challenges/${challenge.id}/feature`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const softDelete = async () => {
    if (!token) return
    if (!confirm('Delete this challenge?')) return

    onRemove?.(challenge.id)

    await axios.delete(`/admin/challenges/${challenge.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  const restore = async () => {
    if (!token) return

    onRemove?.(challenge.id)

    await axios.patch(
      `/admin/challenges/${challenge.id}/restore`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const forceDelete = async () => {
    if (!token) return
    if (!confirm('This is permanent. Continue?')) return

    onRemove?.(challenge.id)

    await axios.delete(`/admin/challenges/${challenge.id}/force`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  /* ───────── Render ───────── */

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-[#0b1220] bg-gradient-to-b from-[#0b1220] to-[#0e1628] border border-white/5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {challenge.organization.logo ? (
            <Image
              src={`http://localhost:8000/storage/${challenge.organization.logo}`}
              alt="Organization logo"
              width={36}
              height={36}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center font-semibold text-sm">
              {orgName[0]}
            </div>
          )}
          <span className="text-xs text-gray-400">{orgName}</span>
        </div>

        {!challenge.deleted_at && (
          <Badge
            variant="secondary"
            className={`px-2 py-0.5 rounded-full text-[11px] border ${statusColor} border-current`}
          >
            {challenge.status}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold">{challenge.title}</h3>

      {/* Meta */}
      <div className="space-y-1 text-xs text-gray-400">
        <p className="flex items-center gap-2">
          <Calendar size={13} />
          {formatDate(challenge.deadline)}
        </p>

        {challenge.award && (
          <p className="flex items-center gap-2">
            <DollarSign size={13} />
            {challenge.award}
          </p>
        )}

        <p className="flex items-center gap-2">
          <Users size={13} />
          {challenge.participant_number} participants
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto flex justify-between gap-2">
        {challenge.deleted_at ? (
          <>
            <Button size="sm" className={btn} onClick={restore}>
              Restore
            </Button>
            <Button size="sm" variant="destructive" className={btn} onClick={forceDelete}>
              Delete Forever
            </Button>
          </>
        ) : challenge.status === 'open' ? (
          <>
            <Link href={`/dashboard/admin/challenges/${challenge.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button size="sm" className={btn} onClick={toggleFeatured}>
              <Star size={14} className={challenge.is_featured ? 'fill-yellow-400 text-yellow-400' : ''} />
            </Button>

            <Button size="sm" className={btn} variant="secondary" onClick={() => updateStatus('closed')}>
              Close
            </Button>

            <Button size="sm" className={btn} variant="destructive" onClick={() => updateStatus('cancelled')}>
              Cancel
            </Button>
          </>
        ) : challenge.status === 'cancelled' ? (
          <>
            <Link href={`/dashboard/admin/challenges/${challenge.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button size="sm" className={btn} onClick={() => updateStatus('open')}>
              Open
            </Button>

            <Button size="sm" variant="destructive" className={btn} onClick={softDelete}>
              Delete
            </Button>
          </>
        ) : challenge.status === 'pending' ? (
          <>
            <Link href={`/dashboard/admin/challenges/${challenge.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button size="sm" className={btn} onClick={() => updateStatus('open')}>
              Open
            </Button>

            <Button size="sm" variant="destructive" className={btn} onClick={() => updateStatus('cancelled')}>
              Cancel
            </Button>
          </>
        ) : challenge.status === 'closed' ? (
  <>
    <Link href={`/dashboard/admin/challenges/${challenge.id}`}>
      <Button size="sm" className={btn}>View</Button>
    </Link>

    <Button
      size="sm"
      className={btn}
      variant="secondary"
      onClick={() => updateStatus('cancelled')}
    >
      Cancel
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
  /* fallback – should never happen */
  null
)
}
      </div>
    </div>
  )
}
