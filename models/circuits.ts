type CircuitExercise = {
    id: number
    circuit_exercise_title: string
    circuit_exercise_description: string
    youtube_url: string
    no: number
}

type Circuit = {
    id: number
    name: string
    description: string
    auto_replay_count: number
    circuit_exercises: CircuitExercise[]
    created_at?: string
    updated_at?: string
}

export type { Circuit, CircuitExercise }