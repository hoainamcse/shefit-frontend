import { ArrowPinkIcon } from "@/components/icons/ArrowPinkIcon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

type CourseDay = {
  day: number
  content: string
}

type CourseWeek = {
  week: number
  days: CourseDay[]
}

const mapCourseData = (totalWeeks: number): CourseWeek[] => {
  return Array.from({ length: totalWeeks }, (_, weekIndex) => ({
    week: weekIndex + 1,
    days: Array.from({ length: 7 }, (_, dayIndex) => ({
      day: dayIndex + 1,
      content: `Nội dung ngày ${dayIndex + 1}`,
    })),
  }))
}

export default async function CoursePage() {
  const totalWeeks = 4
  const courseData = mapCourseData(totalWeeks)

  return (
    <div className="flex flex-col gap-10 mt-10">
      <Accordion type="multiple" className="mt-3">
        {courseData.map((week) => (
          <AccordionItem key={week.week} value={`week-${week.week}`}>
            <AccordionTrigger className="font-[family-name:var(--font-coiny)] text-text text-[30px]">
              <div>Tuần {week.week}</div>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="flex flex-col gap-2 text-xl">
                {week.days.map((day) => (
                  <li key={day.day} className="flex justify-between items-center">
                    <div className="flex gap-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-50">Ngày </span>
                      <span className="text-gray-900 dark:text-gray-50">{day.day}</span>
                      <p>{day.content}</p>
                    </div>
                    <Link href={`/training-courses/zoom/slug/detail`}>
                      <ArrowPinkIcon />
                    </Link>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
