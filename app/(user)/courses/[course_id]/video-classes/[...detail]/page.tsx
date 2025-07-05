import { getDayCircuits, getCourseWeeks, getWeekDays } from '@/network/client/courses'
import { notFound } from 'next/navigation'
import { VideoClientComponent } from './VideoClientComponent'
import { Course } from '@/models/course'

export default async function Video({ params }: { params: Promise<{ course_id: Course['id']; detail: string[] }> }) {
  const { course_id, detail } = await params

  try {
    const weeks = await getCourseWeeks(course_id)
    const currentWeek = weeks.data.find((week) => week.id.toString() === detail[0])

    if (!currentWeek) {
      notFound()
    }

    const days = await getWeekDays(course_id, currentWeek.id)
    const currentDay = days.data.find((day) => day.id.toString() === detail[1]) || days.data[0]

    if (!currentDay) {
      notFound()
    }

    const circuits = await getDayCircuits(course_id, currentWeek.id, currentDay.id)

    return <VideoClientComponent circuits={circuits} />
  } catch (error) {
    console.error('Error fetching video class data:', error)
    notFound()
  }
}
