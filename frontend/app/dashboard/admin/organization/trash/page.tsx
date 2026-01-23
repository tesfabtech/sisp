'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import { Organization } from '@/components/admin/organization/types'
import axios from '@/lib/axios'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OrganizationTrashPage() {
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  useEffect(() => {
    if (!token) return
    setLoading(true)
    axios.get('/admin/organizations/deleted', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrgs(res.data))
      .finally(() => setLoading(false))
  }, [token])

  const restore = async (id: number) => {
    if (!token) return
    await axios.patch(`/admin/organizations/${id}/restore`, {}, { headers: { Authorization: `Bearer ${token}` } })
    setOrgs(prev => prev.filter(o => o.id !== id))
  }

  const forceDelete = async (id: number) => {
    if (!token || !confirm('This action is permanent. Continue?')) return
    await axios.delete(`/admin/organizations/${id}/force`, { headers: { Authorization: `Bearer ${token}` } })
    setOrgs(prev => prev.filter(o => o.id !== id))
  }

  const filteredOrgs = orgs.filter(o => {
    const fullName = `${o.user.first_name} ${o.user.last_name}`
    return fullName.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 space-y-6">
          {/* Back + Search */}
          <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-8 pl-3 pr-7 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {loading && <p className="text-sm text-gray-400">Loading deleted organizations...</p>}
          {!loading && !filteredOrgs.length && <p className="text-sm text-gray-400">Trash is empty.</p>}

          {!loading && filteredOrgs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {filteredOrgs.map(org => {
                const fullName = `${org.user.first_name} ${org.user.last_name}`
                return (
                  <Card key={org.id} className="p-4 flex flex-col">
                    {/* Status */}
                    <span className="self-end bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full">
                      deleted
                    </span>

                    {/* Info */}
                    <div className="flex items-center gap-3 mt-2 mb-4">
                      {org.logo ? (
                        <img
                          src={`http://localhost:8000/storage/${org.logo}`}
                          className="h-10 w-10 rounded-full object-cover"
                          alt={fullName}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold">
                          {org.user.first_name[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{fullName}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                          <Mail size={12}/> {org.user.email}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex justify-between gap-2">
                      <Button size="sm" onClick={() => restore(org.id)}>Restore</Button>
                      <Button size="sm" variant="destructive" onClick={() => forceDelete(org.id)}>Delete Forever</Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
