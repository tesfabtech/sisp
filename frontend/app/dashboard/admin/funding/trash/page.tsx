'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Sidebar from '@/components/admin/sidebar'
import Header from '@/components/admin/header'
import FundingCard from '@/components/admin/funding/fund-card'
import { FundingOpportunity } from '@/components/admin/funding/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TrashedFundingPage() {
  const [items, setItems] = useState<FundingOpportunity[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    axios
      .get('/admin/funding/trashed', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setItems(res.data.data))
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Back
          </Button>

          <h1 className="text-2xl font-semibold">
            Trashed Funding Opportunities
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <FundingCard
                key={item.id}
                item={item}
                onRemove={id =>
                  setItems(p => p.filter(i => i.id !== id))
                }
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
