"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getBodyQuiz } from "@/network/server/body-quizz"
import { useEffect, useState } from "react"
import type BodyQuiz from "@/models/body-quiz"
import type { ListResponse } from "@/models/response"
export default function BodyQuiz() {
  const [bodyQuiz, setBodyQuiz] = useState<ListResponse<BodyQuiz> | null>(null)
  const form = useForm({})

  const onSubmit = (data: any) => {
    console.log("Form Data:", data)
  }

  useEffect(() => {
    const fetchBodyQuiz = async () => {
      const response = await getBodyQuiz()
      setBodyQuiz(response)
    }
    fetchBodyQuiz()
  }, [])

  const renderQuestionField = (question: BodyQuiz["questions"][number]) => {
    return (
      <FormField
        key={question.id}
        control={form.control}
        name={`question_${question.id}`}
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-medium">
              {question.title}
              {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <div>
                {question.question_type === "single_choice" && (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full h-[50px] bg-white text-black">
                      <SelectValue placeholder="Chọn câu trả lời" className="text-black" />
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
                {question.question_type === "multiple_choice" && (
                  <div className="grid gap-4">
                    {question.choices?.map((choice, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Checkbox
                          id={`${question.id}-${index}`}
                          checked={field.value?.includes(choice)}
                          onCheckedChange={(checked) => {
                            const currentValues = new Set(field.value || [])
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
                          htmlFor={`${question.id}-${index}`}
                          className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {choice}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {question.question_type === "short_answer" && (
                  <Input
                    {...field}
                    type={question.input_type === "integer" ? "number" : "text"}
                    placeholder="Nhập câu trả lời"
                    className="w-full h-[50px] bg-white text-black"
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <div className="p-14 max-w-screen-3xl mx-auto mb-20">
      <div className="bg-[#FFF7F8] p-8 rounded-[10px] pb-28">
        <div className="relative w-full aspect-[9/4]">
          <Image src="/body-quiz-image.jpg" alt="Body Quiz Image" fill objectFit="cover" className="rounded-[10px]" />
        </div>
        <div className="w-full flex flex-col gap-5 mt-20">
          <div className="xl:w-[400px] max-lg:w-full mb-10">
            <div className="font-[family-name:var(--font-coiny)] text-3xl text-text">Shefit.vn Body Quiz 1:1</div>
            <p className="text-gray-500">
              Khách hàng vui lòng trả lời các câu hỏi sau để HLV Shefit có thể lên Giáo Trình Tập & Thực Đơn cá nhân hóa
              phù hợp nhất. Đảm bảo đạt được body tỷ lệ đẹp nhất với phom dáng người.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <div className="space-y-6">
                {bodyQuiz?.data.flatMap((quiz) => quiz.questions).map((question) => renderQuestionField(question))}
              </div>
              <Button type="submit" className="bg-button text-white py-2 px-4 rounded-full w-full xl:h-20 text-xl">
                Gửi
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
