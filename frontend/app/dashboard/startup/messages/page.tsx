'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Header from '@/components/startup/header'
import Sidebar from '@/components/startup/side_bar'
import Messages from '@/components/startup/messages'

type Startup = {
  id: number
  name: string
  mentor: Mentor | null
}

type Mentor = {
  id: number
  name: string
  profile_image?: string
}

export default function MessagesPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null)
  const [mentor, setMentor] = useState<Mentor | null>(null)

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    try {
      const res = await axios.get('/my-startups-with-approved-mentors')
      setStartups(res.data)
      if (res.data.length) {
        setSelectedStartup(res.data[0])
        setMentor(res.data[0].mentor)
      }
    } catch {
      alert('Failed to load startups')
    }
  }

  const handleStartupClick = (s: Startup) => {
    setSelectedStartup(s)
    setMentor(s.mentor)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main dashboard sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Dashboard header */}
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar: Startups with approved mentors */}
          <aside className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              My Startups
            </h2>
            <ul className="space-y-2">
              {startups.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => handleStartupClick(s)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedStartup?.id === s.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat panel */}
          <div className="flex-1 overflow-hidden">
            {selectedStartup ? (
              <Messages startup={selectedStartup} mentor={mentor} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a startup to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
