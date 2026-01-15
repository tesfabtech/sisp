"use client";

import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const notifications = [
  {
    id: 1,
    title: "Event Approved",
    message:
      "Your event 'Tech Innovation Summit 2024' has been approved and is now live.",
    linkText: "View event →",
    href: "/dashboard/organization/events/1",
    time: "2 hours ago",
    unread: true,
    type: "success",
  },
  {
    id: 2,
    title: "Funding Call Rejected",
    message:
      "Your funding call 'Startup Seed Grant Q1' requires additional information before approval.",
    linkText: "View funding →",
    href: "/dashboard/organization/funding",
    time: "5 hours ago",
    unread: true,
    type: "error",
  },
  {
    id: 3,
    title: "Edit Requested",
    message:
      "Admin has requested changes to your challenge 'AI for Social Good'. Please review and update.",
    linkText: "View challenge →",
    href: "/dashboard/organization/challenges",
    time: "1 day ago",
    unread: false,
    type: "warning",
  },
  {
    id: 4,
    title: "Platform Update",
    message:
      "New features have been added to the organization dashboard. Check out the improved submission tracking!",
    time: "2 days ago",
    unread: false,
    type: "info",
  },
  {
    id: 5,
    title: "Challenge Approved",
    message:
      "Your challenge 'Green Energy Hackathon' has been approved. Registration is now open!",
    linkText: "View challenge →",
    href: "/dashboard/organization/challenges",
    time: "3 days ago",
    unread: false,
    type: "success",
  },
];

/* ---------------- STYLE CONFIG ---------------- */

const typeConfig = {
  success: {
    icon: CheckCircle,
    iconBg: "bg-[#14B8A6]/15 text-[#14B8A6]",
    cardBg: "bg-[#F5F7FA]",
    border: "border-l-[#14B8A6]",
  },
  error: {
    icon: XCircle,
    iconBg: "bg-[#EF4444]/15 text-[#EF4444]",
    cardBg: "bg-[#F5F7FA]",
    border: "border-l-[#EF4444]",
  },
  warning: {
    icon: AlertCircle,
    iconBg: "bg-[#F59E0B]/15 text-[#F59E0B]",
    cardBg: "bg-white",
    border: "border-l-[#F59E0B]",
  },
  info: {
    icon: Bell,
    iconBg: "bg-[#0EA5E9]/15 text-[#0EA5E9]",
    cardBg: "bg-white",
    border: "border-l-[#0EA5E9]",
  },
};

/* ---------------- PAGE ---------------- */

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <p className="text-sm text-[#667085] dark:text-slate-400">
                  Stay updated on admin decisions and platform announcements.
                </p>
              </div>

              <button className="rounded-xl border border-[#D0D5DD] bg-white px-4 py-2 text-sm hover:bg-[#F5F7FA] dark:border-white/10 dark:bg-[#101828]">
                ✓ Mark all as read
              </button>
            </div>

            {/* Unread Count */}
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#3B82F6]">
                <Bell className="h-4 w-4" />
                {unreadCount} unread notifications
              </div>
            )}

            {/* Notification List */}
            <div className="space-y-4">
              {notifications.map((item) => {
                const config =
                  typeConfig[item.type as keyof typeof typeConfig];
                const Icon = config.icon;

                return (
                  <div
                    key={item.id}
                    className={`
                      relative flex gap-4 rounded-2xl border border-[#E4E7EC]
                      ${config.cardBg}
                      border-l-4 ${config.border}
                      px-6 py-5 shadow-sm
                      dark:border-[#1F2937] dark:bg-[#101828]
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${config.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{item.title}</h3>
                        <span className="text-xs text-[#667085] dark:text-slate-400">
                          {item.time}
                        </span>
                      </div>

                      <p className="text-sm text-[#475467] dark:text-slate-300">
                        {item.message}
                      </p>

                      {item.href && (
                        <Link
                          href={item.href}
                          className="text-sm font-medium text-[#3B82F6] hover:underline"
                        >
                          {item.linkText}
                        </Link>
                      )}
                    </div>

                    {/* Unread Dot */}
                    {item.unread && (
                      <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
