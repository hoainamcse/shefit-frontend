import type { Blog } from "@/models/blog"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse, ApiResponse } from "@/models/response"

export async function getBlogs(): Promise<ListResponse<Blog>> {
    const response = await fetchData("/v1/blogs", { next: { tags: ["blogs"] } })
    return await response.json()
}

export async function getBlog(id: number): Promise<ApiResponse<Blog>> {
    const response = await fetchData(`/v1/blogs/${id}`, { next: { tags: ["blogs"] } })
    return await response.json()
}