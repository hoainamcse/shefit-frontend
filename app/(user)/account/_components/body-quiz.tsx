'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getBodyQuizzesByUser } from '@/network/server/body-quizzes'
import { getBodyQuizzes } from '@/network/server/body-quizzes'
import { useSession } from '@/hooks/use-session'
import { ListResponse } from '@/models/response'
import type { BodyQuiz, UserBodyQuiz } from '@/models/body-quiz'
import ListQuiz from './list-quiz'
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
  const [userBodyQuizzes, setUserBodyQuizzes] = useState<ListResponse<UserBodyQuiz>>({
    data: [],
    paging: { page: 0, per_page: 0, total: 0 },
    status: 'success',
  })
  const [loading, setLoading] = useState(true)
  const [bodyQuiz, setBodyQuiz] = useState<ListResponse<BodyQuiz> | null>(null)
  const [quizzes, setQuizzes] = useState<BodyQuiz[]>([])
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const [userQuizzes, allQuizzes] = await Promise.all([
          session ? getBodyQuizzesByUser(session.userId) : Promise.resolve(null),
          getBodyQuizzes(),
        ])

        const transformedQuizzes: ListResponse<BodyQuiz> = {
          data: allQuizzes.data.map((quiz, index) => ({
            ...quiz,
            id: quiz.id || index + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            questions: (quiz.questions || []).map((q, qIndex) => ({
              ...q,
              id: q.id || qIndex + 1,
              answer: q.choices?.[0] || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })) as any,
          })),
          paging: {
            page: 1,
            per_page: allQuizzes.data.length,
            total: allQuizzes.data.length,
          },
          status: 'success',
        }

        if (session && userQuizzes) {
          setUserBodyQuizzes(userQuizzes)
        }
        setBodyQuiz(transformedQuizzes)
        setQuizzes(transformedQuizzes.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])
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
        <ListQuiz bodyQuiz={bodyQuiz} />
      </div>

      {session && (
        <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-9 lg:px-[60px]">
          <div className="text-[#FF7873] text-2xl lg:text-4xl lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold mb-10">
            Kết quả
          </div>
          <div className="flex flex-col gap-[18px]">
            {loading ? (
              <div className="text-center py-4 w-full justify-center items-center mx-auto flex">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : userBodyQuizzes.data && userBodyQuizzes.data.length > 0 ? (
              userBodyQuizzes.data.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/account/quiz/${quiz.id}/quiz-result`}
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
