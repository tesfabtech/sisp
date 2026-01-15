'use client'

import MentorSidebar from '@/components/mentor/sidebar'
import MentorHeader from '@/components/mentor/header'
import MentorRequests from '@/components/mentor/requests'

export default function MentorRequestsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <MentorSidebar />

      <div className="flex-1 flex flex-col">
        <MentorHeader />

        <main className="p-6">
          <h1 className="text-xl font-semibold mb-6">
            Mentorship Requests
          </h1>

          <MentorRequests />
        </main>
      </div>
    </div>
  )
}
