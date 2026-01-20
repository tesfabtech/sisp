'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type User = {
  first_name: string
  last_name: string
  email: string
  profile_photo?: string | null
}

export default function ProfileTab() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [user, setUser] = useState<User | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // Load user from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('admin_user')
    if (!raw) return

    const parsed = JSON.parse(raw)
    setUser(parsed)

    if (parsed.profile_photo) {
      setPreview(`http://localhost:8000/storage/${parsed.profile_photo}`)
    }
  }, [])

  // Image handlers
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
  }

  // Save profile
const handleSaveProfile = async () => {
  if (!user) return

  const token = localStorage.getItem('admin_token')
  if (!token) return

  const formData = new FormData()

  // IMPORTANT: method spoofing
  formData.append('_method', 'PUT')

  formData.append('first_name', user.first_name)
  formData.append('last_name', user.last_name)
  formData.append('email', user.email)

  if (fileInputRef.current?.files?.[0]) {
    formData.append('profile_photo', fileInputRef.current.files[0])
  }

  const res = await fetch('http://localhost:8000/api/admin/profile', {
    method: 'POST', // ← MUST be POST
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.message || 'Failed to update profile')
    return
  }

  localStorage.setItem('admin_user', JSON.stringify(data.user))
  setUser(data.user)

  if (data.user.profile_photo) {
    setPreview(`http://localhost:8000/storage/${data.user.profile_photo}`)
  }

  alert('Profile updated successfully')
}


  if (!user) return null

  return (
    <div className="space-y-6 max-w-xl">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24">
          <div
            onClick={handleImageClick}
            className="group relative w-24 h-24 rounded-full overflow-hidden bg-gray-800 cursor-pointer"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white">
                {user.first_name.charAt(0)}
              </div>
            )}

            {/* Camera overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Camera className="text-white" size={22} />
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div>
          <p className="font-medium text-white">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">First Name</label>
          <Input
            value={user.first_name}
            onChange={(e) =>
              setUser({ ...user, first_name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Last Name</label>
          <Input
            value={user.last_name}
            onChange={(e) =>
              setUser({ ...user, last_name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Email</label>
          <Input
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />
        </div>

        <Button className="mt-4" onClick={handleSaveProfile}>
          Save Profile
        </Button>
      </div>
    </div>
  )
}
