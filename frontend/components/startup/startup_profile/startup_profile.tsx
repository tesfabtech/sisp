'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from '@/lib/axios'
import Link from 'next/link'
import { motion } from 'framer-motion'

import StartupCard from './startup_card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function StartupProfile() {
  const [startups, setStartups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('all')

  const fetchStartups = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/startups/me')
      setStartups(res.data)
    } catch {
      alert('Failed to fetch startups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStartups()
  }, [])

  const filteredStartups = useMemo(() => {
    return startups.filter((startup) => {
      const matchesSearch =
        startup.name?.toLowerCase().includes(search.toLowerCase()) ||
        startup.tagline?.toLowerCase().includes(search.toLowerCase())

      const matchesIndustry =
        industry === 'all' || startup.industry === industry

      return matchesSearch && matchesIndustry
    })
  }, [startups, search, industry])

  // Number of skeleton cards to show
  const skeletons = Array.from({ length: 6 })

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Startup Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your startups and visibility
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/dashboard/startup/startup_profile/create">
            <Button>Create Startup</Button>
          </Link>

          <Link href="/dashboard/startup/startup_profile/trash">
            <Button variant="outline">Trash</Button>
          </Link>
        </div>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search startups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-sm"
        />

        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="Tech">Technology</SelectItem>
            <SelectItem value="HealthTech">Health Tech</SelectItem>
            <SelectItem value="FinTech">Finance Tech</SelectItem>
            <SelectItem value="AgriTech">Agriculture Tech</SelectItem>
            <SelectItem value="EdTech">Education Tech</SelectItem>
            <SelectItem value="Commerce">Commerce</SelectItem>
            <SelectItem value="Social">Social</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ================= LIST / SKELETON ================= */}
      {loading && (
        <motion.div
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {skeletons.map((_, idx) => (
            <div
              key={idx}
              className="w-full h-80 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </motion.div>
      )}

      {!loading && filteredStartups.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No startups found.
        </p>
      )}

      {!loading && filteredStartups.length > 0 && (
        <motion.div
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredStartups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
