type SessionPayload = {
  userId: string
  role: 'admin' | 'sub_admin' | 'normal_user'
  accessToken: string
  refreshToken: string
}

type PasswordGrant = {
  grant_type: 'password'
  username: string
  password: string
}

type RefreshTokenGrant = {
  grant_type: 'refresh_token'
  refresh_token: string
}

export type { PasswordGrant, RefreshTokenGrant, SessionPayload }

type Register = {
  username: string
  password: string
  fullname: string
  phone_number: string
}

type TokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

type Oauth2AuthUrlResponse = {
  url: string
}

export type { Register, TokenResponse, Oauth2AuthUrlResponse }
