'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MentorOverview() {
  const [available, setAvailable] = useState(true)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'New Requests', value: 5, note: '+12% from last month' },
          { label: 'Active Mentorships', value: 3 },
          { label: 'Completed', value: 12 },
          { label: 'This Month', value: 8, note: '+25% from last month' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.note && (
                <p className="text-xs text-emerald-500">{stat.note}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Availability */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Availability Status</p>
            <p className="text-sm text-muted-foreground">
              {available
                ? "You're accepting new mentorship requests"
                : "You're not accepting new mentorship requests"}
            </p>
          </div>

          <button
            onClick={() => setAvailable(!available)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${
                available
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }
            `}
          >
            {available ? 'Available' : 'Unavailable'}
          </button>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent Requests</h2>
          <Button variant="link">View All →</Button>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">TechVenture Labs</p>
                <p className="text-sm text-muted-foreground">
                  SaaS / B2B • 1/15/2024
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                Pending
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              We're building an AI-powered analytics platform and need guidance
              on our product roadmap and go-to-market strategy.
            </p>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button size="sm">Accept</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
