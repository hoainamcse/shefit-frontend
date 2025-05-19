type Question = {
    id: number
    title: string
    question_type: "single_choice" | "multiple_choice" | "short_answer"
    is_required: boolean
    input_type: "string" | "integer"
    choices: string[]
    answer: string | null
    image: string
    created_at: string
    updated_at: string
}

type BodyQuiz = {
    id: number
    title: string
    description: string
    questions: Question[]
    created_at: string
    updated_at: string
}


export default BodyQuiz
