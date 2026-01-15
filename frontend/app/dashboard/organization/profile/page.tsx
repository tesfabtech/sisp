import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import Profile from "@/components/organization/profile";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-5xl">
            <Profile />
          </div>
        </main>
      </div>
    </div>
  );
}
