import { ApiResponse, ListResponse } from '@/models/response'
import { fetchData } from '../helpers/fetch-data'
import { Message, Greeting, GreetingPayload } from '@/models/chatbot'

export const queryKeyGreetings = 'greeting'

export async function getConversationHistory(params: string): Promise<ApiResponse<Message[]>> {
  const response = await fetchData(`/v1/chatbot/conversation/history${params}`, {
    method: 'GET',
  })
  return await response.json()
}

export async function getGreetings(params: string): Promise<ListResponse<Greeting>> {
  const response = await fetchData(`/v1/greeting/search${params}`, {
    method: 'GET',
  })
  return await response.json()
}

export async function getListGreeting(params?: any): Promise<ListResponse<Greeting>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/greeting' + '?' + queryParams)
  return await response.json()
}

export async function createGreeting(data: GreetingPayload): Promise<ApiResponse<Greeting>> {
  const response = await fetchData(`/v1/greeting`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateGreeting(id: Greeting['id'], data: GreetingPayload): Promise<ApiResponse<Greeting>> {
  const response = await fetchData(`/v1/greeting/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteGreeting(id: Greeting['id']): Promise<ApiResponse<Greeting>> {
  const response = await fetchData(`/v1/greeting/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

export async function deleteBulkGreeting(ids: Greeting['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/greeting/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return await response.json()
}


