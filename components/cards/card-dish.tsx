'use client'

import type { Dish } from '@/models/dish'

import { Lock } from 'lucide-react'

import { NextButton } from './next-button'
import { DeleteButton } from './delete-button'

export function CardDish({
  data,
  to,
  locked = false,
  onClick,
  onDelete,
  onLockedClick,
}: {
  data: Dish
  to?: string
  locked?: boolean
  onClick?: () => void
  onDelete?: () => void
  onLockedClick?: () => void
}) {
  return (
    <div className="overflow-hidden">
      <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square md:aspect-[3/2]">
        <img
          src={data.image}
          alt=""
          className="object-cover rounded-xl w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
        />
        {locked ? (
          <div className="absolute inset-0 bg-black/50 rounded-xl z-20 flex items-center justify-center" onClick={onLockedClick}>
            <Lock className="w-12 h-12 text-white" />
          </div>
        ) : (
          <>
            <NextButton
              className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1"
              href={to}
              onClick={onClick}
            />
            {onDelete && <DeleteButton className="absolute top-3 right-3" onClick={onDelete} />}
          </>
        )}
      </div>
      <div className="font-medium text-sm lg:text-base">{data.name}</div>
    </div>
  )
}
