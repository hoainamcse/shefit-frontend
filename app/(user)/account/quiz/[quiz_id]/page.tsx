'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { Form, FormItem, FormControl, FormMessage, FormField } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { getBodyQuiz } from '@/network/server/body-quizzes'
import type { BodyQuiz } from '@/models/body-quiz'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createBodyQuizByUser } from '@/network/server/body-quizzes'
import { getUser } from '@/network/client/users'
import { toast } from 'sonner'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import Link from 'next/link'
import { BackIconBlack } from '@/components/icons/BackIconBlack'

export default function BodyQuizPage() {
  const params = useParams<{ quiz_id: string }>()
  const quiz_id = Number(params?.quiz_id)
  const router = useRouter()
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()
  const [bodyQuiz, setBodyQuiz] = useState<BodyQuiz | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [userInfo, setUserInfo] = useState<{ fullname: string; phone_number: string } | null>(null)

  type FormValues = Record<`question_${string}`, string | string[]>
  const form = useForm<FormValues>({
    defaultValues: {
      ...(bodyQuiz?.questions?.reduce(
        (acc, q) => ({
          ...acc,
          [`question_${q.id}`]: q.question_type === 'MULTIPLE_CHOICE' ? [] : '',
        }),
        {}
      ) || {}),
    },
  })

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
  }

  const onSubmit = async (formData: Record<string, any>) => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    try {
      setIsSubmitting(true)
      const responses: string[] = []
      bodyQuiz?.questions.forEach((question) => {
        const fieldName = `question_${question.id}`
        const value = formData[fieldName]

        if (value === undefined || value === null) return

        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v) responses.push(String(v))
          })
        } else if (value !== '') {
          responses.push(String(value))
        }
      })

      if (!bodyQuiz?.id) {
        throw new Error('Invalid quiz ID')
      }

      if (!userInfo) {
        throw new Error('User information not available')
      }

      const quizData = {
        user_id: parseInt(session.userId, 10),
        body_quiz_id: bodyQuiz.id,
        quiz_date: new Date().toISOString(),
        user_name: userInfo.fullname || '',
        telephone_number: userInfo.phone_number || '',
        comment: '',
        responses: responses,
      }

      console.log('Submitting quiz data:', JSON.stringify(quizData, null, 2))

      const response = await createBodyQuizByUser(session.userId, quizData)

      if (response.status === 'success' && response.data) {
        setShowSuccessDialog(true)
      } else {
        throw new Error('Failed to submit quiz')
      }
    } catch (error: any) {
      console.error('Quiz submission error:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi gửi bài kiểm tra. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const mapToBodyQuiz = (data: any): BodyQuiz => ({
    ...data,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    questions: (data.questions || []).map((q: any) => ({
      ...q,
      id: q.id || Math.floor(Math.random() * 10000),
      answer: q.answer || null,
      created_at: q.created_at || new Date().toISOString(),
      updated_at: q.updated_at || new Date().toISOString(),
      image: q.image || '',
    })),
  })

  useEffect(() => {
    if (bodyQuiz?.questions) {
      const defaultValues = bodyQuiz.questions.reduce(
        (acc, q) => ({
          ...acc,
          [`question_${q.id}`]: q.question_type === 'MULTIPLE_CHOICE' ? [] : '',
        }),
        {}
      )
      form.reset(defaultValues)
    }
  }, [bodyQuiz, form])

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!session) return
      try {
        const response = await getUser(session.userId)
        if (response.data) {
          const userData = response.data

          const displayName = userData.fullname || userData.username || 'Khách'

          if (!userData.fullname) {
            console.warn('fullname field is missing from user data, falling back to username')
          }
          if (!userData.phone_number) {
            console.warn('phone_number field is missing from user data')
          }

          setUserInfo({
            fullname: displayName,
            phone_number: userData.phone_number || '',
          })
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchUserInfo()
  }, [session])

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getBodyQuiz(quiz_id)
        if (response.status === 'success') {
          setBodyQuiz(mapToBodyQuiz(response.data))
          form.reset(
            response.data.questions.reduce<Record<string, string | string[]>>(
              (acc, q) => ({
                ...acc,
                [`question_${q.id}`]: q.question_type === 'MULTIPLE_CHOICE' ? [] : '',
              }),
              {}
            )
          )
        } else {
          setError('Failed to load quiz')
        }
      } catch (err) {
        setError('An error occurred while loading the quiz')
        console.error('Error fetching quiz:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (quiz_id) {
      fetchQuiz()
    } else {
      setError('Không tìm thấy ID bài quiz')
      setIsLoading(false)
    }
  }, [quiz_id, form])

  const renderQuestionField = (question: BodyQuiz['questions'][number]) => {
    const fieldName = `question_${question.id}` as const
    return (
      <div key={question.id} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border mb-6">
        <div className="space-y-4">
          <h3 className="text-sm lg:text-lg font-medium">
            {question.title}
            {question.is_required && <span className="text-red-500 ml-1">*</span>}
          </h3>

          {question.image && (
            <div className="relative w-full h-48 md:h-64 lg:h-80">
              <Image src={question.image} alt={`Câu hỏi ${question.id}`} fill className="object-cover rounded-lg" />
            </div>
          )}

          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="text-sm lg:text-lg">
                    {question.question_type === 'SINGLE_CHOICE' && (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value as string}
                        defaultValue={typeof field.value === 'string' ? field.value : ''}
                      >
                        <SelectTrigger className="w-full h-[50px] bg-white text-black text-sm lg:text-lg">
                          <SelectValue placeholder="Chọn câu trả lời" className="text-black text-sm lg:text-lg" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.choices?.map((choice, index) => (
                            <SelectItem key={index} value={choice}>
                              {choice}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {question.question_type === 'MULTIPLE_CHOICE' && (
                      <div className="grid gap-4">
                        {question.choices?.map((choice, index) => {
                          const choiceId = `${question.id}-${index}`
                          return (
                            <div key={choiceId} className="flex items-center space-x-3">
                              <Checkbox
                                id={choiceId}
                                checked={Array.isArray(field.value) ? field.value.includes(choice) : false}
                                onCheckedChange={(checked) => {
                                  const currentValues = new Set(Array.isArray(field.value) ? field.value : [])
                                  if (checked) {
                                    currentValues.add(choice)
                                  } else {
                                    currentValues.delete(choice)
                                  }
                                  field.onChange(Array.from(currentValues))
                                }}
                                className="h-5 w-5"
                              />
                              <label
                                htmlFor={choiceId}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {choice}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {question.question_type === 'SHORT_ANSWER' && (
                      <Input
                        {...field}
                        type={question.input_type === 'integer' ? 'number' : 'text'}
                        placeholder="Nhập câu trả lời"
                        className="w-full h-[50px] bg-white text-black text-sm lg:text-lg"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 mx-auto mb-20 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 mx-auto mb-20 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!bodyQuiz) {
    return (
      <div className="p-4 mx-auto mb-20">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">Không tìm thấy dữ liệu bài kiểm tra</p>
        </div>
      </div>
    )
  }

  const handleCloseDialog = () => {
    setShowSuccessDialog(false)
    router.push('/account?tab=body-quiz')
  }

  return (
    <div className="lg:p-20">
      <div className="relative w-full">
        <img
          src={'/body-quiz-image.jpg'}
          alt="Body Quiz Image"
          className="object-cover h-[280px] lg:h-[731px] w-full"
        />
        <Link
          href="/account?tab=body-quiz"
          className="inline-flex items-center gap-2 text-lg font-semibold transition-colors absolute top-4 left-4 lg:left-16 lg:top-0"
        >
          <BackIconBlack className="w-5 h-5" />
          <span>Quay về</span>
        </Link>
      </div>
      <div className="p-4 mx-auto mb-20 relative">
        <Dialog open={showSuccessDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-sm lg:text-lg font-semibold text-[#737373] uppercase">
                Gửi bài kiểm tra thành công!
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCloseDialog}
                className="bg-[#13D8A7] hover:bg-[#13d8a7d0] rounded-full w-full h-[45px] text-sm lg:text-lg font-semibold"
              >
                Trở về
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="text-center text-lg lg:text-xl"></DialogTitle>
              <DialogDescription className="text-center text-lg lg:text-xl">
                HÃY ĐĂNG NHẬP/ĐĂNG KÝ TÀI KHOẢN ĐỂ XEM KẾT QUẢ BODY QUIZ
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 justify-center mt-4">
              <Button
                className="bg-[#13D8A7] hover:bg-[#13d8a7d0] rounded-full w-1/3 h-[45px] text-sm lg:text-lg"
                onClick={handleLoginClick}
              >
                Đăng nhập
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div>
          <div className="w-full flex flex-col gap-5 lg:mt-20 mt-5">
            <div className="mb-10">
              <div className="font-[family-name:var(--font-coiny)] text-2xl lg:text-4xl text-ring font-bold mb-5">
                {bodyQuiz.title}
              </div>
              {bodyQuiz.description && <p className="text-gray-500 text-base">{bodyQuiz.description}</p>}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                <div className="space-y-6">{bodyQuiz.questions?.map((question) => renderQuestionField(question))}</div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#13D8A7] hover:bg-[#13d8a7d0] text-white py-2 px-4 rounded-full w-full xl:h-20 text-sm lg:text-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Đang gửi...
                    </div>
                  ) : (
                    'Gửi'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
