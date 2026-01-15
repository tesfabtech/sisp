"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Wallet,
  FileText,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/dashboard/organization", icon: LayoutDashboard },
  { label: "Events", href: "/dashboard/organization/events", icon: Calendar },
  { label: "Challenges", href: "/dashboard/organization/challenges", icon: Trophy },
  { label: "Funding", href: "/dashboard/organization/funding", icon: Wallet },
  { label: "Submissions", href: "/dashboard/organization/submissions", icon: FileText },
  { label: "Notifications", href: "/dashboard/organization/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/organization/profile", icon: User },
  { label: "Settings", href: "/dashboard/organization/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard/organization") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="
        hidden lg:flex w-64 min-h-screen flex-col
        border-r border-[#E4E7EC]
        bg-[#F5F7FA]
        px-4 py-6
        dark:bg-[#0B1220]
        dark:border-[#1F2937]
      "
    >
      {/* Logo */}
      <h1 className="mb-6 px-2 text-xl font-bold text-[#101828] dark:text-white">
        OrgPortal
      </h1>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-[#3B82F6] text-white"
                  : `
                    text-[#475467]
                    hover:bg-[#E4E7EC] hover:text-[#101828]
                    dark:text-slate-300
                    dark:hover:bg-white/10 dark:hover:text-white
                  `
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-6 border-t border-[#E4E7EC] pt-4 dark:border-[#1F2937]">
        <button
          className="
            flex w-full items-center gap-3
            rounded-lg px-3 py-2 text-sm
            text-[#475467]
            hover:bg-[#FEE4E2] hover:text-[#EF4444]
            dark:text-slate-300
            dark:hover:bg-red-500/10 dark:hover:text-red-400
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
