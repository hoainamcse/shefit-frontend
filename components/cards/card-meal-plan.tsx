'use client'

import type { MealPlan } from '@/models/meal-plan'

import { Lock } from 'lucide-react'

import { NextButton } from './next-button'
import { DeleteButton } from './delete-button'
import { QuickAccessButton } from './quick-access-button'

export function CardMealPlan({
  data,
  to,
  locked = false,
  quickAccess,
  onDelete,
  onLockedClick,
}: {
  data: MealPlan
  to?: string
  quickAccess?: string
  locked?: boolean
  onDelete?: () => void
  onLockedClick?: () => void
}) {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="relative group">
        <img
          src={data.assets.thumbnail}
          alt={data.title}
          className="aspect-[3/2] object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
        />
        {locked ? (
          <div
            className="absolute inset-0 bg-black/50 rounded-xl z-20 flex items-center justify-center"
            onClick={onLockedClick}
          >
            <Lock className="w-12 h-12 text-white" />
          </div>
        ) : (
          <>
            {quickAccess && (
              <QuickAccessButton
                className="absolute bottom-3 right-14 transform transition-transform duration-300 group-hover:translate-x-1"
                href={quickAccess || `/courses/${data.id}`}
              />
            )}
            <NextButton
              className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1"
              href={to || `/meal-plans/${data.id}`}
            />
            {onDelete && <DeleteButton className="absolute top-3 right-3" onClick={onDelete} />}
          </>
        )}
      </div>
      <div className="space-y-1">
        <p className="font-medium text-sm lg:text-base">{data.title}</p>
        <p className="text-gray-500 text-sm lg:text-base">{data.subtitle || '-'}</p>
        <p className="text-gray-500 text-sm lg:text-base">Chef {data.chef_name || '-'}</p>
      </div>
    </div>
  )
}
