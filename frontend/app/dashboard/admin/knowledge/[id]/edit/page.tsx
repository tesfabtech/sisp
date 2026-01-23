'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useParams, useRouter } from 'next/navigation'
import KnowledgeCreateForm from '@/components/admin/knowledge/create-form'
import { KnowledgeHub } from '@/components/admin/knowledge/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'

export default function EditKnowledgePage() {
  const { id } = useParams()
  const router = useRouter()
  const [item, setItem] = useState<KnowledgeHub | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token || !id) return

    axios
      .get(`/admin/knowledge/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setItem(res.data)
      })
      .catch(() => {
        router.push('/dashboard/admin/knowledge')
      })
  }, [id]) // ✅ ONLY id here

  if (!item) return null

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6 max-w-4xl">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Back
          </Button>

          <h1 className="text-2xl font-semibold">
            Edit Knowledge Article
          </h1>

          <KnowledgeCreateForm
            initialData={item}
            onSuccess={() =>
              router.push('/dashboard/admin/knowledge')
            }
          />
        </main>
      </div>
    </div>
  )
}
