export interface TeamMember {
  id: string
  username: string | null
  avatar_url: string | null
  updated_at: string | null
  email?: string
  role?: string
}