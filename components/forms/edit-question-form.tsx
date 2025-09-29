'use client'

import type { Question } from '@/models/body-quiz'

import { z } from 'zod'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'

import { createQuestion, updateQuestion } from '@/network/client/body-quizzes'

import { Input } from '../ui/input'
import { AddButton } from '../buttons/add-button'
import { MainButton } from '../buttons/main-button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { FormRichTextField, FormSelectField, FormSwitchField } from './fields'

// ! Follow QuestionPayload model in models/body-quiz.ts
const formSchema = z
  .object({
    title: z.string().min(1, { message: 'Tiêu đề câu hỏi không được để trống' }),
    question_type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'SHORT_ANSWER', 'IMAGE_UPLOAD']),
    is_required: z.boolean(),
    input_type: z.enum(['string', 'integer']),
    choices: z.array(z.object({ value: z.string() })),
  })
  .superRefine((data, ctx) => {
    // Only validate choices for choice-based questions
    const isChoiceQuestion = ['MULTIPLE_CHOICE', 'SINGLE_CHOICE'].includes(data.question_type)

    if (isChoiceQuestion) {
      // Check minimum number of choices
      if (data.choices.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cung cấp ít nhất 2 lựa chọn',
          path: ['choices'],
        })
      }

      // Check for empty choices
      if (data.choices.some((choice) => choice.value.trim() === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Các lựa chọn không được để trống',
          path: ['choices'],
        })
      }
    }
  })

type FormValue = z.infer<typeof formSchema>

interface EditQuestionFormProps {
  data: Question | null
  onSuccess?: (data: Question) => void
}

export function EditQuestionForm({ data, onSuccess }: EditQuestionFormProps) {
  const isEdit = !!data
  const defaultValue = {
    title: '',
    question_type: 'SINGLE_CHOICE',
    is_required: false,
    input_type: 'string',
    choices: [],
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: data.title,
          question_type: data.question_type,
          is_required: data.is_required,
          input_type: data.input_type,
          choices: data.choices.map((choice) => ({ value: choice })),
        }
      : defaultValue,
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'choices',
  })

  const questionType = form.watch('question_type')

  const questionMutation = useMutation({
    mutationFn: (values: FormValue) => {
      const processedValues = {
        ...values,
        choices: values.choices.map((choice) => choice.value),
      }
      return isEdit ? updateQuestion(data.id, processedValues) : createQuestion(processedValues)
    },
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật câu hỏi thành công' : 'Tạo câu hỏi thành công')
        onSuccess?.(data.data)
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    questionMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormRichTextField
          form={form}
          name="title"
          label="Tiêu đề"
          withAsterisk
          placeholder="Nhập tiêu đề"
        />
        <FormSelectField
          form={form}
          name="question_type"
          label="Loại câu hỏi"
          placeholder="Chọn loại câu hỏi"
          data={[
            { value: 'SINGLE_CHOICE', label: 'Lựa chọn đơn' },
            { value: 'MULTIPLE_CHOICE', label: 'Lựa chọn đa' },
            { value: 'SHORT_ANSWER', label: 'Câu trả lời ngắn' },
            { value: 'IMAGE_UPLOAD', label: 'Tải lên hình ảnh' },
          ]}
        />
        <FormSwitchField form={form} name="is_required" label="Đánh dấu là bắt buộc" />
        {(questionType === 'SINGLE_CHOICE' || questionType === 'MULTIPLE_CHOICE') && (
          <FormField
            control={form.control}
            name="choices"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-y-2 justify-between items-center">
                  <FormLabel>Lựa chọn</FormLabel>
                  <AddButton
                    size="sm"
                    variant="outline"
                    text="Thêm lựa chọn"
                    type="button"
                    onClick={() => append({ value: '' })}
                  />
                </div>
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        placeholder="Nhập lựa chọn"
                        value={item.value}
                        onChange={(e) => update(index, { value: e.target.value })}
                      />
                    </FormControl>
                    <MainButton
                      type="button"
                      size="icon"
                      onClick={() => remove(index)}
                      icon={Trash2}
                      className="flex-shrink-0 hover:text-destructive"
                      variant="outline"
                    />
                  </div>
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {questionType === 'SHORT_ANSWER' && (
          <FormSelectField
            form={form}
            name="input_type"
            label="Kiểu dữ liệu đầu vào"
            data={[
              { value: 'string', label: 'Chuỗi ký tự' },
              { value: 'integer', label: 'Số thực' },
            ]}
          />
        )}
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={questionMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}
