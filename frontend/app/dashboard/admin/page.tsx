import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import Overview from '@/components/admin/overview'

export default function AdminDashboardPage() {
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
