'use client'

import { ListResponse } from '@/models/response'
import BodyQuiz from '@/models/body-quiz'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ListQuizProps {
  bodyQuiz: ListResponse<BodyQuiz> | null
}

export default function ListQuiz({ bodyQuiz }: ListQuizProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<BodyQuiz | null>(null)
  const [selectValue, setSelectValue] = useState('')

  const handleValueChange = (value: string) => {
    setSelectValue(value)
    const quiz = bodyQuiz?.data.find((q) => q.id.toString() === value) || null
    setSelectedQuiz(quiz)
  }

  useEffect(() => {
    if (bodyQuiz?.data && bodyQuiz.data.length > 0) {
      setSelectedQuiz(bodyQuiz.data[0])
      setSelectValue(bodyQuiz.data[0].id.toString())
    }
  }, [bodyQuiz])

  if (!bodyQuiz || !bodyQuiz.data || bodyQuiz.data.length === 0) {
    return <div className="text-center text-gray-500 py-4">Không có bài quiz nào</div>
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="w-full max-w-md space-y-6">
        <Select value={selectValue} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full h-[45px] bg-white text-black">
            <SelectValue placeholder="Chọn bài quiz" className="text-black" />
          </SelectTrigger>
          <SelectContent>
            {bodyQuiz.data.map((quiz) => (
              <SelectItem key={quiz.id} value={quiz.id.toString()}>
                {quiz.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedQuiz && (
          <div className="space-y-4">
            <p className="text-center text-[#737373] text-base sm:text-[20px] leading-[30px] px-4">
              {selectedQuiz.description}
            </p>
            <Link href={`/account/quiz/${selectedQuiz.id}`} className="block">
              <Button className="bg-[#13D8A7] w-full h-[45px] text-[20px] leading-[30px] font-normal rounded-full">
                Làm Quiz
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
