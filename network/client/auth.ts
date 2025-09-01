import { PasswordGrant, TokenResponse } from '@/models/auth'
import { fetchData } from '../helpers/fetch-data'

export const generateToken = async (data: Omit<PasswordGrant, 'grant_type'>): Promise<TokenResponse> => {
  const response = await fetchData('/v1/auth/token', {
    method: 'POST',
    body: JSON.stringify({ grant_type: 'password', ...data }),
  })
  return response.json()
}

export async function register(data: any) {
  const response = await fetchData('/v1/auth:signUp', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function resetPassword(data: any) {
  const response = await fetchData('/v1/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  const jsonData = await response.json()
  return {
    status: response.status,
    data: jsonData,
  }
}
