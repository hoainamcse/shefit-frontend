'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form'
import { Plus, Trash2 } from 'lucide-react'

import { QuizFormData, quizFormSchema } from './types'
import { MainButton } from '@/components/buttons/main-button'
import { FormInputField, FormSelectField, FormTextareaField } from './fields'
import { FormImageInputField } from './fields/form-image-input-field'
import { createQuestion, createQuiz, updateQuestion, updateQuiz } from '@/network/server/body-quiz'

interface EditQuizFormProps {
  data?: QuizFormData
}

const defaultValues: QuizFormData = {
  title: '',
  description: '',
  questions: [],
}

const questionTypes = [
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'single_choice', label: 'Single Choice' },
]

const inputTypes = [
  { value: 'string', label: 'Chuỗi (abc, ...)' },
  { value: 'integer', label: 'Số (123, ...)' },
]

export function EditQuizForm({ data }: EditQuizFormProps) {
  const isEditMode = !!data

  const router = useRouter()

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: data ?? defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  const onSubmit = async (data: QuizFormData) => {
    // console.log('Form data:', data)
    try {
      if (isEditMode) {
        const { questions, ...quizData } = data
        const createdQuestions = await Promise.all(
          questions.map((question) => (question.id ? updateQuestion(question.id, question) : createQuestion(question)))
        )

        const questionIds = createdQuestions.map((question) => question.data.id)
        await updateQuiz(quizData.id as number, { ...quizData, question_ids: questionIds })

        toast.success('Quiz updated successfully')
      } else {
        const { questions, ...quizData } = data
        const createdQuestions = await Promise.all(questions.map((question) => createQuestion(question)))

        const questionIds = createdQuestions.map((question) => question.data.id)
        await createQuiz({ ...quizData, question_ids: questionIds })

        toast.success('Quiz created successfully')
      }

      router.push('/admin/quizzes')
    } catch (error) {
      toast.error('Failed to create quiz')
    }
  }

  const addQuestion = () => {
    append({
      title: '',
      question_type: 'short_answer',
      input_type: 'string',
      is_required: false,
      image: null,
      choices: [],
    })
  }

  const addOption = (questionIndex: number) => {
    const currentChoices = form.getValues(`questions.${questionIndex}.choices`) || []
    form.setValue(`questions.${questionIndex}.choices`, [...currentChoices, ''])
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentChoices = form.getValues(`questions.${questionIndex}.choices`) || []
    form.setValue(
      `questions.${questionIndex}.choices`,
      currentChoices.filter((_, index) => index !== optionIndex)
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Chỉnh sửa quiz' : 'Tạo quiz mới'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormInputField
              form={form}
              name="title"
              label="Tiêu đề quiz"
              placeholder="Nhập tiêu đề quiz"
              withAsterisk
            />

            <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" withAsterisk />

            <div className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Câu hỏi {index + 1}</h3>
                      <MainButton
                        className="text-destructive"
                        variant="secondary"
                        size="icon"
                        icon={Trash2}
                        onClick={() => remove(index)}
                      />
                    </div>

                    <FormInputField
                      form={form}
                      name={`questions.${index}.title`}
                      label="Tiêu đề câu hỏi"
                      placeholder="Nhập câu hỏi"
                      withAsterisk
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormSelectField
                        form={form}
                        name={`questions.${index}.question_type`}
                        data={questionTypes}
                        label="Loại câu hỏi"
                        placeholder="Chọn loại câu hỏi"
                      />

                      <FormSelectField
                        form={form}
                        name={`questions.${index}.input_type`}
                        data={inputTypes}
                        label="Loại giá trị nhập vào"
                        placeholder="Chọn loại giá trị nhập vào"
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`questions.${index}.is_required`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Bắt buộc</FormLabel>
                            <FormDescription>Đánh dấu câu hỏi là bắt buộc để trả lời</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormImageInputField form={form} name={`questions.${index}.image`} label="Hình ảnh câu hỏi" />

                    {(form.watch(`questions.${index}.question_type`) === 'single_choice' ||
                      form.watch(`questions.${index}.question_type`) === 'multiple_choice') && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label>Câu trả lời</Label>
                          <Button type="button" variant="outline" size="sm" onClick={() => addOption(index)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm câu trả lời
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(form.watch(`questions.${index}.choices`) || []).map((option, optionIndex) => (
                            <div key={option} className="flex gap-2">
                              <Input
                                placeholder="Nhập câu trả lời"
                                value={option}
                                onChange={(e) => {
                                  const currentChoices = form.getValues(`questions.${index}.choices`) || []
                                  currentChoices[optionIndex] = e.target.value
                                  form.setValue(`questions.${index}.choices`, currentChoices)
                                }}
                              />
                              <MainButton
                                className="text-destructive"
                                variant="secondary"
                                size="icon"
                                icon={Trash2}
                                onClick={() => removeOption(index, optionIndex)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm câu hỏi
            </Button>

            <MainButton type="submit" className="w-full" text={isEditMode ? 'Cập nhật quiz' : 'Tạo quiz'} />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
