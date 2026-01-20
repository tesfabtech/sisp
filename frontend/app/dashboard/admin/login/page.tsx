'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

 const handleLogin = async () => {
  try {
    const res = await axios.post('/admin/login', {
      email,
      password,
    })

    // ✅ Store ADMIN auth separately
    localStorage.setItem('admin_token', res.data.token)
    localStorage.setItem('admin_user', JSON.stringify(res.data.user))

    // Optional: clean normal user session
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    router.push('/dashboard/admin')
  } catch (error) {
    console.error('Admin login failed', error)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage the platform
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
    </div>
  )
}
