type FormCategory = {
  id: string;
  name: string;
}

type FormCategoryPayload = Omit<FormCategory, 'id'>

export type { FormCategory, FormCategoryPayload }
