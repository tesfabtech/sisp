'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import UserTable from '@/components/admin/users/user-table'
import axios from '@/lib/axios'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { AdminUser } from '@/components/admin/users/types'

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    axios
      .get('/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setAllUsers(res.data.users)
      })
      .catch(() => {
        console.error('Failed to fetch users')
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())

      const matchesRole =
        role === 'all' || user.role === role

      const matchesStatus =
        status === 'all' || user.status === status

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [allUsers, search, role, status])

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Users
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total users: {filteredUsers.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Search name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-72"
            />

            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <UserTable users={filteredUsers} loading={loading} />
        </main>
      </div>
    </div>
  )
}
