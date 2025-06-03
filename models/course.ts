type CourseFormat = 'video' | 'live'

type Subscription = {
  id: number
  name: string
}

type FormCategory = 'pear' | 'apple' | 'rectangle' | 'hourglass' | 'inverted_triangle'

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

type Course = {
  id: number
  thumbnail_image: string
  description: string
  course_name: string
  course_format: CourseFormat
  trainer: string
  form_categories: FormCategory[]
  difficulty_level: DifficultyLevel
  is_public: boolean
  is_popular: boolean
  subscriptions: Subscription[]
  cover_image: string
  created_at: string
  is_free: boolean
  updated_at: string
  subscription_ids: number[]
  equipment_ids: number[]
  muscle_group_ids: number[]
}

export type { CourseFormat, FormCategory, DifficultyLevel, Course, Subscription }
