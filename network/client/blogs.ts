import type { ApiResponse, ListResponse } from '@/models/response'
import type { Blog, BlogPayload } from '@/models/blog'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyBlogs = 'blogs'

export async function getBlogs(query?: any): Promise<ListResponse<Blog>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/blogs' + '?' + searchParams)
  return response.json()
}

export async function createBlog(data: BlogPayload): Promise<ApiResponse<Blog>> {
  const response = await fetchData('/v1/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function getBlog(id: Blog['id']): Promise<ApiResponse<Blog>> {
  const response = await fetchData(`/v1/blogs/${id}`)
  return response.json()
}

export async function updateBlog(id: Blog['id'], data: BlogPayload): Promise<ApiResponse<Blog>> {
  const response = await fetchData(`/v1/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteBlog(id: Blog['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/blogs/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkBlog(ids: Blog['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/blogs/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}
