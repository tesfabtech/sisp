'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from '@/lib/axios'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Upload,
  ImageIcon,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export default function StartupProfile() {
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [startups, setStartups] = useState<any[]>([])
  const [showStartups, setShowStartups] = useState(false)

  const [form, setForm] = useState({
    name: '',
    website: '',
    tagline: '',
    description: '',
    industry: '',
    stage: '',
    video_url: '',
    problem_statement: '',
    solution_statement: '',
    location: '',
    team_size: '',
    founded_year: '',
  })

  const [logo, setLogo] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  /* ================= AUTH ================= */
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) {
      alert('You are not logged in')
      return
    }
    setToken(savedToken)
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name) return alert('Startup name is required')
    if (!token) return alert('Not authenticated')

    setLoading(true)

    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value)
    })

    if (logo) data.append('logo', logo)
    if (coverImage) data.append('cover_image', coverImage)

    try {
      await axios.post('/startups', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      alert('Startup profile saved successfully')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save startup')
    } finally {
      setLoading(false)
    }
  }

  /* ================= FETCH USER STARTUPS ================= */
  const fetchMyStartups = async () => {
    if (!token) return alert('Not authenticated')

    try {
      const res = await axios.get('/startups/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      setStartups(res.data)
      setShowStartups(true)
    } catch {
      alert('Failed to fetch startups')
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-[#101828] dark:text-[#FAFAFA]">

      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Startup Profile
          </h1>
          <p className="text-sm text-[#6B7280]">
            Manage your startup details and visibility.
          </p>
        </div>

        <Button
          variant="outline"
          className="border-[#E2E8F0] dark:border-[#1F2937]"
          onClick={fetchMyStartups}
        >
          See Startups
        </Button>
      </div>

      {/* ================= USER STARTUPS ================= */}
      {showStartups && startups.length > 0 && (
        <div className="overflow-hidden">
          <motion.div className="flex gap-8">
            {startups.map((startup) => (
              <Card
                key={startup.id}
                className="w-82.5 shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937] shadow-lg"
              >
                {/* Cover Image */}
                <div className="relative h-47.5">
                  {startup.cover_image ? (
                    <Image
                      src={`http://localhost:8000/storage/${startup.cover_image}`}
                      alt={startup.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-[#EEF2F7] dark:bg-[#0B1220] flex items-center justify-center">
                      <ImageIcon className="text-[#6B7280]" />
                    </div>
                  )}

                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-[#14B8A6] text-white shadow">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Submitted
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#EEF2F7] dark:bg-[#0B1220]">
                      {startup.logo ? (
                        <Image
                          src={`http://localhost:8000/storage/${startup.logo}`}
                          alt="Logo"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <Building2 className="w-full h-full p-2 text-[#6B7280]" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold">
                      {startup.name}
                    </h3>
                  </div>

                  <Badge className="mt-3 mb-4 bg-[#DBEAFE] text-[#1D4ED8] dark:bg-[#1E3A8A]/30 dark:text-[#93C5FD]">
                    {startup.industry || 'Startup'}
                  </Badge>

                  <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">
                    {startup.tagline}
                  </p>

                  <Link href={`/dashboard/startup/${startup.id}`}>
                    <div className="mt-6 flex items-center text-[#3B82F6] font-medium text-sm group cursor-pointer">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      )}

      {/* ================= FORM ================= */}

      {/* Media */}
      <Card className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-medium">Media</h3>

          <div className="relative h-40 rounded-xl border border-dashed border-[#E2E8F0] dark:border-[#1F2937] flex items-center justify-center">
            <ImageIcon className="text-[#6B7280]" />
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <input
              type="file"
              id="logo"
              className="hidden"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
            />

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-[#E2E8F0] dark:border-[#1F2937]"
            >
              <label htmlFor="logo" className="cursor-pointer flex items-center gap-2">
                <Upload size={14} />
                Upload Logo
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]">
        <CardContent className="p-6 space-y-4">
          <Input name="name" placeholder="Startup Name" onChange={handleChange} />
          <Input name="website" placeholder="Website" onChange={handleChange} />
          <Input name="tagline" placeholder="Tagline" onChange={handleChange} />
          <Textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select onValueChange={(v) => setForm({ ...form, industry: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tech">Technology</SelectItem>
                <SelectItem value="HealthTech">Health Tech</SelectItem>
                <SelectItem value="FinTech">Finance Tech</SelectItem>
                <SelectItem value="AgriTech">Agriculture Tech</SelectItem>
                <SelectItem value="EdTech">Education Tech</SelectItem>
                <SelectItem value="Commerce">Commerce</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Other">Other / General</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(v) => setForm({ ...form, stage: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="launched">Launched</SelectItem>
                <SelectItem value="scaling">Scaling</SelectItem>
              </SelectContent>
            </Select>

            <Input
              name="video_url"
              placeholder="Video URL (YouTube / Demo)"
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Problem & Solution */}
      <Card className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]">
        <CardContent className="p-6 space-y-4">
          <Textarea
            name="problem_statement"
            placeholder="Problem Statement"
            onChange={handleChange}
          />
          <Textarea
            name="solution_statement"
            placeholder="Solution Statement"
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card className="bg-white dark:bg-[#101828] border border-[#E2E8F0] dark:border-[#1F2937]">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="location" placeholder="Location" onChange={handleChange} />
          <Input name="team_size" placeholder="Team Size" onChange={handleChange} />
          <Input
            name="founded_year"
            placeholder="Founded Year"
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  )
}
