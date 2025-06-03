import { Diet } from './diet'

type Dish = {
  id: string
  name: string
  description: string
  diet: Diet | null
  image: string
  calories: number
  protein: number
  carb: number
  fat: number
  fiber: number
  created_at: string
  updated_at: string
}

type DishPayload = Omit<Dish, 'id' | 'created_at' | 'updated_at' | 'diet'> & {
  diet_id: Diet['id'] | null
}

export type { Dish, DishPayload }
