import Image from "next/image"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUserBodyQuizzesByUserId } from "@/network/server/user-body-quizz"

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export default async function BodyQuiz() {
  const userBodyQuizzes = await getUserBodyQuizzesByUserId("1")

  return (
    <div>
      <div className="bg-[#FFAEB01A] py-[33px] px-5 sm:px-9 lg:px-[87px]">
        <div className="text-center text-[#000000] text-[30px] leading-[33px] font-[Coiny] mb-7">Body Quiz</div>
        <div className="text-center text-[#737373] text-base sm:text-[20px] leading-[30px] px-0 sm:px-8 lg:px-20 mb-7">
          Làm bảng câu hỏi để Shefit giúp chị hiểu rõ mình thuộc loại nào trong 5 loại phom dáng, các chỉ số hình thể
          cần cải thiện và lộ trình “độ dáng” phù hợp nhất
        </div>

        <div className="relative w-full aspect-[2/1] sm:aspect-[3/1] lg:aspect-[9/2]">
          <Image src="/body-quiz-image.jpg" alt="Body Quiz Image" fill objectFit="cover" />
        </div>

        <div className="text-center mt-7">
          <Link href="/account/quiz">
            <Button className="bg-[#13D8A7] w-[238px] h-[45px] text-[20px] leading-[30px] font-normal pt-[10px] pb-[6px]">
              Làm Quiz
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-12 sm:py-16 lg:py-20 px-5 sm:px-9 lg:px-[60px]">
        <div className="text-[#FF7873] text-[30px] leading-[33px] font-[Coiny] mb-10">Kết quả</div>
        <div className="flex flex-col gap-[18px]">
          {userBodyQuizzes.data.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/account/quiz/${quiz.id}`}
              className="text-[#000000] text-[20px] leading-[30px] font-normal border border-[#E2E2E2] p-4 rounded-[10px]"
            >
              Kết quả ngày {formatDate(quiz.quiz_date)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
