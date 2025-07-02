import type { Subscription } from './subscription'
import type { MuscleGroup } from './muscle-group'
import type { Equipment } from './equipment'
import { FormCategory } from './form-category'
import { WorkoutMethod } from './workout-method'

type CourseFormat = 'video' | 'live'
type CourseForm = 'pear' | 'apple' | 'rectangle' | 'hourglass' | 'inverted_triangle'
type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

type Course = {
  id: number
  thumbnail_image: string
  description: string
  course_name: string
  course_format: CourseFormat
  trainer: string
  difficulty_level: CourseLevel
  is_public: boolean
  is_popular: boolean
  cover_image: string
  created_at: string
  is_free: boolean
  updated_at: string
  summary: string
  free_amount: number
  is_one_on_one: boolean
  // muscle_groups: MuscleGroup[]
  // equipments: Equipment[]
  form_categories: FormCategory[]
  workout_methods: WorkoutMethod[]
  description_homepage_1: string
  description_homepage_2: string
  image_homepage: string
  subscriptions: Subscription[]
  relationships?: {
    equipments: Equipment[]
    muscle_groups: MuscleGroup[]
    subscriptions: Subscription[]
    form_categories: FormCategory[]
    workout_methods: WorkoutMethod[]
  }
}

type CoursePayload = Omit<
  Course,
  'id' | 'created_at' | 'updated_at' | 'muscle_groups' | 'equipments' | 'subscriptions' | 'relationships' | 'form_categories' | 'workout_methods'
> & {
  muscle_group_ids: MuscleGroup['id'][]
  equipment_ids: Equipment['id'][]
  subscription_ids: Subscription['id'][]
  form_category_ids: FormCategory['id'][]
  workout_method_ids: WorkoutMethod['id'][]
}

export type { CourseFormat, CourseForm, CourseLevel, Course }
export type { CoursePayload }

// Course Video
type CourseWeek = {
  id: number
  week_number: number
}

type WeekDay = {
  id: number
  day_number: number
  description: string
}

type CircuitExercise = {
  id?: number
  circuit_exercise_title: string
  circuit_exercise_description: string
  youtube_url: string
  no: number
}

type DayCircuit = {
  id: number
  name: string
  description: string
  auto_replay_count: number
  circuit_exercises: CircuitExercise[]
  created_at: string
  updated_at: string
}

type CourseWeekPayload = Omit<CourseWeek, 'id'>
type WeekDayPayload = Omit<WeekDay, 'id'>
type DayCircuitPayload = Omit<DayCircuit, 'id' | 'created_at' | 'updated_at'>

export type { CourseWeek, WeekDay, CircuitExercise, DayCircuit }
export type { CourseWeekPayload, WeekDayPayload, DayCircuitPayload }

// Course Live
type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

type DaySession = {
  id: number
  session_number: number
  name: string
  description: string
  start_time: string
  end_time: string
  link_zoom: string
}

type LiveDay = {
  id: number
  day_of_week: DayOfWeek
  start_time: string // ! needed?
  end_time: string // ! needed?
  description: string
  sessions: DaySession[]
}

type LiveDayPayload = Omit<LiveDay, 'id' | 'sessions'>
type DaySessionPayload = Omit<DaySession, 'id'>

export type { DayOfWeek, LiveDay, DaySession }
export type { LiveDayPayload, DaySessionPayload }
