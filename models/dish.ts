import type { Diet } from './diet'

type Dish = {
  id: number
  name: string
  description: string
  diet: Diet | null
  image: string
  youtube_url: string
  nutrients: string
  created_at: string
  updated_at: string
}

type DishPayload = Omit<Dish, 'id' | 'created_at' | 'updated_at' | 'diet'> & {
  diet_id: Diet['id'] | null
}

export type { Dish, DishPayload }
