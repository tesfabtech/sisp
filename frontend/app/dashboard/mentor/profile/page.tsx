import MentorHeader from '@/components/mentor/header'
import MentorSidebar from '@/components/mentor/sidebar'
import MentorProfile from '@/components/mentor/mentor_profile'

export default function MentorProfilePage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <MentorSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <MentorHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <MentorProfile />
          </div>
        </main>
      </div>
    </div>
  )
}
