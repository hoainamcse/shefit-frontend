import type { ApiResponse, ListResponse } from '@/models/response'
import { User } from '@/models/user'

import type { UploadResponse } from '@/models/upload'
import { fetchData } from '../helpers/fetch-data'

const S3_BASE_URL = 'http://shefit-stg.s3.amazonaws.com'

export const getS3FileUrl = (s3Key: string): string => {
  if (!S3_BASE_URL) {
    console.error('Error: NEXT_PUBLIC_S3_BASE_URL is not defined in environment variables.')
    return ''
  }
  if (!s3Key) return ''
  // Ensure no double slashes if s3Key might start with one
  return `${S3_BASE_URL.replace(/\/$/, '')}/${s3Key.replace(/^\//, '')}`
}

export const uploadImageApi = async (file: File): Promise<UploadResponse> => {
  const path = '/v1/s3/upload'
  const formData = new FormData()
  formData.append('file', file, file.name)

  try {
    const response = await fetchData(
      path,
      {
        method: 'POST',
        body: formData,
      },
      false
    )

    const responseData: UploadResponse = await response.json()

    if (responseData.status !== 'success') {
      const errorMessage =
        responseData.message ||
        (responseData.data && responseData.data.message) ||
        'Upload indicated failure in response body.'
      throw new Error(errorMessage)
    }

    return responseData
  } catch (error) {
    console.error('Image upload failed (using fetchData):', error)
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`)
    }
    throw new Error('An unknown error occurred during the image upload.')
  }
}

export interface FileMetadata {
  filename: string
  s3_key: string
  is_deleted: boolean
  mime_type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
  id: number
  user_id: User['id']
  size: number
  created_at: string
  updated_at: string
}

export async function getFiles(query?: any): Promise<ListResponse<FileMetadata>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/s3/all' + '?' + searchParams, {
    method: 'GET',
  })
  return response.json()
}

export async function deleteBulkFiles(ids: number[]): Promise<ApiResponse<null>> {
  const response = await fetchData(`/v1/s3/bulk`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ids),
  })
  return response.json()
}
