'use client'

import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import KnowledgeCreateForm from '@/components/admin/knowledge/create-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreateKnowledgePage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1">
        <Header />

        <main className="p-6">
          <div className="max-w-3xl space-y-6">

            {/* Back */}
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm text-muted-foreground w-fit"
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} />
              Back
            </Button>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">
                Create Knowledge Article
              </h1>
              <p className="text-sm text-gray-500">
                Publish reading insights for the Knowledge Hub
              </p>
            </div>

            {/* Form */}
            <KnowledgeCreateForm
              onSuccess={() =>
                router.push('/dashboard/admin/knowledge')
              }
            />
          </div>
        </main>
      </div>
    </div>
  )
}
