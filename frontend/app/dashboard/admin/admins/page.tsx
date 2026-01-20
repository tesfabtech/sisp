'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'

import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import AdminTable from '@/components/admin/admintable'
import CreateAdminModal from '@/components/admin/createadmin_modal'
import { Button } from '@/components/ui/button'

export default function AdminsPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchAdmins = async (token: string) => {
    try {
      const res = await axios.get('/admin/admins', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setAdmins(res.data.admins)
    } catch (error) {
      console.error('Failed to fetch admins', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('admin_token')

    if (!token) {
      router.replace('/dashboard/admin/login')
      return
    }

    fetchAdmins(token)
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Admins</h2>
              <p className="text-sm text-muted-foreground">
                Manage platform administrators
              </p>
            </div>

            <Button onClick={() => setOpen(true)}>
              + Create Admin
            </Button>
          </div>

          <AdminTable admins={admins} onChange={() => fetchAdmins(localStorage.getItem('admin_token')!)} />
        </main>
      </div>

      <CreateAdminModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => fetchAdmins(localStorage.getItem('admin_token')!)}
      />
    </div>
  )
}
