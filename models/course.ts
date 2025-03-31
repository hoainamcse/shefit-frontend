type CourseFormat = 'video' | 'live'

type FormCategory = 'pear' | 'apple' | 'rectangle' | 'hourglass' | 'inverted_triangle'

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

type Live = {
  id: number
  description: string
  day_of_week: string
  start_time: string
  end_time: string
}

type Course = {
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
  equipment_ids: string[]
  muscle_group_ids: string[]
  is_public: boolean
  created_at: string
  updated_at: string
  // live: Live
}

export type { CourseFormat, FormCategory, DifficultyLevel, Course }
