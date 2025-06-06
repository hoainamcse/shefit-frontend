type Blog = {
  id: number
  title: string
  content: string
  cover_image: string
  thumbnail_image: string
}

type BlogPayload = Omit<Blog, 'id'>

export type { Blog, BlogPayload }
