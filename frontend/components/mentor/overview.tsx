'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'

export default function MentorOverview() {
  const [available, setAvailable] = useState(true)
  const [stats, setStats] = useState({
    new_requests: 0,
    active: 0,
    industries: 0,
    expertise: 0,
  })
  const [recentRequests, setRecentRequests] = useState<any[]>([])

  useEffect(() => {
    axios.get('/mentor/overview').then(res => {
      setAvailable(res.data.available)
      setStats(res.data.stats)
      setRecentRequests(res.data.recent_requests)
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'New Requests', value: stats.new_requests },
          { label: 'Active Mentorships', value: stats.active },
          { label: 'Industry', value: stats.industries },
          { label: 'Expertise', value: stats.expertise },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
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
            onClick={() => {
              axios.post('/mentor/toggle-availability')
              setAvailable(!available)
            }}
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
     {/* Mentor Inspiration */}
<div className="space-y-4">
  <h2 className="font-semibold">Your Impact as a Mentor</h2>

  <Card
    className="
      relative overflow-hidden
      bg-gradient-to-r from-emerald-50 via-sky-50 to-indigo-50
      dark:from-emerald-950/30 dark:via-sky-950/30 dark:to-indigo-950/30
      transition-all duration-500
      hover:from-emerald-100 hover:via-sky-100 hover:to-indigo-100
      dark:hover:from-emerald-900/40 dark:hover:via-sky-900/40 dark:hover:to-indigo-900/40
      hover:shadow-lg hover:-translate-y-0.5
    "
  >
    <CardContent className="p-6 space-y-5">
      <div className="space-y-2">
        <p className="text-xl font-semibold leading-snug">
          Helping others succeed is the greatest leadership skill.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Every startup you guide carries a piece of your experience forward.
          Your advice today could shape someone’s future for years to come.
        </p>
      </div>

      {/* Highlight points */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          'Share real-world wisdom',
          'Build future leaders',
          'Create meaningful impact',
        ].map((text) => (
          <div
            key={text}
            className="
              rounded-lg border
              bg-white/60 dark:bg-black/20
              px-3 py-2 text-sm text-center
              transition
              hover:bg-white dark:hover:bg-black/30
            "
          >
            {text}
          </div>
        ))}
      </div>

      {/* Quote */}
      <div className="pt-2 border-t">
        <p className="text-xs italic text-muted-foreground">
          “People may forget what you said, but they never forget how you helped
          them grow.”
        </p>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <Button size="sm">
          Keep Mentoring 🚀
        </Button>
      </div>
    </CardContent>
  </Card>
</div>
      
      </div> 
    
  )
}
