export type Startup = {
  id: number
  user_id: number

  name: string
  tagline?: string | null
  logo?: string | null
  cover_image?: string | null
  website?: string | null
  video_url?: string | null
  description?: string | null
  industry?: string | null
  stage?: string | null
  location?: string | null
  team_size?: number | null
  founded_year?: number | null
  status: 'pending' | 'approved' | 'rejected'
  featured: boolean
  created_at: string
  updated_at: string

  // ✅ Add founder
  founder?: {
    id: number
    name: string
    email: string
  } | null
}
