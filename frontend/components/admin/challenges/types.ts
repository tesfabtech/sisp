export type ChallengeStatus = 'pending' | 'open' | 'cancelled' | 'closed'

export type ChallengeType = 'innovation' | 'hackathon' | 'pitch'

export interface Challenge {
  id: number
  title: string
  type: ChallengeType
  status: ChallengeStatus
  award: string | null
  deadline: string
  participant_number: number
  is_featured: boolean
  organization: {
    logo: string | null
    user: {
      first_name: string
      last_name: string
    }
  }
}
