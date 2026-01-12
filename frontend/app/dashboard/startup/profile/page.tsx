import Header from '@/components/startup/header'
import Sidebar from '@/components/startup/side_bar'
import Profile from '@/components/startup/startup_profile'

export default function StartupDashboardPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6">
          <Profile  />
        </main>
      </div>
    </div>
  )
}
