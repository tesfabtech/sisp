'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = 'http://localhost:8000/api'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Save token & user to localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect by role
      switch (data.user.role) {
        case 'startup':
          router.push('/dashboard/startup')
          break
        case 'mentor':
          router.push('/dashboard/mentor')
          break
        case 'organization':
          router.push('/dashboard/organization')
          break
        default:
          router.push('/dashboard')
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#050B1E] to-[#020617]">
      <form
        onSubmit={submit}
        className="bg-[#0B1229] p-8 rounded-2xl w-full max-w-md border border-[#1E293B]"
      >
        <h1 className="text-white text-2xl font-semibold mb-6">Login</h1>

        {error && (
          <p className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="input"
          required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="input mt-3"
          required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white mt-4 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
