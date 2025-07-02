type WorkoutMethod = {
  id: string;
  name: string;
}

type WorkoutMethodPayload = Omit<WorkoutMethod, 'id'>

export type { WorkoutMethod, WorkoutMethodPayload }
