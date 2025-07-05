import { fetchData } from '../helpers/fetch-data'

export async function register(data: any) {
  const response = await fetchData('/v1/auth:signUp', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}
