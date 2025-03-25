import { Equipment } from "./equipments"
import { MuscleGroup } from "./muscle-group"

type Exercise = {
    id: number
    name: string
    description: string
    image: string
    youtube_url: string
    equipments: Equipment[]
    muscle_groups: MuscleGroup[]
    created_at: string
    updated_at: string
}

export type { Exercise }