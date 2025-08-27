import type { Topic } from './topic'

type Blog = {
  id: number
  title: string
  content: string
  cover_image: string
  thumbnail_image: string
  topics: Topic[]
}

type BlogPayload = Omit<Blog, 'id' | 'topics'> & { topic_ids: Topic['id'][] }

export type { Blog, BlogPayload }
