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
  status: string
  created_at: string
  updated_at: string
}
