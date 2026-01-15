"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Trophy,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/* ----------------------------------
   KPI CARD
----------------------------------- */

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
}

function KPICard({ title, value, icon: Icon, trend }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = value / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-2xl border p-6 shadow-sm transition hover:shadow-md
        bg-white border-[#E4E7EC]
        dark:bg-[#101828] dark:border-[#1F2937]
      "
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-[#667085] dark:text-[#94A3B8]">
            {title}
          </p>

          <p className="text-3xl font-bold tabular-nums text-[#101828] dark:text-white">
            {displayValue.toLocaleString()}
          </p>

          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-[#14B8A6]" : "text-[#EF4444]"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}% from last month
            </p>
          )}
        </div>

        <div className="rounded-xl bg-[#3B82F6]/10 p-3 text-[#3B82F6]">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------------
   QUICK ACTIONS
----------------------------------- */

const quickActions = [
  {
    title: "Create Event",
    description: "Schedule a new event or workshop",
    icon: Calendar,
    href: "/dashboard/organization/events/create",
  },
  {
    title: "Create Challenge",
    description: "Launch an innovation challenge",
    icon: Trophy,
    href: "/dashboard/organization/challenges/create",
  },
  {
    title: "Create Funding Call",
    description: "Publish a funding opportunity",
    icon: Wallet,
    href: "/dashboard/organization/funding/create",
  },
];

function QuickActions() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-[#101828] dark:text-white">
        Quick Actions
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {quickActions.map((action, i) => {
          const Icon = action.icon;

          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <Link
                href={action.href}
                className="
                  group flex items-center justify-between rounded-2xl border p-5
                  bg-white border-[#E4E7EC]
                  transition hover:shadow-md
                  dark:bg-[#101828] dark:border-[#1F2937]
                "
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-[#F2F4F7] p-3 text-[#3B82F6] dark:bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium text-[#101828] dark:text-white">
                      {action.title}
                    </p>
                    <p className="text-sm text-[#667085] dark:text-[#94A3B8]">
                      {action.description}
                    </p>
                  </div>
                </div>

                <Plus className="h-5 w-5 text-[#667085] group-hover:text-[#101828] dark:text-[#94A3B8] dark:group-hover:text-white" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ----------------------------------
   RECENT ACTIVITY
----------------------------------- */

const activities = [
  { title: "Tech Innovation Summit 2024", date: "2 hours ago", status: "approved" },
  { title: "Green Energy Hackathon", date: "5 hours ago", status: "pending" },
  { title: "Startup Seed Grant – Q1", date: "1 day ago", status: "rejected" },
];

const statusStyles = {
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-[#14B8A6]/10 text-[#14B8A6]",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-[#EF4444]/10 text-[#EF4444]",
  },
};

function RecentActivity() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-[#101828] dark:text-white">
        Recent Activity
      </h2>

      <div className="overflow-hidden rounded-2xl border bg-white border-[#E4E7EC] dark:bg-[#101828] dark:border-[#1F2937]">
        {activities.map((activity, i) => {
          const status =
            statusStyles[activity.status as keyof typeof statusStyles];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#F2F4F7] dark:hover:bg-white/5"
            >
              <div>
                <p className="font-medium text-[#101828] dark:text-white">
                  {activity.title}
                </p>
                <p className="text-sm text-[#667085] dark:text-[#94A3B8]">
                  {activity.date}
                </p>
              </div>

              <Badge
                variant="outline"
                className={cn("flex items-center gap-1 border-none", status.className)}
              >
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ----------------------------------
   MAIN DASHBOARD
----------------------------------- */

export default function OrganizationDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B1220] px-6 py-8 space-y-12">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Events" value={24} icon={Calendar} trend={{ value: 12, positive: true }} />
        <KPICard title="Challenges" value={8} icon={Trophy} trend={{ value: 25, positive: true }} />
        <KPICard title="Funding Calls" value={15} icon={Wallet} trend={{ value: 8, positive: true }} />
        <KPICard title="Pending Approvals" value={5} icon={Clock} />
      </div>

      <QuickActions />
      <RecentActivity />
    </div>
  );
}
