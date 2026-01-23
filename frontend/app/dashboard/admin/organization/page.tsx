'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import OrgCard from '@/components/admin/organization/org-card'
import { Organization } from '@/components/admin/organization/types'
import axios from '@/lib/axios'
import { Search, Trash2 } from 'lucide-react'

export default function OrganizationPage() {
  const router = useRouter()
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)
    axios.get('/admin/organizations', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrgs(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filteredOrgs = useMemo(() => {
    return orgs.filter(o => {
      if (status && o.status !== status) return false
      if (type && o.type !== type) return false
      const fullName = `${o.user.first_name} ${o.user.last_name}`.toLowerCase()
      if (search && !fullName.includes(search.toLowerCase())) return false
      return true
    })
  }, [orgs, search, status, type])

  const handleUpdate = (id: number, changes: Partial<Organization>) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, ...changes } : o))
  }

  const handleRemove = (id: number) => {
    setOrgs(prev => prev.filter(o => o.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 space-y-6">
              <div className='space-y-2'>
              <h1 className="text-2xl font-semibold">Organizations</h1>
              <p className="text-sm text-gray-500">
                Total organizations: {filteredOrgs.length}
              </p>
            </div>
          {/* Filters + Trash button */}
          <div className="flex flex-wrap items-center gap-3 mb-4 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-8 pl-3 pr-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <Search
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Status */}
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="h-8 px-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <option value="">All status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Type */}
              <select value={type} onChange={e => setType(e.target.value)}
                className="h-8 px-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <option value="">All types</option>
                <option value="ngo">NGO</option>
                <option value="government">Government</option>
                <option value="university">University</option>
                <option value="private">Private</option>
                <option value="accelerator">Accelerator</option>
              </select>
            </div>

            {/* Trash Icon */}
            <button
              onClick={() => router.push('/dashboard/admin/organization/trash')}
              title="Trash"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {loading && <p className="text-sm text-gray-400">Loading organizations...</p>}

          {!loading && !filteredOrgs.length && (
            <p className="text-sm text-gray-400">No organizations found.</p>
          )}

          {!loading && filteredOrgs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrgs.map(org => (
                <OrgCard key={org.id} organization={org} onUpdate={handleUpdate} onRemove={handleRemove} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
