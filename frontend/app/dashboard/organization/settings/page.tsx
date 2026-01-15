import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import Settings from "@/components/organization/Settings";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <Settings />
      </div>
    </div>
  );
}
