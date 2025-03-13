type CourseFormat = 'video' | 'live'

type FormCategory = 'pear' | 'apple' | 'rectangle' | 'hourglass' | 'inverted_triangle'

type DifficultyLevel = 'beginner' | 'immediate' | 'advanced'

type Course = {
  id: number
  course_name: string
  course_format: CourseFormat
  summary: string
  trainer: string
  form_categories: FormCategory[]
  difficulty_level: DifficultyLevel
  cover_image: string
  thumbnail_image: string
  equipment_ids: string[]
  muscle_group_ids: string[]
  created_at: string
  updated_at: string
}

export type { CourseFormat, FormCategory, DifficultyLevel, Course }
