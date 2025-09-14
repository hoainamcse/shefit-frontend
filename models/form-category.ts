type FormCategory = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

type FormCategoryPayload = Omit<FormCategory, 'id' | 'created_at' | 'updated_at'>

export type { FormCategory, FormCategoryPayload }
