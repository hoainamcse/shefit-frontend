type GreetingStatus = 'ACTIVE' | 'INACTIVE'

export type Message = {
  id: string
  content: string
  role: string
  content_type: string
  created_at: string
  updated_at: string
  status?: string
}

export type Greeting = {
  id: number
  message: string
  prompt: string
  status: GreetingStatus
  created_at: string
  updated_at: string
}

export type TotalTokenUsage = {
  total_tokens: number
  available_tokens: number
}

export type UserTokenUsage = {
  user_id: number
  total_tokens: number
}

export type UserChatbotSettings = {
  id: number
  is_enable_chatbot: boolean
}

export type GreetingPayload = Omit<Greeting, 'id' | 'created_at' | 'updated_at'>


