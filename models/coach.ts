type Coach = {
  id: number
  name: string
  image: string
  detail: string
  description: string
  created_at: string
  updated_at: string
}

type CoachPayload = Omit<Coach, 'id' | 'created_at' | 'updated_at'>

export type { Coach, CoachPayload }
