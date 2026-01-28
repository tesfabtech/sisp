import Header from '@/components/startup/header'
import Sidebar from '@/components/startup/side_bar'
import StartupCreateForm from '@/components/startup/startup_profile/create_form'

export default function Page() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1">
        <Header />

        <main className="p-6">
          <StartupCreateForm
            submitUrl="/startups"
            method="post"
          />
        </main>
      </div>
    </div>
  )
}
