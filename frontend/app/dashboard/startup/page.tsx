import Header from '@/components/startup/header'
import Sidebar from '@/components/startup/side_bar'
import Overview from '@/components/startup/Overview'

export default function StartupDashboardPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6">
          <Overview />
        </main>
      </div>
    </div>
  )
}
