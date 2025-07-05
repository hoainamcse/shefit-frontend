import { ApiResponse, ListResponse } from '@/models/response'
import { fetchData } from '../helpers/fetch-data'
import { Message, Greeting, GreetingPayload, UserChatbotSettings, UserTokenUsage } from '@/models/chatbot'

export const queryKeyGreetings = 'greeting'

export async function getConversationHistory(params: string): Promise<ApiResponse<Message[]>> {
  const response = await fetchData(`/v1/chatbot/conversation/history${params}`, {
    method: 'GET',
  })
  return response.json()
}

export async function getGreetings(params: string): Promise<ListResponse<Greeting>> {
  const response = await fetchData(`/v1/greeting/search${params}`, {
    method: 'GET',
  })
  return response.json()
}

export async function getListGreeting(query?: any): Promise<ListResponse<Greeting>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/greeting' + '?' + searchParams)
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

export async function getUserTokenUsage(userId: string): Promise<ApiResponse<UserTokenUsage>> {
  const response = await fetchData(`/v1/chatbot/token-usage/users/${userId}`, {
    method: 'GET',
  })
  return response.json()
}

export async function getUserChatbotSettings(userId: string): Promise<ApiResponse<UserChatbotSettings>> {
  const response = await fetchData(`/v1/users/${userId}/chatbot/setting`, {
    method: 'GET',
  })
  return response.json()
}

export async function updateUserChatbotSettings(userId: string, data: Omit<UserChatbotSettings, 'id'>): Promise<ApiResponse<UserChatbotSettings>> {
  const response = await fetchData(`/v1/users/${userId}/chatbot/setting`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}



