'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Upload, ImageIcon } from 'lucide-react'

type Props = {
  submitUrl: string
  method?: 'post' | 'put'
  initialData?: any
}

export default function StartupForm({
  submitUrl,
  method = 'post',
  initialData = {},
}: Props) {
  const [loading, setLoading] = useState(false)

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    name: initialData.name || '',
    website: initialData.website || '',
    tagline: initialData.tagline || '',
    description: initialData.description || '',
    industry: initialData.industry || '',
    stage: initialData.stage || '',
    video_url: initialData.video_url || '',
    problem_statement: initialData.problem_statement || '',
    solution_statement: initialData.solution_statement || '',
    location: initialData.location || '',
    team_size: initialData.team_size || '',
    founded_year: initialData.founded_year || '',
  })

  const router = useRouter()

  /* ================= MEDIA ================= */
  const [logo, setLogo] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData.logo
      ? `http://localhost:8000/storage/${initialData.logo}`
      : null
  )

  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData.cover_image
      ? `http://localhost:8000/storage/${initialData.cover_image}`
      : null
  )

  /* ================= PREVIEW HANDLERS ================= */
  useEffect(() => {
    if (logo) {
      const url = URL.createObjectURL(logo)
      setLogoPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [logo])

  useEffect(() => {
    if (coverImage) {
      const url = URL.createObjectURL(coverImage)
      setCoverPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [coverImage])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name) {
      alert('Startup name is required')
      return
    }

    setLoading(true)

    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value)
    })

    if (logo) data.append('logo', logo)
    if (coverImage) data.append('cover_image', coverImage)

    try {
      await axios({
        url: submitUrl,
        method,
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      alert('Startup profile saved successfully')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save startup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">


{/* ================= BACK ================= */}
<button
  onClick={() => router.back()}
  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
>
  <ArrowLeft className="w-4 h-4" />
  Back
</button>

      {/* ================= MEDIA ================= */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="font-medium">Media</h3>

          {/* COVER IMAGE */}
          <div className="relative h-48 rounded-xl overflow-hidden border border-dashed flex items-center justify-center">
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Cover preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <ImageIcon className="text-muted-foreground" />
            )}

            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
          </div>

          {/* LOGO */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-muted">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <ImageIcon className="p-3 text-muted-foreground" />
              )}
            </div>

            <input
              type="file"
              id="logo"
              className="hidden"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
            />

            <Button asChild variant="outline" size="sm">
              <label htmlFor="logo" className="cursor-pointer flex items-center gap-2">
                <Upload size={14} />
                Upload Logo
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ================= BASIC INFO ================= */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <Input name="name" value={form.name} placeholder="Startup Name" onChange={handleChange} />
          <Input name="website" value={form.website} placeholder="Website" onChange={handleChange} />
          <Input name="tagline" value={form.tagline} placeholder="Tagline" onChange={handleChange} />
          <Textarea name="description" value={form.description} placeholder="Description" onChange={handleChange} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
              <SelectTrigger><SelectValue placeholder="Industry" /></SelectTrigger>
              <SelectContent>
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

            <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
              <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="launched">Launched</SelectItem>
                <SelectItem value="scaling">Scaling</SelectItem>
              </SelectContent>
            </Select>

            <Input name="video_url" value={form.video_url} placeholder="Video URL" onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      {/* ================= PROBLEM & SOLUTION ================= */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <Textarea name="problem_statement" value={form.problem_statement} placeholder="Problem Statement" onChange={handleChange} />
          <Textarea name="solution_statement" value={form.solution_statement} placeholder="Solution Statement" onChange={handleChange} />
        </CardContent>
      </Card>

      {/* ================= ADDITIONAL ================= */}
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="location" value={form.location} placeholder="Location" onChange={handleChange} />
          <Input name="team_size" value={form.team_size} placeholder="Team Size" onChange={handleChange} />
          <Input name="founded_year" value={form.founded_year} placeholder="Founded Year" onChange={handleChange} />
        </CardContent>
      </Card>

      {/* ================= SUBMIT ================= */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  )
}
