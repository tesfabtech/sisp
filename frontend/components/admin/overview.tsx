'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Users',
            value: 1,
            note: '+12% from last month',
          },
          {
            label: 'Total Startups',
            value: 0,
            note: '+8% from last month',
          },
          {
            label: 'Pending Verifications',
            value: 0,
          },
          {
            label: 'Active Challenges',
            value: 0,
            note: '+2% from last month',
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 space-y-1">
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-bold">
                {stat.value}
              </p>
              {stat.note && (
                <p className="text-xs text-emerald-500">
                  {stat.note}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent Activity</h2>
          <Button variant="link">View All →</Button>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  TechVentures submitted for review
                </p>
                <p className="text-sm text-muted-foreground">
                  Startup application • Today
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                Pending
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  New user registered
                </p>
                <p className="text-sm text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                New
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Challenge application received
                </p>
                <p className="text-sm text-muted-foreground">
                  GreenTech • Sustainability Challenge
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                Review
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Quick Actions</h2>

          <div className="flex flex-col md:flex-row gap-3">
            <Button className="flex-1">
              Review Startups
            </Button>

            <Button variant="outline" className="flex-1">
              Create Challenge
            </Button>

            <Button variant="outline" className="flex-1">
              Publish Announcement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
