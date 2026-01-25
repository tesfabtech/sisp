'use client'

import Image from 'next/image'
import Link from 'next/link'
import axios from '@/lib/axios'
import { FundingOpportunity, FundingStatus } from './types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  DollarSign,
  FileText,
  Star,
} from 'lucide-react'

type Props = {
  item: FundingOpportunity
  onUpdate?: (id: number, changes: Partial<FundingOpportunity>) => void
  onRemove?: (id: number) => void
}

export default function FundingCard({ item, onUpdate, onRemove }: Props) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  const btn = 'h-7 px-3 text-[11px]'

  const orgUser = item.organization?.user
  const orgName = orgUser
    ? `${orgUser.first_name} ${orgUser.last_name}`
    : 'Unknown organization'

  /* ───────── Actions (Optimistic UI) ───────── */

  const updateStatus = async (status: FundingStatus) => {
  if (!token) return

  // optimistic UI
  onUpdate?.(item.id, { status })

  await axios.patch(
    `/admin/funding/${item.id}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  )
}


  const toggleFeatured = async () => {
    if (!token) return
    onUpdate?.(item.id, { is_featured: !item.is_featured })

    await axios.patch(
      `/admin/funding/${item.id}/feature`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const softDelete = async () => {
    if (!token || !confirm('Delete this funding opportunity?')) return
    onRemove?.(item.id)

    await axios.delete(`/admin/funding/${item.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  const restore = async () => {
    if (!token) return
    onRemove?.(item.id)

    await axios.patch(
      `/admin/funding/${item.id}/restore`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const forceDelete = async () => {
    if (!token || !confirm('Permanent delete?')) return
    onRemove?.(item.id)

    await axios.delete(`/admin/funding/${item.id}/force`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  /* ───────── Render ───────── */

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-[#0b1220] border border-white/5 flex flex-col gap-4">

      {/* Top */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {item.organization?.logo ? (
            <Image
              src={`http://localhost:8000/storage/${item.organization.logo}`}
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

        {!item.deleted_at && (
          <Badge variant="secondary" className="capitalize">
            {item.status}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold leading-tight">{item.title}</h3>

      {/* Description */}
      <p className="text-xs text-gray-400">{item.short_description}</p>

      {/* Meta */}
      <div className="text-xs text-gray-400 space-y-1">
        <p className="flex items-center gap-2">
          <Calendar size={12} />
          Deadline: {new Date(item.deadline).toLocaleDateString()}
        </p>

        <p className="flex items-center gap-2">
          <DollarSign size={12} />
          Amount: {item.amount.toLocaleString()}
        </p>

        <p className="flex items-center gap-2">
          <FileText size={12} />
          Type: {item.funding_type}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2 flex-wrap">

        {/* Trashed */}
        {item.deleted_at ? (
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
        ) : item.status === 'pending' ? (
          <>
            <Link href={`/dashboard/admin/funding/${item.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button size="sm" className={btn} onClick={() => updateStatus('open')}>
              Open
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
        ) : item.status === 'open' ? (
          <>
            <Link href={`/dashboard/admin/funding/${item.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button size="sm" className={btn} onClick={() => updateStatus('closed')}>
              Close
            </Button>

            <Button
              size="sm"
              variant="destructive"
              className={btn}
              onClick={() => updateStatus('cancelled')}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              variant={item.is_featured ? 'default' : 'secondary'}
              className={btn}
              onClick={toggleFeatured}
            >
              <Star
                size={14}
                className={item.is_featured ? 'fill-yellow-400 text-yellow-400' : ''}
              />
            </Button>
          </>
        ) : (
          /* closed OR cancelled */
          <>
            <Link href={`/dashboard/admin/funding/${item.id}`}>
              <Button size="sm" className={btn}>View</Button>
            </Link>

            <Button size="sm" className={btn} onClick={() => updateStatus('open')}>
              Open
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
