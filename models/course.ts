import type { Subscription } from './subscription'
import type { MuscleGroup } from './muscle-group'
import type { Equipment } from './equipment'

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
  form_categories: CourseForm[]
  difficulty_level: CourseLevel
  is_public: boolean
  is_popular: boolean
  subscriptions: any[] // ! not in schema
  cover_image: string
  created_at: string
  is_free: boolean
  updated_at: string
  summary: string
  free_amount: number
  is_one_on_one: boolean
  subscription_ids: Subscription['id'][]
  muscle_group_ids: MuscleGroup['id'][]
  equipment_ids: Equipment['id'][]
}

type CoursePayload = Omit<Course, 'id' | 'created_at' | 'updated_at' | 'subscriptions'>

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
  id: number
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
type CircuitExercisePayload = Omit<CircuitExercise, 'id'>
type DayCircuitPayload = Omit<DayCircuit, 'id' | 'circuit_exercises' | 'created_at' | 'updated_at'> & {
  circuit_exercises: CircuitExercisePayload[]
}

export type { CourseWeek, WeekDay, CircuitExercise, DayCircuit }
export type { CourseWeekPayload, WeekDayPayload, CircuitExercisePayload, DayCircuitPayload }

// Course Live
type LiveSession = {
  id: number
  session_number: number
  name: string
  description: string
  start_time: string
  end_time: string
  link_zoom: string
}

type LiveSessionPayload = Omit<LiveSession, 'id'>

type CourseLiveDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

type CourseLive = {
  id: number
  day_of_week: CourseLiveDay
  start_time: string // ! needed?
  end_time: string // ! needed?
  description: string
  sessions: LiveSession[]
}

type CourseLivePayload = Omit<CourseLive, 'id' | 'sessions'>

export type { CourseFormat, CourseForm, CourseLevel, CourseLiveDay }
export type { Course, CourseLive, LiveSession }
export type { CoursePayload, LiveSessionPayload, CourseLivePayload }
