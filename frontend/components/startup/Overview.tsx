import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Eye,
  Heart,
  Bookmark,
  MessageSquare,
  Building2,
  Users,
  TrendingUp,
  Plus,
  FileText,
  UserPlus,
  Search,
} from 'lucide-react'

const stats = [
  {
    label: 'Total Views',
    value: 0,
    icon: Eye,
    trend: '+12%',
    iconBg: 'bg-[#3B82F6]',
  },
  {
    label: 'Total Likes',
    value: 0,
    icon: Heart,
    trend: '+8%',
    iconBg: 'bg-[#0EA5E9]',
  },
  {
    label: 'Saves',
    value: 0,
    icon: Bookmark,
    iconBg: 'bg-[#6366F1]',
  },
  {
    label: 'Comments',
    value: 0,
    icon: MessageSquare,
    iconBg: 'bg-[#F59E0B]',
  },
]

export default function Overview() {
  return (
    <div className="space-y-6 text-[#101828] dark:text-[#FAFAFA]">

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, trend, iconBg }) => (
          <Card
            key={label}
            className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937] shadow-sm"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-[#6B7280]">
                    {label}
                  </p>
                  <h3 className="text-2xl font-semibold mt-2">
                    {value}
                  </h3>
                </div>

                <div
                  className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-white`}
                >
                  <Icon size={18} />
                </div>
              </div>

              {trend && (
                <p className="text-xs text-[#14B8A6] mt-2">
                  ↗ {trend} vs last month
                </p>
              )}
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
                <h4 className="font-medium">
                  Mentor Requests
                </h4>
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
                    <p className="text-sm font-semibold">0</p>
                    <p className="text-xs text-[#6B7280]">Pending</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#CCFBF1] dark:bg-[#134E4A]/30 flex items-center justify-center">
                    <TrendingUp className="text-[#14B8A6]" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">0</p>
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
                <h4 className="font-medium">
                  Team Members
                </h4>
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

      {/* ===== Quick Actions ===== */}
      <Card className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]">
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">
            Quick Actions
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Action icon={FileText} label="Publish Update" />
            <Action icon={UserPlus} label="Invite Team" />
            <Action icon={Search} label="Find Mentor" />
          </div>
        </CardContent>
      </Card>

      {/* ===== Recent Posts ===== */}
      <Card className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-medium">
              Recent Posts
            </h4>
            <span className="text-sm text-[#3B82F6] cursor-pointer">
              View All
            </span>
          </div>

          <div className="text-center py-10">
            <p className="text-sm text-[#6B7280] mb-4">
              No posts yet
            </p>

            <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2">
              <Plus size={16} />
              Create Post
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ===== Helper Component ===== */
function Action({
  icon: Icon,
  label,
}: {
  icon: any
  label: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] p-6 hover:bg-[#F1F5F9] dark:hover:bg-white/5 transition cursor-pointer">
      <Icon size={18} className="text-[#3B82F6]" />
      <span className="text-sm font-medium text-[#475569] dark:text-[#CBD5E1]">
        {label}
      </span>
    </div>
  )
}
