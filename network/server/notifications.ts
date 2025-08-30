'use server'

import type { Notification } from '@/models/notification'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getNotifications(query?: any): Promise<ListResponse<Notification>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchDataServer(`/v1/notifications${searchParams}`)
  return response.json()
}

export async function getNotification(id: Notification['id']): Promise<ApiResponse<Notification>> {
  const response = await fetchDataServer(`/v1/notifications/${id}`)
  return response.json()
}
