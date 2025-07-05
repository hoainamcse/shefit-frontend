import { FormCategory, FormCategoryPayload } from '@/models/form-category'
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

export const queryKeyFormCategories = 'form-categories'

export async function getFormCategories(query?: any): Promise<ListResponse<FormCategory>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/form_categories' + '?' + searchParams)
  return response.json()
}

export async function createFormCategory(data: FormCategoryPayload): Promise<ApiResponse<FormCategory>> {
  const response = await fetchData('/v1/form_categories', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateFormCategory(id: FormCategory['id'], data: FormCategoryPayload): Promise<ApiResponse<FormCategory>> {
  const response = await fetchData(`/v1/form_categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteFormCategory(id: FormCategory['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/form_categories/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkFormCategory(ids: FormCategory['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/form_categories/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

