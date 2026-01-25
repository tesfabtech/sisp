export type FundingType =
  | 'grant'
  | 'equity'
  | 'loan'
  | 'convertible_note'

export type FundingStatus =
  | 'pending'
  | 'open'
  | 'closed'
  | 'cancelled'

export interface FundingOpportunity {
  id: number
  title: string
  short_description: string
  description: string
  deadline: string
  amount: number
  funding_type: FundingType
  status: FundingStatus
  application_number: number
 organization: {
    user: {
      first_name: string
      last_name: string
    }
    logo?: string
  }
  is_featured: boolean
  created_at: string
  deleted_at?: string | null
}
