'use client'

import Header from '@/components/startup/header'
import Sidebar from '@/components/startup/side_bar'
import MentorRequest from '@/components/startup/mentor_request'

export default function MentorRequestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">
              Request Mentorship
            </h1>

            <MentorRequest />
          </div>
        </main>

      </div>
    </div>
  )
}
