"use client"
import { ArrowPinkIcon } from "@/components/icons/ArrowPinkIcon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getWeeks } from "@/network/server/weeks"
import { getDays } from "@/network/server/days"
import Link from "next/link"
import { useState, useEffect } from "react"

type CourseDay = {
  day: number
  content: string
}

type CourseWeek = {
  week: number
  days: CourseDay[]
}

export const mapCourseData = (totalWeeks: number): CourseWeek[] => {
  return Array.from({ length: totalWeeks }, (_, weekIndex) => ({
    week: weekIndex + 1,
    days: Array.from({ length: 7 }, (_, dayIndex) => ({
      day: dayIndex + 1,
      content: `Nội dung ngày ${dayIndex + 1}`,
    })),
  }))
}

export default function VideoCourseDetail({ courseId }: { courseId: string }) {
  const [weeks, setWeeks] = useState<any>(null)
  const [days, setDays] = useState<any>(null)
  const [courseData, setCourseData] = useState<CourseWeek[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weeksData = await getWeeks(courseId)
        setWeeks(weeksData)

        if (weeksData.data && weeksData.data.length > 0) {
          const daysData = await getDays(courseId, weeksData.data[0]?.id.toString())
          setDays(daysData)

          const totalWeeks = weeksData.data.length
          setCourseData(mapCourseData(totalWeeks))
        }
      } catch (error) {
        console.error("Error fetching video detail data:", error)
      }
    }

    fetchData()
  }, [courseId])

  if (!weeks || !days) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-10 mt-10">
      <Accordion type="multiple" className="mt-3">
        {courseData.map((week, weekIndex) => (
          <AccordionItem key={week.week} value={`week-${week.week}`}>
            <AccordionTrigger className="font-[family-name:var(--font-coiny)] text-ring text-[30px]">
              <div>Tuần {week.week}</div>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="flex flex-col gap-2 text-xl">
                {days.data
                  .sort((a: any, b: any) => a.id - b.id)
                  .map((day: any, index: number) => {
                    return (
                      <li key={day.id} className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <span className="font-semibold text-gray-900 dark:text-gray-50">Ngày </span>
                          <span className="text-gray-900 dark:text-gray-50">{index + 1}</span>
                          <p>{day.description}</p>
                        </div>
                        <Link href={`/courses/${courseId}/video-classes/${weeks.data[weekIndex]?.id}/${day.id}`}>
                          <ArrowPinkIcon />
                        </Link>
                      </li>
                    )
                  })}
              </ol>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
