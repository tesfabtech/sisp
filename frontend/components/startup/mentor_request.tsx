'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, MessageSquare } from 'lucide-react'

type Mentor = {
  id: number
  name: string
  title: string
  profile_photo?: string | null
  profile_image?: string | null
  industries: string[]
}

type Startup = {
  id: number
  name: string
}

type Request = {
  id: number
  status: string
  startup: {
    id: number
    name: string
  }
  mentor: {
    id: number
    profile_image?: string | null
    user?: {
      first_name?: string
      last_name?: string
    }
  }
}

export default function MentorRequest() {
  const [view, setView] = useState<'browse' | 'requests'>('browse')
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [startups, setStartups] = useState<Startup[]>([])
  const [selectedStartup, setSelectedStartup] = useState<number | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<number | null>(null)

  useEffect(() => {
    fetchMentors()
    fetchStartups()
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

  const fetchStartups = async () => {
    try {
      const res = await axios.get('/my-startups')
      setStartups(res.data)
    } catch {
      alert('Failed to load startups')
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
    if (!selectedStartup) {
      alert('Please select a startup first')
      return
    }
    try {
      setSendingId(mentorId)
      await axios.post('/mentorship-requests', {
        mentor_id: mentorId,
        startup_id: selectedStartup,
      })
      alert('Mentorship request sent')
      fetchRequests()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send request')
    } finally {
      setSendingId(null)
    }
  }

  // Helper to get initials from full name
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    const firstInitial = parts[0]?.[0] ?? '?'
    const lastInitial = parts[1]?.[0] ?? ''
    return (firstInitial + lastInitial).toUpperCase()
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">

      {/* Top Toggle */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-full w-fit">
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

      {/* Startup Selector */}
      {view === 'browse' && (
        <div className="max-w-sm">
          <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Select Startup
          </label>
          <select
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={selectedStartup ?? ''}
            onChange={(e) => setSelectedStartup(Number(e.target.value))}
          >
            <option value="" disabled>Choose a startup</option>
            {startups.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Browse Mentors */}
      {view === 'browse' && (
        <>
          {loading && <p className="text-sm text-gray-500">Loading mentors...</p>}
          {!loading && !mentors.length && (
            <p className="text-sm text-gray-500">No mentors available.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => {
              const avatar = mentor.profile_photo || mentor.profile_image || null
              const initials = getInitials(mentor.name ?? '')

              return (
                <Card
                  key={mentor.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow rounded-xl"
                >
                  <CardContent className="p-5 flex flex-col gap-4">

                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="rounded-full border overflow-hidden">
                        {avatar ? (
                          <Image
                            src={`http://localhost:8000/storage/${avatar}`}
                            alt={mentor.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {initials}
                          </div>
                        )}
                      </Button>

                      <div>
                        <h3 className="text-sm font-semibold">{mentor.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{mentor.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentor.industries.length ? (
                        mentor.industries.map((i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                          >
                            {i}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No industries</span>
                      )}
                    </div>

                    <div className="mt-auto flex gap-2">
                      <Link href={`/mentors/${mentor.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          Know more
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        disabled={!selectedStartup || sendingId === mentor.id}
                        onClick={() => sendRequest(mentor.id)}
                      >
                        {sendingId === mentor.id ? 'Sending...' : 'Request'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* My Requests */}
      {view === 'requests' && (
        <div className="space-y-3">
          {!requests.length && (
            <p className="text-sm text-gray-500">You haven’t sent any mentorship requests yet.</p>
          )}

          {requests.map((req) => {
            const avatar = req.mentor?.profile_image ?? null
            const firstName = req.mentor?.user?.first_name ?? ''
            const lastName = req.mentor?.user?.last_name ?? ''
            const initials = getInitials(firstName + ' ' + lastName)

            return (
              <Card key={req.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow rounded-xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {avatar ? (
                      <Image
                        src={`http://localhost:8000/storage/${avatar}`}
                        alt={firstName + ' ' + lastName}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {initials}
                      </div>
                    )}
                  </Button>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{firstName} {lastName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Startup: {req.startup?.name} · Status: {req.status}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
