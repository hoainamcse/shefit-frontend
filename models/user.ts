type User = {
  id: number
  username: string
  fullname: string
  phone_number: string
  email: string
  province: string
  address: string
  provider: 'default' | 'google'
  provider_id: string | null
  role: 'admin' | 'normal_user' | 'sub_admin'
  enable_chatbot: boolean
  enable_chatbot_actions: boolean
  token_usage: number
  created_at: string
  updated_at: string
}

export type { User }
