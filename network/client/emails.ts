import { fetchData } from '../helpers/fetch-data'

export async function sendOTP(email: string) {
  const response = await fetchData('/v1/email/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  return response.json()
}

export async function verifyOTP(email: string, otp: string, counter: number) {
  const response = await fetchData('/v1/email/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp, counter }),
  })
  return response.json()
}

export async function sendResetPasswordOTP(email: string) {
  const response = await fetchData('/v1/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  return response.json()
}

export async function verifyResetPasswordOTP(email: string, otp: string, counter: number) {
  const response = await fetchData('/v1/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp, counter }),
  })
  return response.json()
}