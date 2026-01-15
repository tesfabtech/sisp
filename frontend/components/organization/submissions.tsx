"use client";

import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import {
  Calendar,
  Trophy,
  Wallet,
  Eye,
  RotateCcw,
  MessageSquare,
} from "lucide-react";

const submissions = [
  {
    type: "Event",
    title: "Tech Innovation Summit 2024",
    date: "Feb 15, 2024",
    status: "approved",
  },
  {
    type: "Challenge",
    title: "Green Energy Hackathon",
    date: "Feb 18, 2024",
    status: "pending",
  },
  {
    type: "Funding",
    title: "Startup Seed Grant Q1",
    date: "Feb 10, 2024",
    status: "rejected",
  },
  {
    type: "Event",
    title: "AI Workshop Series",
    date: "Feb 20, 2024",
    status: "pending",
  },
  {
    type: "Funding",
    title: "Innovation Research Fund",
    date: "Feb 12, 2024",
    status: "approved",
  },
];

const statusStyles: Record<string, string> = {
  approved:
    "bg-[#14B8A6]/10 text-[#14B8A6] border-[#14B8A6]/20",
  pending:
    "bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/20",
  rejected:
    "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
};

const typeIcon = {
  Event: Calendar,
  Challenge: Trophy,
  Funding: Wallet,
};

export default function SubmissionsPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold">
                Submissions Status
              </h1>
              <p className="mt-1 text-sm text-[#475467] dark:text-slate-400">
                Track all your submissions to admin for review.
                View feedback and resubmit rejected items.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <input
                placeholder="Search submissions..."
                className="w-full max-w-md rounded-xl border border-[#E4E7EC] bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-[#3B82F6]/40 dark:border-[#233050] dark:bg-[#101828]"
              />

              <select className="rounded-xl border border-[#E4E7EC] bg-white px-4 py-2 text-sm dark:border-[#233050] dark:bg-[#101828]">
                <option>All Types</option>
              </select>

              <select className="rounded-xl border border-[#E4E7EC] bg-white px-4 py-2 text-sm dark:border-[#233050] dark:bg-[#101828]">
                <option>All Status</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white dark:border-[#233050] dark:bg-[#101828]">
              <table className="w-full text-sm">
                <thead className="bg-[#F5F7FA] dark:bg-[#0B1220]">
                  <tr className="text-left text-[#475467] dark:text-slate-400">
                    <th className="px-6 py-4">Item Type</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Admin Feedback</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {submissions.map((item, i) => {
                    const Icon = typeIcon[item.type as keyof typeof typeIcon];

                    return (
                      <tr
                        key={i}
                        className="border-t border-[#E4E7EC] hover:bg-[#F5F7FA]/60 dark:border-[#233050] dark:hover:bg-white/5"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-[#475467]" />
                            {item.type}
                          </div>
                        </td>

                        <td className="px-6 py-4 font-medium">
                          {item.title}
                        </td>

                        <td className="px-6 py-4 text-[#475467]">
                          {item.date}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                          >
                            {item.status === "approved"
                              ? "Approved"
                              : item.status === "pending"
                              ? "Pending Review"
                              : "Rejected"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {item.status === "rejected" ? (
                            <button className="inline-flex items-center gap-1 text-sm text-[#EF4444] hover:underline">
                              <MessageSquare className="h-4 w-4" />
                              View Feedback
                            </button>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {item.status === "rejected" ? (
                            <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-[#F5F7FA] dark:hover:bg-white/10">
                              <RotateCcw className="h-4 w-4" />
                              Resubmit
                            </button>
                          ) : (
                            <button className="inline-flex items-center gap-2 text-sm text-[#3B82F6] hover:underline">
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
