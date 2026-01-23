'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useParams, useRouter } from 'next/navigation'
import { KnowledgeHub } from '@/components/admin/knowledge/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import Image from 'next/image'

export default function KnowledgeViewPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const router = useRouter()

  const [item, setItem] = useState<KnowledgeHub | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
      return
    }

    axios
      .get(`/admin/knowledge/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setItem(res.data.data) // ✅ THIS WAS THE BUG
      })
      .catch(() => router.push('/dashboard/admin/knowledge'))
      .finally(() => setLoading(false))
  }, [id, router])

  const imageUrl = item?.image
    ? `http://localhost:8000/storage/${item.image}`
    : null

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6 max-w-4xl mx-auto">
          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-64 bg-muted rounded-2xl" />
              <div className="h-8 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-40 bg-muted rounded" />
            </div>
          )}

          {!loading && !item && (
            <p className="text-center text-muted-foreground">
              Knowledge not found
            </p>
          )}

          {!loading && item && (
            <div className="flex flex-col gap-6">

              {/* Actions */}
              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => router.back()}>
                  <ArrowLeft size={16} /> Back
                </Button>

                <Button
                  onClick={() =>
                    router.push(`/dashboard/admin/knowledge/${id}/edit`)
                  }
                >
                  <Pencil size={14} /> Edit
                </Button>
              </div>

              {/* Image */}
              {imageUrl && (
                <div className=" w-full rounded-2xl overflow-hidden border">
  <Image
  src={imageUrl}
  alt={item.title}
  width={1400}
                    height={500}
  className="w-full h-75 object-cover"
  unoptimized
  priority
/>

</div>

              )}

              {/* Title */}
              <h1 className="text-3xl font-bold">{item.title}</h1>
      <div>
              {/* Meta */}
              <p className="text-sm text-muted-foreground">
                {item.type} • {item.max_read_time} min read •{' '}
                <span className="capitalize">{item.status}</span>
              </p>

              {/* Short Description */}
              {item.short_description && (
                <p className="text-base text-gray-600 dark:text-gray-300">
                  {item.short_description}
                </p>
              )}
</div>
              {/* Content */}
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
