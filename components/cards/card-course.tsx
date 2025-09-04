'use client'

import type { Course } from '@/models/course'

import { Lock } from 'lucide-react'

import { NextButton } from './next-button'
import { DeleteButton } from './delete-button'

export function CardCourse({
  data,
  to,
  locked = false,
  extend,
  onDelete,
  onLockedClick,
}: {
  data: Course
  locked?: boolean
  to?: string
  extend?: React.ReactNode
  onDelete?: () => void
  onLockedClick?: () => void
}) {
  return (
    <div className="max-w-[512px] w-full overflow-hidden">
      <div className="relative group">
        <img
          src={data.assets.thumbnail}
          alt={data.course_name}
          className="aspect-[3/2] object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
        />

        {locked ? (
          <div className="absolute inset-0 bg-black/50 rounded-xl z-20 flex items-center justify-center" onClick={onLockedClick}>
            <Lock className="w-12 h-12 text-white" />
          </div>
        ) : (
          <>
            <NextButton
              className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1"
              href={to || `/courses/${data.id}`}
            />
            {onDelete && <DeleteButton className="absolute top-3 right-3" onClick={onDelete} />}
            {extend}
          </>
        )}
      </div>
      <div className="space-y-1">
        <div className="font-medium text-sm lg:text-base">{data.course_name}</div>
        <div className="flex justify-between">
          <p className="text-gray-500 text-sm lg:text-base">{data.trainer || '-'}</p>
          <div className="text-gray-500 flex justify-end text-sm lg:text-base">
            {data.form_categories.map((cat) => cat.name).join(', ')}
          </div>
        </div>
      </div>
    </div>
  )
}
