'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from '@/lib/axios'

import Header from '@/components/startup/header'
import Sidebar from '@/components/startup/side_bar'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  ArrowLeft,
  Globe,
  MapPin,
  Users,
  Calendar,
  Building2,
  Video,
} from 'lucide-react'

const getYouTubeEmbedUrl = (url: string) => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
  const match = url.match(regex)
  if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`
  return url
}

export default function StartupDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [startup, setStartup] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get(`/startups/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStartup(res.data))
      .finally(() => setLoading(false))
  }, [id])

  // Skeleton loading
  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar />
        <div className="flex-1 animate-pulse p-6 space-y-6 max-w-7xl mx-auto">
          <div className="h-10 w-32 bg-gray-300 rounded" />
          <div className="h-72 bg-gray-200 rounded" />
          <div className="h-6 w-48 bg-gray-300 rounded" />
          <div className="h-16 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!startup) return <p className="p-6">Startup not found</p>

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="max-w-7xl mx-auto p-6 space-y-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Cover */}
          <Card className="overflow-hidden">
            <div className="relative h-72 bg-muted">
              {startup.cover_image && (
                <Image
                  src={`http://localhost:8000/storage/${startup.cover_image}`}
                  alt={startup.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Logo + Name */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted">
                    {startup.logo ? (
                      <Image
                        src={`http://localhost:8000/storage/${startup.logo}`}
                        alt={startup.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <Building2 className="w-full h-full p-3 text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold">{startup.name}</h1>
                    <p className="text-sm text-muted-foreground">{startup.tagline}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {startup.industry && <Badge>{startup.industry}</Badge>}
                {startup.stage && <Badge variant="outline">{startup.stage}</Badge>}
              </div>
            </CardContent>
          </Card>

          {/* About */}
          {startup.description && (
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold">About the Startup</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {startup.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-6">
            {startup.problem_statement && (
              <Card>
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold">Problem</h3>
                  <p className="text-sm text-muted-foreground">{startup.problem_statement}</p>
                </CardContent>
              </Card>
            )}

            {startup.solution_statement && (
              <Card>
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold">Solution</h3>
                  <p className="text-sm text-muted-foreground">{startup.solution_statement}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Details */}
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              {startup.website && (
                <div className="flex items-center gap-3">
                  <Globe size={18} />
                  <a
                    href={startup.website}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}

              {startup.location && (
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  {startup.location}
                </div>
              )}

              {startup.team_size && (
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  Team size: {startup.team_size}
                </div>
              )}

              {startup.founded_year && (
                <div className="flex items-center gap-3">
                  <Calendar size={18} />
                  Founded: {startup.founded_year}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video */}
          {startup.video_url && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Video size={18} /> Pitch Video
                </h3>
                <iframe
                  className="w-full h-80 rounded-xl"
                  src={getYouTubeEmbedUrl(startup.video_url)}
                  title="Startup Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
