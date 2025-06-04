"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUserBodyQuizzesByUserId } from "@/network/server/user-body-quizz"
import { useAuth } from "@/components/providers/auth-context"
import type UserBodyQuizz from "@/models/user-body-quizz"
import { ListResponse } from "@/models/response"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export default function BodyQuiz() {
  const { userId } = useAuth()
  const isLoggedIn = !!userId
  const [userBodyQuizzes, setUserBodyQuizzes] = useState<ListResponse<UserBodyQuizz>>({
    data: [],
    paging: { page: 0, per_page: 0, total: 0 },
    status: "success",
  })
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  useEffect(() => {
    async function fetchQuizzes() {
      if (userId) {
        try {
          const quizzes = await getUserBodyQuizzesByUserId(userId)
          setUserBodyQuizzes(quizzes)
        } catch (error) {
          console.error("Error fetching body quizzes:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [userId])

  return (
    <div>
      <div className="bg-[#FFAEB01A] py-[33px] px-5 sm:px-9 lg:px-[87px]">
        <div className="text-center text-[#000000] text-[30px] leading-[33px] font-[Coiny] mb-7">Body Quiz</div>
        <div className="text-center text-[#737373] text-base sm:text-[20px] leading-[30px] px-0 sm:px-8 lg:px-20 mb-7">
          Làm các bảng câu hỏi về số đo, phom dáng, hay chế độ ăn uống để HLV có thể theo dõi tiến độ của bạn
        </div>

        <div className="relative w-full aspect-[2/1] sm:aspect-[3/1] lg:aspect-[9/2]">
          <Image src="/body-quiz-image.jpg" alt="Body Quiz Image" fill objectFit="cover" />
        </div>

        {!isLoggedIn ? (
          <div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <div className="flex justify-center w-full">
                <DialogTrigger asChild className="mt-7">
                  <Button className="bg-[#13D8A7] w-[238px] h-[45px] text-[20px] leading-[30px] font-normal pt-[10px] pb-[6px]">
                    Làm Quiz
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center text-center gap-6">
                  <p className="text-lg">HÃY ĐĂNG NHẬP/ĐĂNG KÝ TÀI KHOẢN ĐỂ XEM KẾT QUẢ BODY QUIZ</p>
                  <div className="flex gap-4 justify-center w-full px-10">
                    <Button
                      className="bg-[#13D8A7] rounded-full w-full text-lg"
                      onClick={() => {
                        setDialogOpen(false)
                        window.location.href = "/auth/login"
                        }}
                      >
                        Đăng nhập
                      </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="text-center mt-7">
            <Link href="/account/quiz">
              <Button className="bg-[#13D8A7] w-[238px] h-[45px] text-[20px] leading-[30px] font-normal pt-[10px] pb-[6px]">
                Làm Quiz
              </Button>
            </Link>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <div className="py-12 sm:py-16 lg:py-20 px-5 sm:px-9 lg:px-[60px]">
          <div className="text-[#FF7873] text-[30px] leading-[33px] font-[Coiny] mb-10">Kết quả</div>
          <div className="flex flex-col gap-[18px]">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : userBodyQuizzes.data && userBodyQuizzes.data.length > 0 ? (
              userBodyQuizzes.data.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/account/quiz/${quiz.id}`}
                  className="text-[#000000] text-[20px] leading-[30px] font-normal border border-[#E2E2E2] p-4 rounded-[10px]"
                >
                  Kết quả ngày {formatDate(quiz.quiz_date)}
                </Link>
              ))
            ) : (
              <div className="text-center py-4">No quizzes found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
