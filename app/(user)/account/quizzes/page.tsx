'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getBodyQuizzes, getBodyQuizzesHistoryByUser, queryKeyBodyQuizzes } from '@/network/client/body-quizzes'
import { useSession } from '@/hooks/use-session'
import { queryKeyUsers } from '@/network/client/users'
import type { BodyQuiz } from '@/models/body-quiz'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export default function BodyQuiz() {
  const { session } = useSession()
  const [selectedQuiz, setSelectedQuiz] = useState<BodyQuiz | null>(null)
  const [selectValue, setSelectValue] = useState('')

  // Fetch all quizzes
  const { data: bodyQuizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: [queryKeyBodyQuizzes],
    queryFn: () => getBodyQuizzes(),
    select: (data) => ({
      ...data,
      data: data.data.map((quiz, index) => ({
        ...quiz,
        id: quiz.id || index + 1,
        created_at: quiz.created_at || new Date().toISOString(),
        updated_at: quiz.updated_at || new Date().toISOString(),
        questions: (quiz.questions || []).map((q, qIndex) => ({
          ...q,
          id: q.id || qIndex + 1,
          answer: q.choices?.[0] || '',
          created_at: q.created_at || new Date().toISOString(),
          updated_at: q.updated_at || new Date().toISOString(),
        })) as any,
      })),
    }),
  })

  // Fetch user quiz history if user is logged in
  const { data: userQuizzes, isLoading: isLoadingUserQuizzes } = useQuery({
    queryKey: [queryKeyUsers, session?.userId, queryKeyBodyQuizzes, 'attempts'],
    queryFn: () => (session?.userId ? getBodyQuizzesHistoryByUser(session.userId) : Promise.resolve(null)),
    enabled: !!session?.userId,
  })

  const isLoading = isLoadingQuizzes || isLoadingUserQuizzes

  // Set initial selected quiz when data is loaded
  useEffect(() => {
    if (bodyQuizzes?.data && bodyQuizzes.data.length > 0 && !selectedQuiz) {
      setSelectedQuiz(bodyQuizzes.data[0])
      setSelectValue(bodyQuizzes.data[0].id.toString())
    }
  }, [bodyQuizzes, selectedQuiz])

  const handleQuizChange = (value: string) => {
    setSelectValue(value)
    const quiz = bodyQuizzes?.data.find((q) => q.id.toString() === value) || null
    setSelectedQuiz(quiz)
  }

  return (
    <div>
      <div className="bg-[#FFAEB01A] py-[33px] px-4 sm:px-9 lg:px-[87px]">
        <div className="text-center text-[#000000] text-2xl lg:text-4xl lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold lg:mb-7 mb-4">
          Body Quiz
        </div>
        <div className="lg:text-center text-[#737373] text-lg lg:text-xl px-0 sm:px-8 lg:px-20 lg:mb-7 mb-4">
          Làm các bảng câu hỏi về số đo, phom dáng, hay chế độ ăn uống để HLV có thể theo dõi tiến độ của bạn
        </div>

        <div className="relative w-full aspect-[2/1] sm:aspect-[3/1] lg:aspect-[9/2]">
          <Image src="/body-quiz-image.jpg" alt="Body Quiz Image" fill objectFit="cover" />
        </div>

        {/* Quiz Selection Section */}
        <div className="flex flex-col items-center mt-5">
          <div className="w-full max-w-md space-y-6">
            {isLoadingQuizzes ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : bodyQuizzes?.data && bodyQuizzes.data.length > 0 ? (
              <>
                <Select value={selectValue} onValueChange={handleQuizChange}>
                  <SelectTrigger className="w-full h-[45px] bg-white text-black">
                    <SelectValue placeholder="Chọn bài quiz" className="text-black" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyQuizzes.data.map((quiz) => (
                      <SelectItem key={quiz.id} value={quiz.id.toString()}>
                        {quiz.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedQuiz && (
                  <div className="space-y-4">
                    <p className="text-center text-[#737373] text-sm lg:text-lg px-4">{selectedQuiz.description}</p>
                    <Link href={`/quizzes/${selectedQuiz.id}`} className="block">
                      <Button className="bg-[#13D8A7] w-full h-11 text-sm lg:text-lg font-normal rounded-full">
                        Làm Quiz
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">Không có bài quiz nào.</div>
            )}
          </div>
        </div>
      </div>

      {session && (
        <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-9 lg:px-[60px]">
          <div className="text-[#FF7873] text-2xl lg:text-4xl lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold mb-10">
            Kết quả
          </div>
          <div className="flex flex-col gap-[18px]">
            {isLoadingUserQuizzes ? (
              <div className="text-center py-4 w-full justify-center items-center mx-auto flex">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : userQuizzes?.data && userQuizzes.data.length > 0 ? (
              userQuizzes.data.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/quizzes/${quiz.id}/result`}
                  className="text-[#000000] text-sm lg:text-lg font-normal border border-[#E2E2E2] p-4 rounded-lg"
                >
                  Kết quả ngày {formatDate(quiz.quiz_date)} - {quiz.body_quiz.title}
                </Link>
              ))
            ) : (
              <div className="text-center py-4">Bạn chưa có kết quả nào, hãy tham gia làm Quiz cùng Shefit!</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
