'use client'

import { Event } from './types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import axios from '@/lib/axios'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  RotateCcw,
  Trash2,
  Star,
} from 'lucide-react'

type Props = {
  event: Event & { deleted_at?: string | null }
  onUpdate?: (id: number, changes: Partial<Event>) => void
  onRemove?: (id: number) => void
}

export default function EventCard({ event, onUpdate, onRemove }: Props) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  const orgName =
    event.organization.user.first_name +
    ' ' +
    event.organization.user.last_name

  const btn = 'h-7 px-3 text-[11px]'

  /* ───────── Actions ───────── */

  const updateStatus = async (status: Event['status']) => {
    if (!token) return
    onUpdate?.(event.id, { status })

    await axios.patch(
      `/admin/events/${event.id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const toggleFeatured = async () => {
    if (!token) return
    onUpdate?.(event.id, {
      is_featured: !event.is_featured,
    })

    await axios.patch(
      `/admin/events/${event.id}/feature`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const softDelete = async () => {
    if (!token || !confirm('Delete this event?')) return
    onRemove?.(event.id)

    await axios.delete(`/admin/events/${event.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  const restore = async () => {
    if (!token) return
    onRemove?.(event.id)

    await axios.patch(
      `/admin/events/${event.id}/restore`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const forceDelete = async () => {
    if (!token || !confirm('Permanent delete?')) return
    onRemove?.(event.id)

    await axios.delete(`/admin/events/${event.id}/force`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  /* ───────── Render ───────── */

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-[#0b1220] border border-white/5 flex flex-col gap-4">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {event.organization.logo ? (
            <Image
              src={`http://localhost:8000/storage/${event.organization.logo}`}
              alt="Organization logo"
              width={36}
              height={36}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">
              {orgName[0]}
            </div>
          )}

          <span className="text-xs text-gray-400">{orgName}</span>
        </div>

        {!event.deleted_at && (
          <Badge variant="secondary" className="capitalize">
            {event.status}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold leading-tight">{event.title}</h3>

      {/* Description */}
      <p className="text-xs text-gray-400">{event.short_description}</p>

      {/* Meta */}
      <div className="text-xs text-gray-400 space-y-1">
        <p className="flex items-center gap-2">
          <Calendar size={12} />
          {new Date(event.event_datetime).toLocaleString()}
        </p>

        {event.location && (
          <p className="flex items-center gap-2">
            <MapPin size={12} />
            {event.location}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto flex justify-between gap-2 flex-wrap">
        {event.deleted_at ? (
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
        ) : event.status === 'pending' ? (
          <>
            <Link href={`/dashboard/admin/events/${event.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button size="sm" className={btn} onClick={() => updateStatus('published')}>
              Publish
            </Button>

            <Button
              size="sm"
              variant="destructive"
              className={btn}
              onClick={() => updateStatus('cancelled')}
            >
              Cancel
            </Button>
          </>
        ) : event.status === 'published' ? (
          <>
            <Link href={`/dashboard/admin/events/${event.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button size="sm" className={btn} onClick={() => updateStatus('completed')}>
              Complete
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className={btn}
              onClick={() => updateStatus('cancelled')}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              variant={event.is_featured ? 'default' : 'secondary'}
              className={btn}
              onClick={toggleFeatured}
            >
              <Star
                size={14}
                className={event.is_featured ? 'fill-yellow-400 text-yellow-400' : ''}
              />
            </Button>
          </>
        ) : event.status === 'cancelled' ? (
          <>
            <Link href={`/dashboard/admin/events/${event.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button size="sm" className={btn} onClick={() => updateStatus('published')}>
              Publish
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
          /* completed */
          <>
            <Link href={`/dashboard/admin/events/${event.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button
              size="sm"
              variant="secondary"
              className={btn}
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
        )}
      </div>
    </div>
  )
}
