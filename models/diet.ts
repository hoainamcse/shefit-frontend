type Diet = {
  id: number
  name: string
  image: string
  description: string
}

type DietPayload = Omit<Diet, 'id'>

export type { Diet, DietPayload }
