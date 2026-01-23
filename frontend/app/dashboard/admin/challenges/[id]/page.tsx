'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  DollarSign,
  Users,
  Layers,
  Building2,
  ArrowLeft,
  Star,
} from 'lucide-react'

export default function ChallengeViewPage() {
  const { id } = useParams()
  const router = useRouter()

  const [challenge, setChallenge] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  /* ───────── Fetch challenge (ADMIN AUTH) ───────── */
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)

    axios
      .get(`/admin/challenges/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setChallenge(res.data))
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
          <div className="mx-auto max-w-5xl space-y-6">

            {/* Loading */}
            {loading && (
              <div className="rounded-3xl border border-white/5 p-8 space-y-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gray-300/20" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-300/20 rounded" />
                    <div className="h-6 w-72 bg-gray-300/20 rounded" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 w-1/3 bg-gray-300/20 rounded" />
                  <div className="h-4 w-1/2 bg-gray-300/20 rounded" />
                  <div className="h-4 w-2/3 bg-gray-300/20 rounded" />
                </div>
              </div>
            )}

            {/* Content */}
            {!loading && challenge && (
              <>
                {/* Back */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  onClick={() => router.back()}
                >
                  <ArrowLeft size={16} />
                  Back to challenges
                </Button>

                {/* Card */}
                <div className="rounded-3xl bg-linear-to-b from-[#0b1220] to-[#0e1628] border border-white/5 p-8 shadow-2xl">

                  {/* Top */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                      {challenge.organization.logo ? (
                        <Image
                          src={`http://localhost:8000/storage/${challenge.organization.logo}`}
                          alt="Organization logo"
                          width={56}
                          height={56}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-gray-700 flex items-center justify-center text-xl font-semibold">
                          {challenge.organization.user.first_name[0]}
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Building2 size={14} />
                          {challenge.organization.user.first_name}{' '}
                          {challenge.organization.user.last_name}
                        </p>
                        <h1 className="text-3xl font-semibold leading-tight mt-1">
                          {challenge.title}
                        </h1>
                        <p className="mt-1 text-sm text-[#475467] dark:text-slate-400">
                          {challenge.short_description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {challenge.is_featured && (
                        <Badge variant="secondary" className="gap-1">
                          <Star size={12} />
                          Featured
                        </Badge>
                      )}
                      <Badge className="capitalize">
                        {challenge.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 text-sm text-[#475467] dark:text-slate-400 mt-6 mb-6">
                    <div className="p-2 flex items-center gap-3">
                      <Calendar size={18} className="text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Deadline</p>
                        <p className="text-sm font-medium">
                          {formatDate(challenge.deadline)}
                        </p>
                      </div>
                    </div>

                    <div className="p-2 flex items-center gap-3">
                      <DollarSign size={18} className="text-emerald-400" />
                      <div>
                        <p className="text-xs text-gray-400">Award</p>
                        <p className="text-sm font-medium">
                          {challenge.award ?? '—'}
                        </p>
                      </div>
                    </div>

                    <div className="p-2 flex items-center gap-3">
                      <Users size={18} className="text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-400">Participants</p>
                        <p className="text-sm font-medium">
                          {challenge.participant_number}
                        </p>
                      </div>
                    </div>

                    <div className="p-2 flex items-center gap-3 text-sm">
                      <Layers size={14} />
                      <p className="text-gray-400">Type</p>
                      <p className="font-medium capitalize">
                        {challenge.type}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold">
                      Description
                    </h2>
                    <p className="text-sm leading-relaxed text-[#475467] dark:text-slate-400">
                      {challenge.description || 'No description provided.'}
                    </p>
                  </div>

                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
