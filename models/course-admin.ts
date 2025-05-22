type CourseFormat = 'video' | 'live'

type SubscriptionFormat = 'video' | 'live' | 'both'

type Subscription = {
  id: number
  name: string
  course_format: SubscriptionFormat
}

type FormCategory = 'pear' | 'apple' | 'rectangle' | 'hourglass' | 'inverted_triangle'

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

type ListCourse = {
  id: number
  course_name: string
  course_format: CourseFormat
  summary: string
  description: string
  trainer: string
  form_categories: FormCategory[]
  difficulty_level: DifficultyLevel
  visible_in: string[]
  cover_image: string
  thumbnail_image: string
  subscriptions: Subscription[]
  is_public: boolean
  is_popular: boolean
  created_at: string
  updated_at: string
  category: string,
  duration_weeks: number,
  goal: string,
  suitable_for: string,
  days_per_week: number,
  minutes_per_session: number,
  is_free: boolean,
  free_amount: number,
  is_one_on_one: boolean
}

type DetailCourse= {
  id: number
  course_name: string
  course_format: CourseFormat
  summary: string
  description: string
  trainer: string
  form_categories: FormCategory[]
  difficulty_level: DifficultyLevel
  visible_in: string[]
  cover_image: string
  thumbnail_image: string
  equipment_ids: number[]
  muscle_group_ids: number[]
  subscription_ids: number[]
  is_public: boolean
  is_popular: boolean
  created_at: string
  updated_at: string
  category: string,
  duration_weeks: number,
  goal: string,
  suitable_for: string,
  days_per_week: number,
  minutes_per_session: number,
  is_free: boolean,
  free_amount: number,
  is_one_on_one: boolean
}

export type { CourseFormat, FormCategory, DifficultyLevel, Subscription, ListCourse, DetailCourse }
