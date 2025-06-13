'use server'

import { fetchData } from "../helpers/fetch-data"
import type { Subscription } from "@/models/subscription-admin"
import type { ListResponse } from "@/models/response"
import { User } from "@/models/user"
import { Course } from "@/models/course"

export async function getSubAdminSubscriptions(): Promise<ListResponse<Subscription>> {
    const response = await fetchData("/v1/sub_admin/subscriptions", {
        next: { revalidate: 0, tags: ["subscriptions"] }
    })
    return await response.json()
}

export async function getSubAdminUsers(): Promise<ListResponse<User>> {
    const response = await fetchData("/v1/sub_admin/user-subscriptions", {
        next: { tags: ["sub_admin_users"] }
    })
    return await response.json()
}


export async function getSubAdminCourses(token: string, format?: 'video' | 'live', isOneOnOne?: boolean): Promise<ListResponse<Course>> {

const params = new URLSearchParams()
  if (format) params.append('course_format', format)
  if (isOneOnOne !== undefined) params.append('is_one_on_one', String(isOneOnOne))
  const query = params.toString()
  const url = `/v1/sub_admin/courses${query ? `?${query}` : ''}`

    const response = await fetchData(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        next: {
            revalidate: 0,
            tags: [format ? `courses:${format}` : 'courses'],
          },
    })
    return await response.json()
}

