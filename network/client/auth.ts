import { fetchData } from '../helpers/fetch-data'

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
    data: jsonData
  }
}
