'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'
import { Organization } from '@/components/admin/organization/types'
import axios from '@/lib/axios'
import Image from 'next/image'
import { Mail, ArrowLeft, Globe, Phone, MapPin } from 'lucide-react'

export default function OrganizationViewPage() {
  const { id } = useParams()
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  useEffect(() => {
    if (!token || !id) return
    setLoading(true)
    axios.get(`/admin/organizations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrganization(res.data.organization))
      .finally(() => setLoading(false))
  }, [id, token])

  const fullName = organization ? `${organization.user.first_name} ${organization.user.last_name}` : ''

  const statusColor =
    organization?.status === 'verified'
      ? 'bg-emerald-100 text-emerald-600'
      : organization?.status === 'pending'
      ? 'bg-yellow-100 text-yellow-600'
      : 'bg-red-100 text-red-600'

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {loading && <p className="text-sm text-gray-400">Loading organization...</p>}
          {!loading && !organization && <p className="text-sm text-gray-400">Organization not found.</p>}

          {organization && (
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#0b1220]">
              {/* Cover Image */}
              <div className="relative w-full h-48 md:h-64">
                {organization.cover_image ? (
                  <Image
                    src={`http://localhost:8000/storage/${organization.cover_image}`}
                    alt={`${fullName} cover`}
                    fill
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
                )}

                {/* Logo + Status */}
                <div className="absolute left-6 -bottom-12 flex items-center gap-3">
                  {organization.logo ? (
                    <Image
                      src={`http://localhost:8000/storage/${organization.logo}`}
                      alt={fullName || 'Organization logo'}
                      width={96}
                      height={96}
                      className="rounded-full border-4 border-white dark:border-gray-800 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-semibold border-4 border-white dark:border-gray-800">
                      {organization.user.first_name[0]}
                    </div>
                  )}
                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium ${statusColor} self-end`}>
                    {organization.status}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="mt-16 p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-8 w-full md:pl-0">
                    <div className='space-y-1'>
                  <h1 className="text-2xl font-semibold">{fullName}</h1>

                  <p className="flex items-center gap-1 text-gray-500 text-sm">
                    <Mail size={14}/> <span className="font-medium">Email:</span> {organization.user.email}
                  </p>
                </div>
                   <div className='space-y-4'>
                  {organization.website && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Globe size={14}/> <span className="font-medium">Website:</span> 
                      <a href={organization.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-500 ml-1">
                        {organization.website}
                      </a>
                    </p>
                  )}

                  {organization.phone && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone size={14}/> <span className="font-medium">Phone:</span> {organization.phone}
                    </p>
                  )}

                  {organization.address && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={14}/> <span className="font-medium">Address:</span> {organization.address}
                    </p>
                  )}
                </div>
                  {organization.type && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Type:</span> {organization.type}
                    </p>
                  )}

                  {organization.description && (
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{organization.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
