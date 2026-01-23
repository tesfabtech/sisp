// components/admin/knowledge/types.ts

export type KnowledgeStatus = 'draft' | 'published'

export type KnowledgeType =
  | 'technology'
  | 'business'
  | 'design'
  | 'marketing'
  | 'finance'
  | 'career'
  | 'other'

export interface KnowledgeHub {
  id: number
  title: string
  slug: string
  image?: string | null
  short_description: string
  description: string
  type: KnowledgeType
  max_read_time: number
  file: string
  status: KnowledgeStatus
  is_featured: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
}
