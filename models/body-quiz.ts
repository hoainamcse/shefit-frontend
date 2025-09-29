import { User } from './user'

type Question = {
  id: string
  title: string
  question_type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'IMAGE_UPLOAD'
  is_required: boolean
  input_type: 'string' | 'integer'
  choices: string[]
  created_at: string
  updated_at: string
}

type QuestionPayload = Omit<Question, 'id' | 'created_at' | 'updated_at'>

type BodyQuiz = {
  id: number
  title: string
  description: string
  questions: Question[]
  created_at: string
  updated_at: string
}

type BodyQuizPayload = Omit<BodyQuiz, 'id' | 'created_at' | 'updated_at' | 'questions'> & {
  question_ids: Question['id'][]
}

export type { Question, BodyQuiz }
export type { QuestionPayload, BodyQuizPayload }

// User
type BodyQuizUser = {
  id: User['id']
  user: Pick<User, 'id' | 'username' | 'fullname' | 'phone_number'>
  num_quizzes_attempted: number
  num_quizzes_commented: number
  last_quiz_date: string | null
}

type UserBodyQuiz = {
  id: number
  quiz_date: string
  responses: string[]
  comment: string
  user: Pick<User, 'id' | 'username' | 'fullname' | 'phone_number'>
  body_quiz: Pick<BodyQuiz, 'id' | 'title' | 'description'>
}

type UserBodyQuizPayload = Omit<UserBodyQuiz, 'id' | 'user' | 'body_quiz'> & {
  user_id: User['id']
  body_quiz_id: BodyQuiz['id']
}

export type { BodyQuizUser, UserBodyQuiz }
export type { UserBodyQuizPayload }
