'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'

type User = {
  first_name: string
  last_name: string
  email?: string
  role?: string
  title?: string
  bio?: string
}

const expertiseOptions = [
  'Product Strategy',
  'Go-to-Market',
  'Fundraising',
  'Operations',
  'Technical Architecture',
  'Sales Strategy',
  'Marketing',
  'Finance',
  'Legal',
  'HR & Culture',
]

const industryOptions = [
  'SaaS / B2B',
  'FinTech',
  'HealthTech',
  'EdTech',
  'CleanTech',
  'E-commerce',
  'AI / ML',
  'Consumer',
]

export default function MentorProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')

  const [expertise, setExpertise] = useState<string[]>([
    'Product Strategy',
    'Go-to-Market',
    'Fundraising',
  ])

  const [industries, setIndustries] = useState<string[]>([
    'SaaS / B2B',
    'FinTech',
    'HealthTech',
  ])

  const [customExpertise, setCustomExpertise] = useState('')
  const [customIndustry, setCustomIndustry] = useState('')

  const [available, setAvailable] = useState(true)

  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) return

    const parsed = JSON.parse(storedUser)
    setUser(parsed)
    setFirstName(parsed.first_name ?? '')
    setLastName(parsed.last_name ?? '')
    setTitle(parsed.title ?? 'Startup Mentor')
    setBio(
      parsed.bio ??
        'Experienced startup mentor helping founders with strategy, fundraising, and scaling.'
    )
  }, [])

  const toggleItem = (
    item: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(
      list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item]
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProfileFile(file)
    setProfileImage(URL.createObjectURL(file))
  }

  const handleAddExpertise = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customExpertise.trim()) {
      if (!expertise.includes(customExpertise.trim())) {
        setExpertise([...expertise, customExpertise.trim()])
      }
      setCustomExpertise('')
    }
  }

  const handleAddIndustry = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customIndustry.trim()) {
      if (!industries.includes(customIndustry.trim())) {
        setIndustries([...industries, customIndustry.trim()])
      }
      setCustomIndustry('')
    }
  }

const handleSave = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Not authenticated')
    return
  }

  const data = new FormData()

  data.append('title', title)
  data.append('bio', bio)
  data.append('is_available', available ? '1' : '0')

  expertise.forEach((e) => data.append('expertise[]', e))
  industries.forEach((i) => data.append('industries[]', i))

  if (profileFile) {
    data.append('profile_image', profileFile)
  }

  try {
    await axios.post('/mentor/profile', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    alert('Mentor profile saved successfully')
  } catch (error: any) {
    alert(
      error.response?.data?.message ||
        'Failed to save mentor profile'
    )
  }
}


  if (!user) return null

  const allExpertise = Array.from(
    new Set([...expertiseOptions, ...expertise])
  )

  const allIndustries = Array.from(
    new Set([...industryOptions, ...industries])
  )

  return (
    <div className="space-y-6">
      {/* Profile */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="relative">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-semibold cursor-pointer overflow-hidden"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                firstName?.[0]
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              <Camera size={14} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>

          <div>
            <p className="font-semibold">
              {firstName} {lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.role ?? 'Startup Mentor'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <Input value={firstName} disabled />
          <Input value={lastName} disabled />
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />

          <textarea
            rows={4}
            className="w-full rounded-md border bg-background p-3 text-sm"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Expertise */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <Input
            placeholder="Add expertise and press Enter"
            value={customExpertise}
            onChange={(e) => setCustomExpertise(e.target.value)}
            onKeyDown={handleAddExpertise}
          />

          <div className="flex flex-wrap gap-2">
            {allExpertise.map((item) => {
              const active = expertise.includes(item)
              return (
                <button
                  key={item}
                  onClick={() =>
                    toggleItem(item, expertise, setExpertise)
                  }
                  className={`px-3 py-1 rounded-full text-sm transition
                    ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }
                  `}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Industries */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <Input
            placeholder="Add industry and press Enter"
            value={customIndustry}
            onChange={(e) => setCustomIndustry(e.target.value)}
            onKeyDown={handleAddIndustry}
          />

          <div className="flex flex-wrap gap-2">
            {allIndustries.map((item) => {
              const active = industries.includes(item)
              return (
                <button
                  key={item}
                  onClick={() =>
                    toggleItem(item, industries, setIndustries)
                  }
                  className={`px-3 py-1 rounded-full text-sm transition
                    ${
                      active
                        ? 'bg-emerald-600 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }
                  `}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="font-medium">Accept New Requests</p>
            <p className="text-sm text-muted-foreground">
              Turn off to pause incoming mentorship requests
            </p>
          </div>

          <button
            onClick={() => setAvailable(!available)}
            className={`w-12 h-6 rounded-full relative transition
              ${available ? 'bg-emerald-500' : 'bg-gray-400'}
            `}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition
                ${available ? 'left-6' : 'left-1'}
              `}
            />
          </button>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button 
        onClick={handleSave}
        disabled={loading}
        >
            {loading ? 'Saving...' : ' Save Changes'}
    </Button>
      </div>
    </div>
  )
}
