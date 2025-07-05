import { MuscleGroup } from "./muscle-group"

type Product = {
  data: any
  id: number
  name: string
  description: string
  price: number
  weight: number
  category_id: number
  image_urls: string[]
  variants: Variant[]
  features: Feature[]
  muscle_groups: MuscleGroup[]
  created_at: string
  updated_at: string
}

type ProductPayload = Omit<Product, 'id' | 'created_at' | 'updated_at'>

export type { Product }
export type { ProductPayload }

export type Variant = {
  id: number
  color_id: number
  size_id: number
  in_stock: boolean
}

export type Feature = {
  id: number
  name: string
  image_url: string
}

export type ProductCategory = {
  id: number
  name: string
}

export type ProductColor = {
  id: number
  name: string
  hex_code: string
  variants: Variant[]
}

export type ProductSize = {
  id: number
  size: string
  variants: Variant[]
}
