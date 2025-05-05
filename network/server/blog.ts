'use server'

import { Blog } from "@/models/blog"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { ApiResponse, ListResponse } from "@/models/response"
import { revalidateTag } from "next/cache"
import { fetchData } from "../helpers/fetch-data"


export async function getBlogs(): Promise<ListResponse<Blog>> {
  const response = await fetchData("/v1/blogs", { next: { tags: ["blogs"] } })
  return await response.json()
}

export async function getBlog(id: number): Promise<ApiResponse<Blog>> {
  const response = await fetchData(`/v1/blogs/${id}`, { next: { tags: ["blogs"] } })
  return await response.json()
}


export async function getListBlogs(): Promise<ListResponse<Blog>> {
    const response = await fetchDataServer('/v1/blogs', {
      method: 'GET',
      credentials: 'include',
    })
    revalidateTag(`blogs`)
    return await response.json()
  }

  export async function getDetailBlog(blog_id: string): Promise<ApiResponse<Blog>> {
    const response = await fetchDataServer(`/v1/blogs/${blog_id}`, {
      method: 'GET',
      credentials: 'include',
    })
    return await response.json()
  }

  export async function createBlog(data: any): Promise<ApiResponse<Blog>> {
    const response = await fetchDataServer('/v1/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
    })
    revalidateTag(`blogs`)
    return await response.json()
  }

  export async function updateBlog(blog_id: string, data: any): Promise<ApiResponse<Blog>> {
    const response = await fetchDataServer(`/v1/blogs/${blog_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      credentials: 'include',
    })
    revalidateTag(`blogs`)
    return await response.json()
  }

  export async function deleteBlog(blog_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/blogs/${blog_id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    revalidateTag(`blogs`)
    return await response.json()
  }
    


