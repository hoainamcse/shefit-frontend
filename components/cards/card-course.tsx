import type { Course } from '@/models/course'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { courseLevelLabel } from '@/lib/label'

const NextButton = ({ href, className }: { href: string; className?: string }) => {
  return (
    <Link href={href}>
      <button type="button" className={`bg-background p-2 rounded-3xl text-ring ${className}`}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </Link>
  )
}

export function CardCourse({
  data,
  compact = false,
  to,
  extend,
}: {
  data: Course
  compact?: boolean
  to?: string
  extend?: React.ReactNode
}) {
  return (
    <div key={`video-${data.id}`} className="max-w-[585px] w-full overflow-hidden">
      <div className="relative group">
        <img
          src={data.assets.thumbnail}
          alt={data.course_name}
          className="aspect-[585/373] object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
        />
        <NextButton
          className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1"
          href={to || `/courses/${data.id}`}
        />
        {extend}
      </div>
      <div className="flex justify-between">
        <div>
          <p className="font-medium text-sm lg:text-lg">{data.course_name}</p>
          <div className="flex gap-2">
            <p className="text-[#737373] text-sm lg:text-lg">{courseLevelLabel[data.difficulty_level]}</p>
            <p className="text-[#737373] text-sm lg:text-lg">-</p>
            <p className="text-[#737373] text-sm lg:text-lg">{data.course_format}</p>
          </div>
          <p className="text-[#737373] text-sm lg:text-lg">{data.trainer}</p>
        </div>
        <div className="flex flex-col justify-between">
          <div className="text-gray-500 flex justify-end text-sm lg:text-lg">
            {data.form_categories.map((cat) => cat.name).join(', ')}
          </div>
        </div>
      </div>
    </div>
  )
}
