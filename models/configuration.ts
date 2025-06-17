type ConfigurationType = 'about_us' | 'policy' | 'homepage'

type Configuration = {
  id: number
  type: ConfigurationType
  data: Record<string, any>
  created_at: string
  updated_at: string
}

type ConfigurationPayload = Omit<Configuration, 'id' | 'created_at' | 'updated_at'>

export type { ConfigurationType, Configuration }
export type { ConfigurationPayload }

type Dashboard = {
  user_count: number
  coach_count: number
  meal_plan_count: number
  exercise_count: number
}

export type { Dashboard }
