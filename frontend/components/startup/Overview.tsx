'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  FileText,
  TrendingUp,
  Users,
} from 'lucide-react'

export default function Overview() {
  // ===== STATES =====
  const [dashboard, setDashboard] = useState({
    organizations: 0,
    startups: 0, // ✅ ADDED (ONLY THIS)
    knowledge_hubs: 0,
    events: 0,
    mentors: 0,
  })

  const [mentorRequests, setMentorRequests] = useState({
    pending: 0,
    accepted: 0,
  })

  // ===== FETCH DATA =====
  useEffect(() => {
    axios
      .get('/dashboard/overview')
      .then(res => {
        setDashboard(res.data.stats)
        setMentorRequests(res.data.mentor_requests)
      })
      .catch(console.error)
  }, [])

  // ===== STATS CONFIG =====
  const stats = [
    {
      label: 'Organizations',
      value: dashboard.organizations,
      icon: Building2,
      iconBg: 'bg-[#3B82F6]',
    },
    {
      label: 'Startups', // ✅ ADDED CARD ONLY
      value: dashboard.startups,
      icon: Building2,
      iconBg: 'bg-[#10B981]',
    },
   
    {
      label: 'Events',
      value: dashboard.events,
      icon: TrendingUp,
      iconBg: 'bg-[#6366F1]',
    },
    {
      label: 'Mentors',
      value: dashboard.mentors,
      icon: Users,
      iconBg: 'bg-[#F59E0B]',
    },
  ]

  return (
    <div className="space-y-6 text-[#101828] dark:text-[#FAFAFA]">

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, iconBg }) => (
          <Card
            key={label}
            className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937] shadow-sm"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-[#6B7280]">{label}</p>
                  <h3 className="text-2xl font-semibold mt-2">{value}</h3>
                </div>

                <div
                  className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-white`}
                >
                  <Icon size={18} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== Main Grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* No Startup */}
        <Card className="lg:col-span-2 bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]">
          <CardContent className="p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#DBEAFE] dark:bg-[#1E3A8A]/30 flex items-center justify-center mb-4">
              <Building2 className="text-[#3B82F6]" />
            </div>

            <h3 className="text-lg font-semibold">
              No Startup Yet
            </h3>
            <p className="text-sm text-[#6B7280] mt-2">
              Create your startup profile to get started with InnoHub.
            </p>

            <Button className="mt-6 px-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white">
              Create Startup Profile
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Mentor Requests */}
          <Card className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Mentor Requests</h4>
                <span className="text-sm text-[#3B82F6] cursor-pointer">
                  View
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] dark:bg-[#92400E]/30 flex items-center justify-center">
                    <Users className="text-[#F59E0B]" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {mentorRequests.pending}
                    </p>
                    <p className="text-xs text-[#6B7280]">Pending</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#CCFBF1] dark:bg-[#134E4A]/30 flex items-center justify-center">
                    <TrendingUp className="text-[#14B8A6]" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {mentorRequests.accepted}
                    </p>
                    <p className="text-xs text-[#6B7280]">Accepted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Team Members</h4>
                <span className="text-sm text-[#3B82F6] cursor-pointer">
                  Manage
                </span>
              </div>

              <p className="text-sm text-[#6B7280]">
                No team members yet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
