'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'

import Sidebar from '@/components/startup/side_bar'
import Header from '@/components/startup/header'
import StartupTrashCard from '@/components/startup/startup_profile/startup_trash_card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function StartupTrashPage() {
  const router = useRouter()
  const [startups, setStartups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrashedStartups = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('You are not authenticated. Please login.')
        router.push('/login')
        return
      }

    const res = await axios.get('/startups/trash', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

      setStartups(res.data.data ?? [])
    } catch (err: any) {
      console.error('Failed to fetch trashed startups', err.response?.data ?? err)
      alert('Failed to fetch trashed startups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrashedStartups()
  }, [])

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] dark:bg-[#0B1220]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header + Back */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Trashed Startups</h1>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/startup/startup_profile')}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Startups
              </Button>
            </div>

            {/* Content */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 w-full rounded-2xl bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            ) : startups.length === 0 ? (
              <p className="text-sm text-[#475467] dark:text-gray-400">Trash is empty.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {startups.map((startup) => (
                  <StartupTrashCard
                    key={startup.id}
                    startup={startup}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
