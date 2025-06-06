'use server'

import type { Blog } from '@/models/blog'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getBlogs(): Promise<ListResponse<Blog>> {
  const response = await fetchDataServer('/v1/blogs', { next: { tags: ['blogs'] } })
  return await response.json()
}

export async function getBlog(id: number): Promise<ApiResponse<Blog>> {
  const response = await fetchDataServer(`/v1/blogs/${id}`, { next: { tags: ['blogs'] } })
  return await response.json()
}
