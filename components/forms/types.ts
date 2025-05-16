import { z } from 'zod'

export type QuestionType = 'multi_choice' | 'single_choice' | 'short_answer'
export type ValueFormat = 'string' | 'integer'

export const questionSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: 'Tiêu đề câu hỏi bắt buộc' }),
  question_type: z.enum(['multi_choice', 'single_choice', 'short_answer']),
  input_type: z.enum(['string', 'integer']).default('string'),
  is_required: z.boolean().default(false),
  image: z.string().nullable(),
  choices: z.array(z.string()),
})

export const quizFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: 'Tiêu đề bắt buộc' }),
  description: z.string().min(1, { message: 'Mô tả bắt buộc' }),
  questions: z.array(questionSchema),
})

export type QuizFormData = z.infer<typeof quizFormSchema>
export type QuestionData = z.infer<typeof questionSchema>
