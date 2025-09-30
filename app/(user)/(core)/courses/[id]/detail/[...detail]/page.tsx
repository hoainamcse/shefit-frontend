import { getDayCircuits, getCourseWeeks, getWeekDays } from '@/network/server/courses'
import { notFound } from 'next/navigation'
import { VideoClient } from './_components/video-client'
import { Course } from '@/models/course'
import Link from 'next/link'
import { sortByKey } from '@/utils/helpers'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { serializeSearchParams } from '@/utils/searchParams'

export default async function Video({
  params,
  searchParams,
}: {
  params: Promise<{ id: Course['id']; detail: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id: courseID, detail } = await params
  const _searchParams = await searchParams
  const back = typeof _searchParams.back === 'string' ? _searchParams.back : ''
  const query = serializeSearchParams(_searchParams)

  try {
    const weeks = await getCourseWeeks(courseID)
    const currentWeek = weeks.data.find((week) => week.id.toString() === detail[0])

    if (!currentWeek) {
      notFound()
    }

    const days = await getWeekDays(courseID, currentWeek.id)
    const currentDay = days.data.find((day) => day.id.toString() === detail[1]) || days.data[0]

    if (!currentDay) {
      notFound()
    }

    const circuits = await getDayCircuits(courseID, currentWeek.id, currentDay.id)
    const circuitsData = sortByKey(circuits.data || [], 'created_at', { transform: (val) => new Date(val).getTime() })

    return (
      <div className="flex flex-col">
        <Link
          href={back || `/courses/${courseID}/detail${query}`}
          className="inline-flex items-center gap-2 text-lg font-semibold transition-colors px-4 mt-4 w-36"
        >
          <BackIconBlack className="w-5 h-5" />
          <span>Quay về</span>
        </Link>
        <VideoClient data={circuitsData} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching video class data:', error)
    notFound()
  }
}
