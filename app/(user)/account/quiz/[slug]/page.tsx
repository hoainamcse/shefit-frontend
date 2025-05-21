import React from "react"
import Image from "next/image"
import VideoCard from "@/assets/image/ImageIntro.png"
import { getUserBodyQuizzesByUserId } from "@/network/server/user-body-quizz"

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}
export default async function About({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const userBodyQuizzes = await getUserBodyQuizzesByUserId("1")
  const quizData = userBodyQuizzes.data.find((quiz: any) => quiz.id === Number(slug))

  if (!quizData) {
    return <div>Không tìm thấy kết quả</div>
  }

  return (
    <div className="flex flex-col gap-10 mt-10 p-10">
      <Image src={VideoCard} alt="" className="h-[680px]" />
      <div className="xl:text-3xl max-lg:text-xl flex flex-col gap-5">
        <p>Kết quả ngày {formatDate(quizData.quiz_date)}</p>
        <p className="text-gray-500">
          Chỉ số <span className="text-text underline">HLV Đánh Giá Phom Dáng</span>
        </p>
        <div className="text-gray-500 xl:text-xl max-lg:base">
          {quizData.responses.map((response: string) => (
            <p key={response}>{response}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
