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
