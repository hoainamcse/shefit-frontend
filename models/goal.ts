type Goal = {
  id: number
  name: string
}

type GoalPayload = Omit<Goal, 'id'>

export type { Goal, GoalPayload }
