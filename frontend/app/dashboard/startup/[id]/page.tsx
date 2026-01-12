'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from '@/lib/axios'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'


const getYouTubeEmbedUrl = (url: string) => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const match = url.match(regex);
  if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
  return url; // fallback for non-YouTube URLs
};
export default function StartupDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [startup, setStartup] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get(`/startups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setStartup(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-6">Loading...</p>
  if (!startup) return <p className="p-6">Startup not found</p>

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Cover Image */}
      <div className="relative h-72 rounded-2xl overflow-hidden">
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

      {/* Main Card */}
      <Card>
        <CardContent className="p-6 space-y-4">

          {/* Logo + Name */}
          <div className="flex items-center gap-4">
            {startup.logo && (
              <Image
                src={`http://localhost:8000/storage/${startup.logo}`}
                alt={startup.name}
                width={64}
                height={64}
                className="rounded-xl object-cover"
                unoptimized
              />
            )}

            <div>
              <h1 className="text-2xl font-bold">{startup.name}</h1>
              <p className="text-gray-500">{startup.tagline}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-3 flex-wrap">
            {startup.industry && (
              <Badge>{startup.industry}</Badge>
            )}
            {startup.stage && (
              <Badge variant="secondary">{startup.stage}</Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300">
            {startup.description}
          </p>

          {/* Problem */}
          {startup.problem_statement && (
            <>
              <h3 className="font-semibold">Problem</h3>
              <p>{startup.problem_statement}</p>
            </>
          )}

          {/* Solution */}
          {startup.solution_statement && (
            <>
              <h3 className="font-semibold">Solution</h3>
              <p>{startup.solution_statement}</p>
            </>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
            <div><strong>Location:</strong> {startup.location}</div>
            <div><strong>Team:</strong> {startup.team_size}</div>
            <div><strong>Founded:</strong> {startup.founded_year}</div>
            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                className="text-blue-600"
              >
                Website →
              </a>
            )}
          </div>

        </CardContent>
      </Card>

{/* Video Section */}
// Usage in JSX:
{startup.video_url && (
  <iframe
    className="w-full h-80 rounded-xl"
    src={getYouTubeEmbedUrl(startup.video_url)}
    title="Startup Video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
)}



    </div>
  )
}
