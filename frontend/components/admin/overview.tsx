'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Sparkles, Rocket, Users, Lightbulb, ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function OverviewPage() {
  return (
    <div className="relative space-y-12 rounded-3xl p-6 md:p-10
      bg-linear-to-br from-background via-muted/40 to-primary/5
      dark:from-background dark:via-muted/20 dark:to-primary/10">

      {/* Hero Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-3xl p-8 md:p-12
          bg-linear-to-br from-primary via-indigo-600 to-fuchsia-600
          text-white shadow-2xl"
      >
        <div className="relative z-10 max-w-xl space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Build ideas people care about
          </h1>
          <p className="text-white/90">
            Explore startups, join challenges, and collaborate with innovators.
          </p>

          <Link href="/dashboard/admin">
            <Button
              size="lg"
              className="gap-2 bg-purple/90 text-primary hover:bg-white"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_60%)]" />
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{
          title: 'Community',
          desc: 'Meet founders, mentors, and builders.',
          icon: Users,
          href: '/dashboard/admin/users',
        }, {
          title: 'Review a Startup',
          desc: 'Submit your idea and make it public.',
          icon: Rocket,
          href: '/dashboard/admin/startups',
        }, {
          title: 'Challenges',
          desc: 'Solve problems that matter.',
          icon: Lightbulb,
          href: '/dashboard/admin/challenges',
        }].map((item, i) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
          >
            <Link href={item.href}>
              <Card
                className="group h-full cursor-pointer
                  bg-linear-to-br from-card to-muted/40
                  dark:from-card dark:to-muted/20
                  border border-border/60
                  hover:shadow-2xl hover:-translate-y-1
                  transition-all"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl
                    bg-primary/10 text-primary
                    group-hover:bg-primary group-hover:text-white
                    transition flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed */}
      <Card className="bg-linear-to-br from-card to-muted/30 dark:to-muted/20">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Latest Activity</h2>
            <Link href="#">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {[{
              title: 'New startup submitted',
              meta: 'Innovation · Just now',
              tag: 'New',
            }, {
              title: 'Challenge opened: Clean Energy',
              meta: 'Sustainability',
              tag: 'Open',
            }, {
              title: 'A new member joined',
              meta: 'Community update',
              tag: 'Community',
            }].map((a) => (
              <div
                key={a.title}
                className="flex items-center justify-between rounded-xl
                  p-3 hover:bg-muted/40 transition"
              >
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.meta}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full
                  bg-primary/10 text-primary">
                  {a.tag}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/admin/challenges">
          <Card className="group cursor-pointer hover:shadow-xl transition">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">Approve  Challenge</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Approve innovators to solve real-world problems.
              </p>
              <Button variant="outline">View</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/admin/startups/">
          <Card className="group cursor-pointer hover:shadow-xl transition">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Rocket className="w-5 h-5" />
                <h3 className="font-semibold">Help a Startup</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                TO  idea into a visible project.
              </p>
              <Button>Idea</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
