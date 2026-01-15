'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Search, MessageSquare } from 'lucide-react'

type Mentor = {
  id: number
  name: string
  title: string
  profile_photo?: string | null
  industries: string[]
}

type Request = {
  id: number
  status: string
  mentor: {
    id: number
    user?: {
      first_name: string
      last_name: string
      profile_photo?: string | null
    }
    title?: string
  }
}

export default function MentorRequest() {
  const [view, setView] = useState<'browse' | 'requests'>('browse')
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<number | null>(null)

  useEffect(() => {
    fetchMentors()
  }, [])

  useEffect(() => {
    if (view === 'requests') fetchRequests()
  }, [view])

  const fetchMentors = async () => {
    try {
      const res = await axios.get('/mentors')
      setMentors(res.data)
    } catch {
      alert('Failed to load mentors')
    } finally {
      setLoading(false)
    }
  }

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/mentorship-requests/my')
      setRequests(res.data)
    } catch {
      alert('Failed to load requests')
    }
  }

  const sendRequest = async (mentorId: number) => {
    try {
      setSendingId(mentorId)
      await axios.post('/mentorship-requests', { mentor_id: mentorId })
      alert('Mentorship request sent')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send request')
    } finally {
      setSendingId(null)
    }
  }

  return (
    <div className="space-y-6 text-[#101828] dark:text-[#FAFAFA]">

      {/* Top Toggle */}
      <div className="flex items-center gap-2 bg-[#EEF2F7] dark:bg-[#0B1220] p-1 rounded-full w-fit">
        <Button
          size="sm"
          variant={view === 'browse' ? 'default' : 'ghost'}
          className="rounded-full flex gap-2"
          onClick={() => setView('browse')}
        >
          <Search size={16} />
          Browse Mentors
        </Button>

        <Button
          size="sm"
          variant={view === 'requests' ? 'default' : 'ghost'}
          className="rounded-full flex gap-2"
          onClick={() => setView('requests')}
        >
          <MessageSquare size={16} />
          My Requests ({requests.length})
        </Button>
      </div>

      {/* Browse Mentors */}
      {view === 'browse' && (
        <>
          {loading && <p className="text-sm text-[#6B7280]">Loading mentors...</p>}
          {!loading && !mentors.length && (
            <p className="text-sm text-[#6B7280]">No mentors available.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]"
              >
                <CardContent className="p-5 flex flex-col gap-4">

                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full border border-[#E2E8F0] dark:border-[#1F2937] overflow-hidden"
                    >
                      {mentor.profile_photo ? (
                        <Image
                          src={`http://localhost:8000/storage/${mentor.profile_photo}`}
                          alt={mentor.name}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </Button>

                    <div>
                      <h3 className="text-sm font-semibold">
                        {mentor.name}
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        {mentor.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {mentor.industries.length ? (
                      mentor.industries.map((i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-[#E0F2FE] dark:bg-[#082F49] text-[#0369A1] dark:text-[#7DD3FC]"
                        >
                          {i}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#6B7280]">
                        No industries
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Link href={`/mentors/${mentor.id}`} className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-[#E2E8F0] dark:border-[#1F2937]"
                      >
                        Know more
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                      disabled={sendingId === mentor.id}
                      onClick={() => sendRequest(mentor.id)}
                    >
                      {sendingId === mentor.id ? 'Sending...' : 'Request'}
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* My Requests */}
      {view === 'requests' && (
        <div className="space-y-3">
          {!requests.length && (
            <p className="text-sm text-[#6B7280]">
              You haven’t sent any mentorship requests yet.
            </p>
          )}

          {requests.map((req) => (
            <Card
              key={req.id}
              className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-[#E2E8F0] dark:border-[#1F2937] overflow-hidden"
                >
                  {req.mentor?.user?.profile_photo ? (
                    <Image
                      src={`http://localhost:8000/storage/${req.mentor.user.profile_photo}`}
                      alt="Mentor"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User size={16} />
                  )}
                </Button>

                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {req.mentor?.user?.first_name}{' '}
                    {req.mentor?.user?.last_name}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Status: {req.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
