type UserExercise = {
  id?: number,
  user_id: number,
  exercise_id: number,
  created_at: string,
  updated_at: string,
  exercise: {
    muscle_group_id: number,
    id: number,
    name: string,
    description: string,
    youtube_url: string,
    cover_image: string,
    thumbnail_image: string,
    created_at: string,
    updated_at: string
  }
  muscle_group_ids: number[]
}

export type { UserExercise }