export type AdminUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: 'startup' | 'mentor' | 'investor' | 'organization' | 'public'
  status: 'active' | 'suspended'
}
