'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import { Startup } from '@/components/admin/startups/types'
import axios from '@/lib/axios'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, Briefcase, ArrowLeft, User, Mail } from 'lucide-react'

/* ───────── Video helper ───────── */
const getYouTubeEmbedUrl = (url: string) => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
  const match = url.match(regex)
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  return url
}

export default function AdminStartupViewPage() {
  const { id } = useParams()
  const router = useRouter()
  const [startup, setStartup] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token || !id) return

    axios
      .get(`/admin/startups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setStartup(res.data.startup))
      .catch(() => console.error('Failed to fetch startup'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 max-w-6xl mx-auto space-y-6">
          {/* ───────── Back Button ───────── */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          {loading && (
            <p className="text-sm text-gray-400">Loading startup...</p>
          )}

          {!loading && !startup && (
            <p className="text-sm text-gray-400">Startup not found.</p>
          )}

          {startup && (
            <>
              {/* ───────── Hero Section ───────── */}
              <div className="relative rounded-2xl overflow-hidden border bg-white dark:bg-[#0b1220] shadow-sm">
                {/* Cover */}
                {startup.cover_image && (
                  <Image
                    src={`http://localhost:8000/storage/${startup.cover_image}`}
                    alt="Cover image"
                    width={1400}
                    height={500}
                    className="w-full h-75 object-cover"
                    unoptimized
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {startup.logo && (
                      <Image
                        src={`http://localhost:8000/storage/${startup.logo}`}
                        alt={startup.name}
                        width={64}
                        height={64}
                        className="rounded-xl bg-white p-1"
                        unoptimized
                      />
                    )}

                    <div>
                      <h1 className="text-2xl font-semibold text-white">
                        {startup.name}
                      </h1>

                      <div className="flex items-center gap-4 text-sm text-gray-200 mt-1">
                        {startup.stage && (
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} />
                            {startup.stage}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarDays size={14} />
                          {new Date(startup.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-xs backdrop-blur border-white/30 ${
                      startup.status === 'approved'
                        ? 'text-emerald-300'
                        : startup.status === 'pending'
                        ? 'text-yellow-300'
                        : 'text-red-300'
                    }`}
                  >
                    {startup.status}
                  </Badge>
                </div>
              </div>

              {/* ───────── Content Grid ───────── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Tagline */}
                  {startup.tagline && (
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      {startup.tagline}
                    </p>
                  )}

                  {/* Video */}
                  {startup.video_url && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">Pitch Video</h3>
                      <iframe
                        className="w-full h-80 rounded-xl border border-gray-200 dark:border-gray-800"
                        src={getYouTubeEmbedUrl(startup.video_url)}
                        title="Startup Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Description */}
                  {startup.description && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">Description</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {startup.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div className="rounded-xl border bg-white dark:bg-[#0b1220] p-4 space-y-3">
                    <h3 className="text-sm font-semibold">Startup Info</h3>

                    {startup.industry && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Industry</span>
                        <span>{startup.industry}</span>
                      </div>
                    )}

                    {startup.location && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Location</span>
                        <span>{startup.location}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span>{startup.status}</span>
                    </div>

                    {/* ───────── Owner Info ───────── */}
                    {startup.founder && (
                      <div className="mt-4 space-y-1">
                        <h3 className="text-sm font-semibold">Owner</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <User size={14} />
                          {startup.founder.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} />
                          {startup.founder.email}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
