'use client'

import Image from 'next/image'
import axios from '@/lib/axios'
import { motion } from 'framer-motion'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  ImageIcon,
  Building2,
  CheckCircle2,
  RotateCcw,
  Trash2,
} from 'lucide-react'

export default function StartupTrashCard({ startup }: { startup: any }) {
  const handleRestore = async () => {
    try {
      await axios.post(`/startups/${startup.id}/restore`)
      location.reload()
    } catch {
      alert('Failed to restore startup')
    }
  }

  const handleDeletePermanently = async () => {
    if (!confirm('This will permanently delete the startup. Continue?')) return

    try {
      await axios.delete(`/startups/${startup.id}/force`)
      location.reload()
    } catch {
      alert('Failed to delete startup permanently')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="w-82.5 shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937] shadow-lg opacity-90">
        {/* ================= COVER IMAGE ================= */}
        <div className="relative h-47.5">
          {startup.cover_image ? (
            <Image
              src={`http://localhost:8000/storage/${startup.cover_image}`}
              alt={startup.name}
              fill
              className="object-cover grayscale"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[#EEF2F7] dark:bg-[#0B1220] flex items-center justify-center">
              <ImageIcon className="text-[#6B7280]" />
            </div>
          )}

          <div className="absolute top-4 right-4">
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-[#6B7280] text-white shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Trashed
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
                  className="object-cover grayscale"
                  unoptimized
                />
              ) : (
                <Building2 className="w-full h-full p-2 text-[#6B7280]" />
              )}
            </div>

            <h3 className="text-xl font-bold">{startup.name}</h3>
          </div>

          <Badge className="mt-3 mb-4 bg-[#E5E7EB] text-[#374151] dark:bg-[#1F2937] dark:text-[#D1D5DB]">
            {startup.industry || 'Startup'}
          </Badge>

          <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">
            {startup.tagline}
          </p>

          {/* ================= ACTIONS ================= */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRestore}
              className="flex items-center gap-1"
            >
              <RotateCcw size={14} />
              Restore
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeletePermanently}
              className="flex items-center gap-1"
            >
              <Trash2 size={14} />
              Delete Permanently
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
