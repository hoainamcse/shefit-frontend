import { Topic, TopicPayload } from '@/models/topic'
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

export const queryKeyTopics = 'topics'

export async function getTopics(query?: any): Promise<ListResponse<Topic>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/topics' + '?' + searchParams)
  return response.json()
}

export async function createTopic(data: TopicPayload): Promise<ApiResponse<Topic>> {
  const response = await fetchData('/v1/topics', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateTopic(id: Topic['id'], data: TopicPayload): Promise<ApiResponse<Topic>> {
  const response = await fetchData(`/v1/topics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteTopic(id: Topic['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/topics/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkTopic(ids: Topic['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/topics/bulk`, {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}
