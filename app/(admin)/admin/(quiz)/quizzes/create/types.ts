import { z } from 'zod'

export type QuestionType = 'input' | 'multichoice' | 'singlechoice'
export type ValueFormat = 'string' | 'number'

export const questionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: 'Question title is required' }),
  type: z.enum(['input', 'multichoice', 'singlechoice']),
  valueFormat: z.enum(['string', 'number']),
  required: z.boolean().default(false),
  image: z.string().optional(),
  options: z.array(z.object({
    id: z.string(),
    value: z.string(),
    label: z.string()
  })).optional(),
})

export const quizFormSchema = z.object({
  title: z.string().min(1, { message: 'Quiz title is required' }),
  description: z.string().min(1, { message: 'Quiz description is required' }),
  questions: z.array(questionSchema)
})

export type QuizFormData = z.infer<typeof quizFormSchema>
export type QuestionData = z.infer<typeof questionSchema>