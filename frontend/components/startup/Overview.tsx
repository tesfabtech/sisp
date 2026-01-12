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
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Total Likes',
    value: 0,
    icon: Heart,
    trend: '+8%',
    iconBg: 'bg-cyan-500',
  },
  {
    label: 'Saves',
    value: 0,
    icon: Bookmark,
    iconBg: 'bg-purple-500',
  },
  {
    label: 'Comments',
    value: 0,
    icon: MessageSquare,
    iconBg: 'bg-orange-500',
  },
]

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, trend, iconBg }) => (
          <Card
            key={label}
            className="bg-white dark:bg-[#0f172a] border border-gray-200/60 dark:border-white/10 shadow-sm"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {label}
                  </p>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
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
                <p className="text-xs text-green-500 mt-2">
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
        <Card className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-gray-200/60 dark:border-white/10">
          <CardContent className="p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-4">
              <Building2 className="text-blue-600 dark:text-blue-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No Startup Yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Create your startup profile to get started with InnoHub.
            </p>

            <Button className="mt-6 px-6 bg-blue-600 hover:bg-blue-700 text-white">
              Create Startup Profile
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Mentor Requests */}
          <Card className="bg-white dark:bg-[#0f172a] border border-gray-200/60 dark:border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Mentor Requests
                </h4>
                <span className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer">
                  View
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
                    <Users className="text-yellow-600 dark:text-yellow-400" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      0
                    </p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <TrendingUp
                      className="text-green-600 dark:text-green-400"
                      size={16}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      0
                    </p>
                    <p className="text-xs text-gray-500">Accepted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="bg-white dark:bg-[#0f172a] border border-gray-200/60 dark:border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Team Members
                </h4>
                <span className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer">
                  Manage
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                No team members yet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== Quick Actions ===== */}
      <Card className="bg-white dark:bg-[#0f172a] border border-gray-200/60 dark:border-white/10">
        <CardContent className="p-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
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
      <Card className="bg-white dark:bg-[#0f172a] border border-gray-200/60 dark:border-white/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Recent Posts
            </h4>
            <span className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer">
              View All
            </span>
          </div>

          <div className="text-center py-10">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              No posts yet
            </p>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
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
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer">
      <Icon size={18} className="text-blue-600 dark:text-blue-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
  )
}
