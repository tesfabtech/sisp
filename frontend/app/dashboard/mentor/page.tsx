import MentorSidebar from '@/components/mentor/sidebar'
import MentorHeader from '@/components/mentor/header'
import MentorOverview from '@/components/mentor/overview'

export default function MentorDashboardPage() {
  return (
    <div className="flex h-screen">
      <MentorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MentorHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <MentorOverview />
        </main>
      </div>
    </div>
  )
}
