'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Plus, Trash2, ImageIcon } from 'lucide-react'

import { QuizFormData, questionSchema, quizFormSchema } from './types'
import { MainButton } from '@/components/buttons/main-button'
import { ContentLayout } from '@/components/admin-panel/content-layout'

export default function CreateQuizPage() {
  const router = useRouter()
  const [imageUploading, setImageUploading] = useState(false)

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      description: '',
      questions: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  const onSubmit = async (data: QuizFormData) => {
    try {
      // TODO: Implement quiz creation API call
      console.log('Form data:', data)
      toast.success('Quiz created successfully!')
      router.push('/admin/quizzes')
    } catch (error) {
      toast.error('Failed to create quiz')
    }
  }

  const handleImageUpload = async (questionIndex: number, file: File) => {
    try {
      setImageUploading(true)
      // TODO: Implement image upload logic
      const imageUrl = URL.createObjectURL(file)
      form.setValue(`questions.${questionIndex}.image`, imageUrl)
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setImageUploading(false)
    }
  }

  const addQuestion = () => {
    append({
      id: uuidv4(),
      title: '',
      type: 'input',
      valueFormat: 'string',
      required: false,
      options: [],
    })
  }

  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || []
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, { id: uuidv4(), value: '', label: '' }])
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || []
    form.setValue(
      `questions.${questionIndex}.options`,
      currentOptions.filter((_, index) => index !== optionIndex)
    )
  }

  return (
    <ContentLayout title="Tạo quiz mới">
      <Card>
        <CardHeader>
          <CardTitle>Tạo quiz mới</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề quiz</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề quiz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả quiz</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả quiz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

                      <FormField
                        control={form.control}
                        name={`questions.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiêu đề câu hỏi</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập câu hỏi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`questions.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại câu hỏi</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="input">Short Answer</SelectItem>
                                  <SelectItem value="singlechoice">Single Choice</SelectItem>
                                  <SelectItem value="multichoice">Multiple Choice</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`questions.${index}.valueFormat`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Định dạng giá trị</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn định dạng" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="string">String</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`questions.${index}.required`}
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

                      <div className="space-y-2">
                        <Label>Hình ảnh câu hỏi</Label>
                        <div className="flex items-center gap-4">
                          {form.watch(`questions.${index}.image`) ? (
                            <div className="relative w-32 h-32">
                              <img
                                src={form.watch(`questions.${index}.image`)}
                                alt="Question"
                                className="w-full h-full object-cover rounded"
                              />
                              <MainButton
                                variant="secondary"
                                size="icon"
                                icon={Trash2}
                                className="absolute top-0 right-0 text-destructive"
                                onClick={() => form.setValue(`questions.${index}.image`, '')}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id={`image-${index}`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleImageUpload(index, file)
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={imageUploading}
                                onClick={() => document.getElementById(`image-${index}`)?.click()}
                              >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Tải lên hình ảnh
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {(form.watch(`questions.${index}.type`) === 'singlechoice' ||
                        form.watch(`questions.${index}.type`) === 'multichoice') && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label>Câu trả lời</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => addOption(index)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Thêm câu trả lời
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(form.watch(`questions.${index}.options`) || []).map((option, optionIndex) => (
                              <div key={option.id} className="flex gap-2">
                                <Input
                                  placeholder="Nhập câu trả lời"
                                  value={option.label}
                                  onChange={(e) => {
                                    const currentOptions = form.getValues(`questions.${index}.options`) || []
                                    currentOptions[optionIndex].label = e.target.value
                                    currentOptions[optionIndex].value = e.target.value
                                    form.setValue(`questions.${index}.options`, currentOptions)
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

              <Button type="submit" className="w-full">
                Tạo quiz
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ContentLayout>
  )
}
