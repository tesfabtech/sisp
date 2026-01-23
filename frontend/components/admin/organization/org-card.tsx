'use client'

import axios from '@/lib/axios'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Organization } from './types'

type Props = {
  organization: Organization
  onUpdate: (id: number, changes: Partial<Organization>) => void
  onRemove: (id: number) => void
}

export default function OrgCard({ organization, onUpdate, onRemove }: Props) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  const btn = 'h-7 px-3 text-[11px]'
  const fullName = `${organization.user.first_name} ${organization.user.last_name}`

  const approve = async () => {
    if (!token) return
    onUpdate(organization.id, { status: 'verified' })
    await axios.patch(
      `/admin/organizations/${organization.id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const reject = async () => {
    if (!token) return
    onUpdate(organization.id, { status: 'rejected' })
    await axios.patch(
      `/admin/organizations/${organization.id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const softDelete = async () => {
    if (!token) return
    if (!confirm('Delete this organization?')) return
    onRemove(organization.id)
    await axios.delete(`/admin/organizations/${organization.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  const statusColor =
    organization.status === 'verified'
      ? 'bg-emerald-100 text-emerald-600'
      : organization.status === 'pending'
      ? 'bg-yellow-100 text-yellow-600'
      : 'bg-red-100 text-red-600'

  return (
    <Card className="relative p-4 bg-white dark:bg-[#0b1220] flex flex-col gap-3">
      {/* Status */}
      <span
        className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor}`}
      >
        {organization.status}
      </span>

      {/* Organization Info */}
      <div className="flex items-start gap-3">
        {organization.logo ? (
          <Image
            src={`http://localhost:8000/storage/${organization.logo}`}
            alt={fullName || 'Organization logo'}
            width={40}
            height={40}
            className="rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold">
            {organization.user.first_name[0]}
          </div>
        )}

        <div className="mt-2">
          <p className="text-sm font-semibold">{fullName}</p>
          <p className="text-xs text-gray-500">{organization.user.email}</p>

          <div className="mt-2">
            {organization.type && (
              <p className="mb-1 text-xs text-muted-foreground">
                {organization.type}
              </p>
            )}
            {organization.phone && (
              <p className="mb-1 text-xs text-muted-foreground">
                {organization.phone}
              </p>
            )}
            {organization.address && (
              <p className="mb-1 text-xs text-muted-foreground">
                {organization.address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex justify-between gap-2">
        {/* VERIFIED */}
        {organization.status === 'verified' && (
          <>
            <Link href={`/dashboard/admin/organization/${organization.id}`}>
              <Button size="sm" className={btn}>
                View
              </Button>
            </Link>
            <Button
              size="sm"
              className={btn}
              variant="secondary"
              onClick={reject}
            >
              Reject
            </Button>
          </>
        )}

        {/* PENDING */}
        {organization.status === 'pending' && (
          <>
            <Link href={`/dashboard/admin/organization/${organization.id}`}>
              <Button size="sm" className={btn}>
                View
              </Button>
            </Link>
            <Button size="sm" className={btn} onClick={approve}>
              Approve
            </Button>
            <Button
              size="sm"
              className={btn}
              variant="secondary"
              onClick={reject}
            >
              Reject
            </Button>
          </>
        )}

        {/* REJECTED */}
        {organization.status === 'rejected' && (
          <>
            <Link href={`/dashboard/admin/organization/${organization.id}`}>
              <Button size="sm" className={btn}>
                View
              </Button>
            </Link>
            <Button size="sm" className={btn} onClick={approve}>
              Approve
            </Button>
            <Button
              size="sm"
              className={btn}
              variant="destructive"
              onClick={softDelete}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
