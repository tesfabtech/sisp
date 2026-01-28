'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import axios from '@/lib/axios'
import Image from 'next/image'

import Header from '@/components/startup/header'
import Sidebar from '@/components/startup/side_bar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Upload, ImageIcon, ArrowLeft } from 'lucide-react'

export default function EditStartupPage() {
  const { id } = useParams()
  const router = useRouter()
  const [startup, setStartup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<any>({
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  // Fetch startup
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get(`/startups/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const data = res.data
        setStartup(data)
        setForm({
          name: data.name || '',
          website: data.website || '',
          tagline: data.tagline || '',
          description: data.description || '',
          industry: data.industry || '',
          stage: data.stage || '',
          video_url: data.video_url || '',
          problem_statement: data.problem_statement || '',
          solution_statement: data.solution_statement || '',
          location: data.location || '',
          team_size: data.team_size || '',
          founded_year: data.founded_year || '',
        })
        setLogoPreview(data.logo ? `http://localhost:8000/storage/${data.logo}` : null)
        setCoverPreview(data.cover_image ? `http://localhost:8000/storage/${data.cover_image}` : null)
      })
      .catch(() => notFound())
      .finally(() => setLoading(false))
  }, [id])

  // Media previews
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name) {
      alert('Startup name is required')
      return
    }

    setSaving(true)
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value as string)
    })
    if (logo) data.append('logo', logo)
    if (coverImage) data.append('cover_image', coverImage)
    data.append('_method', 'PUT')

    try {
      const res = await axios.post(`/startups/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const updatedStartup = res.data.startup
      setStartup(updatedStartup)
      setForm({
        name: updatedStartup.name || '',
        website: updatedStartup.website || '',
        tagline: updatedStartup.tagline || '',
        description: updatedStartup.description || '',
        industry: updatedStartup.industry || '',
        stage: updatedStartup.stage || '',
        video_url: updatedStartup.video_url || '',
        problem_statement: updatedStartup.problem_statement || '',
        solution_statement: updatedStartup.solution_statement || '',
        location: updatedStartup.location || '',
        team_size: updatedStartup.team_size || '',
        founded_year: updatedStartup.founded_year || '',
      })
      setLogoPreview(
        updatedStartup.logo
          ? `http://localhost:8000/storage/${updatedStartup.logo}`
          : logoPreview
      )
      setCoverPreview(
        updatedStartup.cover_image
          ? `http://localhost:8000/storage/${updatedStartup.cover_image}`
          : coverPreview
      )

      alert('Startup updated successfully')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save startup')
    } finally {
      setSaving(false)
    }
  }

  // Skeleton loading
  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-10 bg-gray-300 rounded w-1/4" />
        <div className="h-64 bg-gray-200 rounded" />
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    )

  if (!startup) return null

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="max-w-6xl mx-auto p-6 space-y-6">

          {/* Back */}
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <h1 className="text-2xl font-semibold">Edit Startup</h1>
          <p className="text-sm text-muted-foreground">Update your startup information</p>

          {/* MEDIA */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-medium">Media</h3>
              <div className="relative h-48 rounded-xl overflow-hidden border border-dashed flex items-center justify-center">
                {coverPreview ? (
                  <Image src={coverPreview} alt="Cover preview" fill className="object-cover" unoptimized />
                ) : (
                  <ImageIcon className="text-muted-foreground" />
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setCoverImage(e.target.files?.[0] || null)} />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-muted">
                  {logoPreview ? (
                    <Image src={logoPreview} alt="Logo preview" fill className="object-cover" unoptimized />
                  ) : (
                    <ImageIcon className="p-3 text-muted-foreground" />
                  )}
                </div>
                <input type="file" id="logo" className="hidden" onChange={e => setLogo(e.target.files?.[0] || null)} />
                <Button asChild variant="outline" size="sm">
                  <label htmlFor="logo" className="cursor-pointer flex items-center gap-2">
                    <Upload size={14} /> Upload Logo
                  </label>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* BASIC INFO */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <Input name="name" value={form.name} placeholder="Startup Name" onChange={handleChange} />
              <Input name="website" value={form.website} placeholder="Website" onChange={handleChange} />
              <Input name="tagline" value={form.tagline} placeholder="Tagline" onChange={handleChange} />
              <Textarea name="description" value={form.description} placeholder="Description" onChange={handleChange} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={form.industry} onValueChange={v => setForm({ ...form, industry: v })}>
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

                <Select value={form.stage} onValueChange={v => setForm({ ...form, stage: v })}>
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

          {/* PROBLEM & SOLUTION */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <Textarea name="problem_statement" value={form.problem_statement} placeholder="Problem Statement" onChange={handleChange} />
              <Textarea name="solution_statement" value={form.solution_statement} placeholder="Solution Statement" onChange={handleChange} />
            </CardContent>
          </Card>

          {/* ADDITIONAL DETAILS */}
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name="location" value={form.location} placeholder="Location" onChange={handleChange} />
              <Input name="team_size" value={form.team_size} placeholder="Team Size" onChange={handleChange} />
              <Input name="founded_year" value={form.founded_year} placeholder="Founded Year" onChange={handleChange} />
            </CardContent>
          </Card>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
