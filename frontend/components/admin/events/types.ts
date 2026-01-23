export type Event = {
  id: number
  title: string
  short_description?: string
  description?: string
  event_type: 'conference' | 'workshop' | 'networking' | 'bootcamp' | 'training'
  venue: 'physical' | 'virtual' | 'hybrid'
  location?: string
  event_datetime: string
  status: 'pending' | 'published' | 'cancelled' | 'completed'
  deleted_at?: string | null
  is_featured: boolean
  organization: {
    user: {
      first_name: string
      last_name: string
    }
    logo?: string
  }
}
