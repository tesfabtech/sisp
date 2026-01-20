'use client'

import { AdminUser } from '@/components/admin/users/types'
import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'

type Props = {
  users: AdminUser[]
  loading?: boolean
}

export default function UserTable({ users, loading }: Props) {
  const toggleStatus = async (id: number) => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      await axios.patch(
        `/admin/users/${id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      window.location.reload()
    } catch {
      alert('Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="text-sm text-gray-400">
        Loading users...
      </div>
    )
  }

  if (!users.length) {
    return (
      <div className="text-sm text-gray-400">
        No users found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-950 rounded-xl shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr
              key={user.id}
              className="border-t border-gray-200 dark:border-gray-800"
            >
              <td className="p-3 font-medium">
                {user.first_name} {user.last_name}
              </td>

              <td className="p-3 text-gray-500">
                {user.email}
              </td>

              <td className="p-3 capitalize">
                {user.role}
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                >
                  {user.status}
                </span>
              </td>

              <td className="p-3 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
