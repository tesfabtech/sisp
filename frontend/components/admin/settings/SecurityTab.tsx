'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SecurityTab() {
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    if (!current || !password || !confirm) {
      alert('All fields are required')
      return
    }

    if (password !== confirm) {
      alert('Passwords do not match')
      return
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    const token = localStorage.getItem('admin_token')
    if (!token) {
      alert('Not authenticated')
      return
    }

    setLoading(true)

    try {
    const res = await fetch(
  'http://localhost:8000/api/admin/password',
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  body: JSON.stringify({
  current_password: current,
  new_password: password,
  new_password_confirmation: confirm,
}),

  }
)


      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Failed to change password')
        return
      }

      // Success
      alert('Password changed successfully')

      setCurrent('')
      setPassword('')
      setConfirm('')
    } catch (err) {
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold text-white mb-6">
        Security
      </h2>

      <div className="mb-4">
        <label className="text-sm text-gray-400 mb-1 block">
          Current Password
        </label>
        <Input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-400 mb-1 block">
          New Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-1 block">
          Confirm Password
        </label>
        <Input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      <Button
        onClick={handleChangePassword}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Changing...' : 'Change Password'}
      </Button>
    </div>
  )
}
