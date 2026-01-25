'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Layers,
  Building2,
} from 'lucide-react'
import { FundingOpportunity } from '@/components/admin/funding/types'

export default function FundingViewPage() {
  const { id } = useParams()
  const router = useRouter()

  const [funding, setFunding] = useState<FundingOpportunity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)

    axios
      .get(`/admin/funding/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setFunding(res.data.data))
      .finally(() => setLoading(false))
  }, [id])

  /* ───────── Loading Skeleton ───────── */
  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6 max-w-4xl mx-auto">
            <div className="rounded-3xl p-8 bg-white dark:bg-[#0b1220] space-y-4 animate-pulse">
              <div className="h-5 w-32 bg-gray-300/20 rounded" />
              <div className="h-8 w-2/3 bg-gray-300/20 rounded" />
              <div className="h-4 w-full bg-gray-300/20 rounded" />
              <div className="h-4 w-5/6 bg-gray-300/20 rounded" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!funding) return null

  const orgUser = funding.organization?.user
  const orgName = orgUser
    ? `${orgUser.first_name} ${orgUser.last_name}`
    : 'Unknown organization'

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Back */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Back to funding
          </Button>

          {/* Card */}
          <div className="rounded-3xl p-8 bg-white dark:bg-[#0b1220] space-y-6 shadow-lg">

            {/* Organization */}
            <div className="flex items-center gap-4">
              {funding.organization?.logo ? (
                <Image
                  src={`http://localhost:8000/storage/${funding.organization.logo}`}
                  alt="Organization logo"
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-gray-700 flex items-center justify-center text-xl font-semibold">
                  {orgName[0]}
                </div>
              )}

              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Building2 size={14} />
                {orgName}
              </p>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-semibold leading-tight">
              {funding.title}
            </h1>

            {/* Short description */}
            <p className="text-sm text-gray-400">
              {funding.short_description}
            </p>

            {/* Meta (STACKED) */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <Calendar size={16} />
                <span>
                  Deadline:{' '}
                  {new Date(funding.deadline).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign size={16} />
                <span>
                  Amount: {funding.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Layers size={16} />
                <span className="capitalize">
                  {funding.funding_type} · {funding.status}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-gray-400">
                {funding.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
