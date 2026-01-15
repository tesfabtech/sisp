"use client";

import { Bell, Lock, Users, Mail } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-[#101828] dark:text-white">
          Settings
        </h1>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-[#E4E7EC] dark:border-[#1F2937] bg-white dark:bg-[#101828] p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] dark:bg-[#0B1220]">
            <Bell className="h-5 w-5 text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#101828] dark:text-white">
              Notification Preferences
            </h2>
            <p className="text-sm text-[#667085] dark:text-gray-400">
              Choose what notifications you want to receive.
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-[#E4E7EC] dark:divide-[#1F2937]">
          {[
            {
              title: "Approval Notifications",
              desc: "Get notified when your submissions are approved.",
              enabled: true,
            },
            {
              title: "Rejection Notifications",
              desc: "Get notified when submissions are rejected with feedback.",
              enabled: true,
            },
            {
              title: "Edit Requests",
              desc: "Get notified when admin requests changes.",
              enabled: true,
            },
            {
              title: "Platform Announcements",
              desc: "Receive updates about new features.",
              enabled: false,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium text-[#101828] dark:text-white">
                  {item.title}
                </p>
                <p className="text-sm text-[#667085] dark:text-gray-400">
                  {item.desc}
                </p>
              </div>

              <div
                className={`relative h-6 w-11 rounded-full transition ${
                  item.enabled
                    ? "bg-[#3B82F6]"
                    : "bg-[#E4E7EC] dark:bg-[#1F2937]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    item.enabled ? "left-5" : "left-1"
                  }`}
                />
              </div>
            </div>
          ))}

          {/* Email Digest */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#3B82F6]" />
              <div>
                <p className="font-medium text-[#101828] dark:text-white">
                  Email Digest
                </p>
                <p className="text-sm text-[#667085] dark:text-gray-400">
                  Receive a daily summary via email.
                </p>
              </div>
            </div>

            <div className="relative h-6 w-11 rounded-full bg-[#3B82F6]">
              <span className="absolute top-0.5 left-5 h-5 w-5 rounded-full bg-white shadow" />
            </div>
          </div>
        </div>

        <button className="mt-6 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          Save Preferences
        </button>
      </div>

      {/* Account Security */}
      <div className="rounded-2xl border border-[#E4E7EC] dark:border-[#1F2937] bg-white dark:bg-[#101828] p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF3] dark:bg-[#0B1220]">
            <Lock className="h-5 w-5 text-[#14B8A6]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#101828] dark:text-white">
              Account Security
            </h2>
            <p className="text-sm text-[#667085] dark:text-gray-400">
              Manage your account security settings.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full rounded-lg border border-[#E4E7EC] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0B1220] px-3 py-2 text-sm text-[#101828] dark:text-white"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="password"
              placeholder="New Password"
              className="w-full rounded-lg border border-[#E4E7EC] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0B1220] px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full rounded-lg border border-[#E4E7EC] dark:border-[#1F2937] bg-[#F5F7FA] dark:bg-[#0B1220] px-3 py-2 text-sm"
            />
          </div>

          <button className="inline-flex items-center gap-2 rounded-lg border border-[#E4E7EC] dark:border-[#1F2937] px-4 py-2 text-sm font-medium text-[#101828] dark:text-white">
            Update Password
          </button>

          <div className="flex items-center justify-between pt-4 border-t border-[#E4E7EC] dark:border-[#1F2937]">
            <div>
              <p className="font-medium text-[#101828] dark:text-white">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-[#667085] dark:text-gray-400">
                Add an extra layer of security.
              </p>
            </div>

            <button className="rounded-lg border border-[#E4E7EC] dark:border-[#1F2937] px-4 py-2 text-sm">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Access Control */}
      <div className="rounded-2xl border border-[#E4E7EC] dark:border-[#1F2937] bg-white dark:bg-[#101828] p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] dark:bg-[#0B1220]">
            <Users className="h-5 w-5 text-[#0EA5E9]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#101828] dark:text-white">
              Access Control
            </h2>
            <p className="text-sm text-[#667085] dark:text-gray-400">
              Manage team members who can access this organization.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E4E7EC] dark:border-[#1F2937] py-10 text-center">
          <Users className="h-8 w-8 text-[#98A2B3]" />
          <p className="mt-3 text-sm text-[#667085] dark:text-gray-400">
            Team management features coming soon.
          </p>

          <button className="mt-4 rounded-lg border border-[#E4E7EC] dark:border-[#1F2937] px-4 py-2 text-sm text-[#98A2B3]">
            Invite Team Members
          </button>
        </div>
      </div>
    </div>
  );
}
