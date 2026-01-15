'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Briefcase } from 'lucide-react'
import Link from 'next/link'

type Startup = {
  id: number
  name: string
  stage?: string
  description?: string
  industries?: string[]
  logo?: string | null
}

type MentorshipRequest = {
  id: number
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  startup: Startup
}

export default function MentorRequests() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<number | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/mentorship-requests/mentor')
      setRequests(res.data)
    } catch {
      alert('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (
    id: number,
    status: 'accepted' | 'rejected'
  ) => {
    try {
      setActionId(id)
      await axios.patch(`/mentorship-requests/${id}`, { status })
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status } : r
        )
      )
    } catch {
      alert('Failed to update request')
    } finally {
      setActionId(null)
    }
  }

  if (loading) return <p>Loading requests...</p>

  if (!requests.length) {
    return (
      <p className="text-muted-foreground">
        No mentorship requests yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <Card
          key={req.id}
          className="p-6 bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {req.startup.logo && (
                <Image
                  src={`http://localhost:8000/storage/${req.startup.logo}`}
                  alt={req.startup.name}
                  width={36}
                  height={36}
                  className="rounded"
                  unoptimized
                />
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                    {req.startup.name}
                  </h3>

                  <Badge
                    variant="outline"
                    className={
                      req.status === 'pending'
                        ? 'border-yellow-400 text-yellow-600'
                        : req.status === 'accepted'
                        ? 'border-green-400 text-green-600'
                        : 'border-red-400 text-red-600'
                    }
                  >
                    {req.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  {req.startup.stage && (
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {req.startup.stage}
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <Link href={`/dashboard/mentor/requests/${req.id}`}>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </div>

          {/* Tags */}
          {req.startup.industries?.length && (
            <div className="flex flex-wrap gap-2 mt-4">
              {req.startup.industries.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          {req.startup.description && (
            <p className="text-sm text-muted-foreground mt-4 max-w-4xl">
              {req.startup.description}
            </p>
          )}

          {/* Actions */}
          {req.status === 'pending' && (
            <div className="flex justify-end gap-4 mt-6">
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={actionId === req.id}
                onClick={() => updateStatus(req.id, 'accepted')}
              >
                Accept
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
                disabled={actionId === req.id}
                onClick={() => updateStatus(req.id, 'rejected')}
              >
                Decline
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
