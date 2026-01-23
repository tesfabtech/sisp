export type Organization = {
  id: number
  type?: string | null
  description?: string | null
  logo?: string | null
  cover_image?: string | null
  website?: string | null
  phone?: string | null
  address?: string | null
  status: 'pending' | 'verified' | 'rejected'
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  deleted_at?: string | null
}
