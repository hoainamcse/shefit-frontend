import { ApiResponse, ListResponse } from '@/models/response'
import { fetchData } from '../helpers/fetch-data'
import { Message, Greeting, GreetingPayload } from '@/models/chatbot'

export const queryKeyGreetings = 'greetings'
export const queryKeyConversations = 'conversations'

export async function getConversation(id: string, query: any): Promise<ListResponse<Message>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/chatbot/conversations/${id}` + searchParams)
  return response.json()
}

export async function getGreetings(query?: any): Promise<ListResponse<Greeting>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData('/v1/greeting' + searchParams)
  return response.json()
}

export async function createGreeting(data: GreetingPayload): Promise<ApiResponse<Greeting>> {
  const response = await fetchData(`/v1/greeting`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateGreeting(id: Greeting['id'], data: GreetingPayload): Promise<ApiResponse<Greeting>> {
  const response = await fetchData(`/v1/greeting/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteGreeting(id: Greeting['id']): Promise<ApiResponse<Greeting>> {
  const response = await fetchData(`/v1/greeting/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkGreeting(ids: Greeting['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/greeting/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

export async function importGreetingExcel(file: File): Promise<ApiResponse<Greeting>> {
  const formData = new FormData()
  formData.append('file', file, file.name)

  const response = await fetchData(
    '/v1/greeting/import-excel',
    {
      method: 'POST',
      body: formData,
    },
    false
  )

  return response.json()
}
