import { ApiResponse, ListResponse } from '@/models/response'
import { fetchData } from '../helpers/fetch-data'
import { Message, Greeting } from '@/models/chatbot'

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
