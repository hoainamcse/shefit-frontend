import { User } from './user'

type Question = {
  id: number
  title: string
  question_type: 'single_choice' | 'multiple_choice' | 'short_answer'
  is_required: boolean
  input_type: 'string' | 'integer'
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

type BodyQuizUser = {
  id: User['id']
  user_name: string
  fullname: string
  telephone_number: string
  num_quizzes_commented: number
  num_quizzes_done: number
}

type UserBodyQuiz = {
  id: number
  user_id: User['id']
  body_quiz: BodyQuiz
  user_name: string
  telephone_number: string
  quiz_date: string
  responses: string[]
  comment: string
  created_at: string
  updated_at: string
}

type UserBodyQuizPayload = Pick<UserBodyQuiz, 'comment'>

export type { BodyQuizUser, UserBodyQuiz }
export type { UserBodyQuizPayload }
export default BodyQuiz
