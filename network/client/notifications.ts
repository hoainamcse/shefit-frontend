import { Notification, NotificationPayload } from '@/models/notification'
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

export const queryKeyNotifications = 'notifications'

export async function getNotifications(query?: any): Promise<ListResponse<Notification>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/notifications${searchParams}`)
  return response.json()
}

export async function createNotification(data: NotificationPayload): Promise<ApiResponse<Notification>> {
  const response = await fetchData('/v1/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateNotification(
  id: Notification['id'],
  data: NotificationPayload
): Promise<ApiResponse<Notification>> {
  const response = await fetchData(`/v1/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteNotification(id: Notification['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/notifications/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// export async function deleteBulkNotification(ids: Notification['id'][]): Promise<ApiResponse<string>> {
//   const response = await fetchData('/v1/notifications/bulk', {
//     method: 'POST',
//     body: JSON.stringify(ids),
//   })
//   return response.json()
// }
