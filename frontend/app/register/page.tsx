'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const API_URL = 'http://localhost:8000/api'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const roleFromUrl = searchParams.get('role')

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: roleFromUrl || '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Ensure role exists
  useEffect(() => {
    if (!roleFromUrl) {
      router.push('/register/role')
    }
  }, [roleFromUrl, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 🔒 Password match validation
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      router.push('/login')

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
        <h1 className="text-white text-2xl font-semibold mb-6">
          Create Account
        </h1>

        {error && (
          <p className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="First name"
          className="input"
          required
          value={form.first_name}
          onChange={e => setForm({ ...form, first_name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Last name"
          className="input mt-3"
          required
          value={form.last_name}
          onChange={e => setForm({ ...form, last_name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="input mt-3"
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

        <input
          type="password"
          placeholder="Confirm password"
          className="input mt-3"
          required
          value={form.confirm_password}
          onChange={e =>
            setForm({ ...form, confirm_password: e.target.value })
          }
        />

        {/* Role (locked) */}
        <input
          type="text"
          className="input mt-3 bg-gray-700 cursor-not-allowed"
          value={form.role}
          disabled
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white mt-4 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
