'use client'

import Image from 'next/image'
import Link from 'next/link'
import axios from '@/lib/axios'
import { KnowledgeHub } from './types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Trash2, Pencil, Eye, RotateCcw } from 'lucide-react'

type Props = {
  item: KnowledgeHub
  onUpdate?: (id: number, changes: Partial<KnowledgeHub>) => void
  onRemove?: (id: number) => void
}

export default function KnowledgeCard({
  item,
  onUpdate,
  onRemove,
}: Props) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  const btn = 'h-7 px-3 text-[11px]'
  const isTrashed = Boolean(item.deleted_at)

  /* ───────── Existing Actions (UNCHANGED) ───────── */

  const toggleFeatured = async () => {
    if (!token) return

    const next = !item.is_featured
    onUpdate?.(item.id, { is_featured: next })

    await axios.patch(
      `/admin/knowledge/${item.id}/feature`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const softDelete = async () => {
    if (!token) return
    if (!confirm('Delete this article?')) return

    onRemove?.(item.id)

    await axios.delete(`/admin/knowledge/${item.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  /* ───────── Trashed Actions (NEW, ISOLATED) ───────── */

  const restore = async () => {
    if (!token) return

    await axios.patch(
      `/admin/knowledge/${item.id}/restore`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    onRemove?.(item.id)
  }

  const forceDelete = async () => {
    if (!token) return
    if (!confirm('Delete permanently? This cannot be undone.')) return

    await axios.delete(`/admin/knowledge/${item.id}/force`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    onRemove?.(item.id)
  }

  /* ───────── Render ───────── */

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-[#0b1220] border border-white/5 flex flex-col gap-4">

      {/* Image */}
      {item.image && (
        <Image
          src={`http://localhost:8000/storage/${item.image}`}
          alt={item.title}
          width={400}
          height={200}
          className="rounded-xl object-cover"
          unoptimized
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-base leading-tight">
          {item.title}
        </h3>

        {!isTrashed && (
          <button
            onClick={toggleFeatured}
            className={`p-2 rounded-md transition ${
              item.is_featured
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Star size={16} />
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Badge variant="secondary">{item.type}</Badge>
        <span>{item.max_read_time} min read</span>
        <Badge
          variant={item.status === 'published' ? 'default' : 'secondary'}
        >
          {item.status}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-3">
        {item.short_description}
      </p>

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        {!isTrashed ? (
          <>
            <Link href={`/dashboard/admin/knowledge/${item.id}`}>
              <Button size="sm" className={btn}>
                <Eye size={14} />
              </Button>
            </Link>

            <Link href={`/dashboard/admin/knowledge/${item.id}/edit`}>
              <Button size="sm" className={btn} variant="secondary">
                <Pencil size={14} />
              </Button>
            </Link>

            <Button
              size="sm"
              className={btn}
              variant="destructive"
              onClick={softDelete}
            >
              <Trash2 size={14} />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              className={btn}
              variant="secondary"
              onClick={restore}
            >
              <RotateCcw size={14} />
            </Button>

            <Button
              size="sm"
              className={btn}
              variant="destructive"
              onClick={forceDelete}
            >
              <Trash2 size={14} />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
