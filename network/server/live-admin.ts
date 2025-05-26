'use server'

import type { Day, Session } from "@/models/live-admin"
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'
import { revalidateTag } from "next/cache"

export async function getLives(courseId: string): Promise<ListResponse<Day>> {
    const response = await fetchData(`/v1/courses/${courseId}/live-classes/`, {
        next: {
            revalidate: 0,
        },
    })
    return await response.json()
}

export async function createLiveDay(courseId: string, dayData: any): Promise<ApiResponse<Day>> {
    const response = await fetchData(`/v1/courses/${courseId}/live-classes/`, {
        method: "POST",
        body: JSON.stringify(dayData),
    })
    revalidateTag(`lives:${courseId}`)
    return await response.json()
}

export async function updateLiveDay(courseId: string, liveId: string, dayData: any): Promise<ApiResponse<Day>> {
    const response = await fetchData(`/v1/courses/${courseId}/live-classes/${liveId}`, {
        method: "PATCH",
        body: JSON.stringify(dayData),
    })
    revalidateTag(`lives:${courseId}`)
    return await response.json()
}
    
export async function deleteLiveDay(courseId: string, liveDayId: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/courses/${courseId}/live-classes/${liveDayId}`, {
        method: "DELETE",
    })
    revalidateTag(`lives:${courseId}`)
    return await response.json()
}

export async function createDaySession(courseId: string, liveDayId: string, sessionData: any): Promise<ApiResponse<Session>> {
    const response = await fetchData(`/v1/courses/${courseId}/live-classes/${liveDayId}/sessions`, {
        method: "POST",
        body: JSON.stringify(sessionData),
    })
    revalidateTag(`lives:${courseId}`)
    return await response.json()
}

export async function updateDaySession(courseId: string, liveDayId: string, sessionId: string, sessionData: any): Promise<ApiResponse<Session>> {
    const response = await fetchData(`/v1/courses/${courseId}/live-classes/${liveDayId}/sessions/${sessionId}`, {
        method: "PATCH",
        body: JSON.stringify(sessionData),
    })
    revalidateTag(`lives:${courseId}`)
    return await response.json()
}

export async function deleteDaySession(courseId: string, liveDayId: string, sessionId: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/courses/${courseId}/live-classes/${liveDayId}/sessions/${sessionId}`, {
        method: "DELETE",
    })
    revalidateTag(`lives:${courseId}`)
    return await response.json()
}
    


    
