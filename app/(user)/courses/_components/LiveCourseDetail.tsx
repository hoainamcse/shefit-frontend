'use client'

import { getCourse } from '@/network/server/courses'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getLives } from '@/network/server/live'
import { Live } from '@/models/live'
import Link from 'next/link'

const formatToVNTime = (time: string) => {
  const [hours] = time.split(':')
  const vnHour = (parseInt(hours) + 7) % 24
  return `${vnHour} giờ`
}

export default function LiveCourseDetail({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<any>(null)
  const [live, setLive] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourse(courseId)
        setCourse(courseData)

        const liveData = await getLives(courseId)
        setLive(liveData)
      } catch (error) {
        console.error('Error fetching live detail data:', error)
      }
    }

    fetchData()
  }, [courseId])

  if (!course || !live) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-10 mt-10">
      <Tabs
        defaultValue={live.data && live.data.length > 0 ? live.data[0].day_of_week : 'Monday'}
        className="[state=active]:bg-[#91EBD5] data-[state=active]:shadow-none"
      >
        <TabsList className="bg-white">
          {Array.from(new Set(live.data.map((item: Live) => item.day_of_week)) as Set<string>).map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className="
                    rounded-full mx-[10px] my-5 w-[63px] h-[64px] 
                    flex flex-col items-center justify-center 
                    font-medium text-xl cursor-pointer 
                    data-[state=active]:bg-[#91EBD5] data-[state=active]:text-white
                    bg-transparent hover:bg-[#91EBD5]/10
                    transition-colors duration-200"
            >
              Thứ <br />
              {day === 'Monday'
                ? '2'
                : day === 'Tuesday'
                ? '3'
                : day === 'Wednesday'
                ? '4'
                : day === 'Thursday'
                ? '5'
                : day === 'Friday'
                ? '6'
                : day === 'Saturday'
                ? '7'
                : ''}
            </TabsTrigger>
          ))}
        </TabsList>

        {Array.from(new Set(live.data.map((item: Live) => item.day_of_week)) as Set<string>).map((day) => (
          <TabsContent key={day} value={day} className="ml-2 mt-10">
            <div className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500 flex flex-col gap-5">
              {live.data
                .filter((item: Live) => item.day_of_week === day)
                .map((item: Live, index: number) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-[family-name:var(--font-coiny)] text-[30px] flex gap-2">
                        Ca
                        <span>{index + 1}</span>
                      </p>
                      <p className="text-[#737373] text-xl">
                        {item.description} / {formatToVNTime(item.start_time)} - {formatToVNTime(item.end_time)}
                      </p>
                    </div>
                    <Link
                      href={`https://us05web.zoom.us/j/85444899811?pwd=PQMxNmwIEaB2cEkQs7i6847VXaiozO.1`}
                      target="_blank"
                    >
                      <div className="text-primary text-xl">Vào lớp</div>
                    </Link>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
