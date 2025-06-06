type UserBodyQuizz = {
    id: number
    user_id: number
    body_quiz_id: number
    user_name: string
    telephone_number: string
    quiz_date: string
    responses: string[]
    comment: string
    created_at: string
    updated_at: string
}

type UserBodyQuizSummary = {
    id: number
    user_name: string
    fullname: string
    telephone_number: string
    num_quizzes_commented: number
    num_quizzes_done: number
}


export type { UserBodyQuizz, UserBodyQuizSummary }
