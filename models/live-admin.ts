type Session = {
    id?: number
    session_number: number
    name: string
    description?: string
    start_time: string
    end_time: string
    link_zoom: string
}

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

type Day = {
    id?: number
    description?: string
    day_of_week: DayOfWeek
    start_time?: string
    end_time?: string
    sessions?: Session[]
}


export type { Session, Day }