export type Mentor = {
  id: number
  title?: string | null
  bio?: string | null
  expertise?: string[] | null
  industries?: string[] | null
  is_available: boolean
  status: 'pending' | 'approved' | 'rejected'
  featured: boolean

  profile_image?: string | null

  user: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
}
