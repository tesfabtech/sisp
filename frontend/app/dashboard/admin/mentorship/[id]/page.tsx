'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import { Mentor } from '@/components/admin/mentorship/types'
import axios from '@/lib/axios'
import { Badge } from '@/components/ui/badge'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'


export default function MentorViewPage() {
  const { id } = useParams()
  const router = useRouter()
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  useEffect(() => {
    if (!token || !id) return

    setLoading(true)
    axios
      .get(`/admin/mentors/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMentor(res.data.mentor))
      .finally(() => setLoading(false))
  }, [id, token])

  const statusColor =
    mentor?.status === 'approved'
      ? 'bg-emerald-100 text-emerald-600'
      : mentor?.status === 'pending'
      ? 'bg-yellow-100 text-yellow-600'
      : 'bg-red-100 text-red-600'

  const availabilityColor = mentor?.is_available ? 'bg-green-500' : 'bg-yellow-500'

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 max-w-5xl mx-auto space-y-6">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={16} /> Back
          </Button>

          {loading && <p className="text-sm text-gray-400">Loading mentor...</p>}
          {!loading && !mentor && <p className="text-sm text-gray-400">Mentor not found.</p>}

          {mentor && (
            <>
              {/* Profile Card */}
              <div className="relative rounded-2xl overflow-hidden border bg-white dark:bg-[#0b1220] shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
                {mentor.profile_image ? (
                  <Image
                    src={`http://localhost:8000/storage/${mentor.profile_image}`}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                    alt="Mentor"
                    unoptimized
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-semibold">
                    {mentor.user.first_name[0]}
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">{mentor.user.first_name} {mentor.user.last_name}</h1>
                    {/* Availability dot */}
                    <span className={`h-3 w-3 rounded-full ${availabilityColor}`}></span>
                  </div>

                  <p className="text-gray-500 flex items-center gap-1 text-sm">
                    <Mail size={14} /> {mentor.user.email}
                  </p>

                  {mentor.title && <p className="text-sm text-muted-foreground">{mentor.title}</p>}

                  {mentor.bio && (
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {mentor.bio}
                    </div>
                  )}

                  {/* Status */}
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor}`}>
                    {mentor.status}
                  </span>
                </div>
              </div>

              {/* Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expertise */}
                <div className="rounded-xl border p-4 bg-white dark:bg-[#0b1220]">
                  <h3 className="text-sm font-semibold mb-2">Expertise</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {mentor.expertise?.length ? (
                      mentor.expertise.map((item, idx) => <li key={idx}>{item}</li>)
                    ) : (
                      <li className="text-gray-400">No expertise listed</li>
                    )}
                  </ul>
                </div>

                {/* Industries */}
                <div className="rounded-xl border p-4 bg-white dark:bg-[#0b1220]">
                  <h3 className="text-sm font-semibold mb-2">Industries</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {mentor.industries?.length ? (
                      mentor.industries.map((item, idx) => <li key={idx}>{item}</li>)
                    ) : (
                      <li className="text-gray-400">No industries listed</li>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
