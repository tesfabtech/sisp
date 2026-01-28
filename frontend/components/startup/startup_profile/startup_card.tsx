'use client'

import Image from 'next/image'
import Link from 'next/link'
import axios from '@/lib/axios'
import { motion } from 'framer-motion'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  ImageIcon,
  Building2,
  CheckCircle2,
  ArrowRight,
  Trash2,
  Pencil,
} from 'lucide-react'

type Props = {
  startup: any
  onDeleted?: (id: number) => void // optional callback to remove from parent state
}

export default function StartupCard({ startup, onDeleted }: Props) {
  const handleDelete = async () => {
    if (!confirm('Move this startup to trash?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      await axios.delete(`/startups/${startup.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Startup moved to trash')

      // Call parent callback if provided, else fallback to reload
      if (onDeleted) {
        onDeleted(startup.id)
      } else {
        location.reload()
      }
    } catch {
      alert('Failed to move startup to trash')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="w-82.5 shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937] shadow-lg">
        {/* ================= COVER IMAGE ================= */}
        <div className="relative h-47.5">
          {startup.cover_image ? (
            <Image
              src={`http://localhost:8000/storage/${startup.cover_image}`}
              alt={startup.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[#EEF2F7] dark:bg-[#0B1220] flex items-center justify-center">
              <ImageIcon className="text-[#6B7280]" />
            </div>
          )}

          <div className="absolute top-4 right-4">
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-[#14B8A6] text-white shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Submitted
            </span>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#EEF2F7] dark:bg-[#0B1220]">
              {startup.logo ? (
                <Image
                  src={`http://localhost:8000/storage/${startup.logo}`}
                  alt="Logo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Building2 className="w-full h-full p-2 text-[#6B7280]" />
              )}
            </div>

            <h3 className="text-xl font-bold">{startup.name}</h3>
          </div>

          <Badge className="mt-3 mb-4 bg-[#DBEAFE] text-[#1D4ED8] dark:bg-[#1E3A8A]/30 dark:text-[#93C5FD]">
            {startup.industry || 'Startup'}
          </Badge>

          <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">
            {startup.tagline}
          </p>

          {/* ================= ACTIONS ================= */}
          <div className="mt-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/startup/${startup.id}`}
                className="flex items-center text-[#3B82F6] font-medium text-sm group"
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link href={`/dashboard/startup/${startup.id}/edit`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Pencil size={14} />
                  Edit
                </Button>
              </Link>
            </div>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-1"
            >
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
