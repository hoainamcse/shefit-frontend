'use server'

import { ApiResponse, ListResponse } from "@/models/response";
import { fetchDataServer } from "../helpers/fetch-data-server";
import { UserCourse } from "@/models/user-courses";
import { revalidateTag } from "next/cache";

export async function getUserCourses(userId: string): Promise<ListResponse<UserCourse>> {
    const response = await fetchDataServer(`/v1/users/${userId}/courses`, {
        method: 'GET',
        credentials: 'include',
    })
    return await response.json()
}

export async function createUserCourse(data: any, user_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/courses`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`user-courses:${user_id}`)
    return await response.json()
}

export async function deleteUserCourse(user_id: string, course_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/courses/${course_id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag(`user-courses:${user_id}`)
    return await response.json()
}


