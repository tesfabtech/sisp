'use client'

import axios from '@/lib/axios'
import { Button } from '@/components/ui/button'

type Admin = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
}

export default function AdminTable({
  admins,
  onChange,
}: {
  admins: Admin[]
  onChange: () => void
}) {
  const toggleStatus = async (id: number) => {
    const token = localStorage.getItem('admin_token')

    await axios.patch(
      `/admin/admins/${id}/status`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    onChange()
  }

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {admins.map(admin => (
            <tr key={admin.id} className="border-b">
              <td className="p-3 font-medium">
                {admin.first_name} {admin.last_name}
              </td>
              <td className="p-3">{admin.email}</td>
              <td className="p-3 capitalize">{admin.role}</td>
              <td className="p-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full
                    ${
                      admin.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                >
                  {admin.status}
                </span>
              </td>
              <td className="p-3 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleStatus(admin.id)}
                >
                  {admin.status === 'active' ? 'Suspend' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
