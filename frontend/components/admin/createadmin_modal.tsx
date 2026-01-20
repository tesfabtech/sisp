'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CreateAdminModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'admin',
  })

  if (!open) return null

  const submit = async () => {
    const token = localStorage.getItem('admin_token')

    await axios.post('/admin/admins', form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    onCreated()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Create Admin</h3>

        <Input
          placeholder="First name"
          onChange={e => setForm({ ...form, first_name: e.target.value })}
        />
        <Input
          placeholder="Last name"
          onChange={e => setForm({ ...form, last_name: e.target.value })}
        />
        <Input
          placeholder="Email"
          type="email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>Create</Button>
        </div>
      </div>
    </div>
  )
}
