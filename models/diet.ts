type Diet = {
  id: number
  name: string
  image: string
  description: string
  created_at: string
  updated_at: string
}

type DietPayload = Omit<Diet, 'id' | 'created_at' | 'updated_at'>

export type { Diet, DietPayload }
