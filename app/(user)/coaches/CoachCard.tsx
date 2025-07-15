import React from 'react'
import { Coach } from '@/models/coach'

interface CoachCardProps {
  coach: Coach
  reverse?: boolean
}

export function CoachCard({ coach, reverse = false }: CoachCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div
        className={`flex justify-between w-full max-sm:flex-col items-center lg:gap-20 gap-8 ${
          reverse ? 'flex-row-reverse' : ''
        }`}
      >
        <div className="flex flex-col items-center text-center justify-center gap-5 w-full max-w-[340px]">
          <div className="relative w-full" style={{ aspectRatio: '340/486' }}>
            <div className="absolute inset-0 bg-primary -z-10" />
            <img
              src={coach.image}
              alt={`Coach ${coach.name}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="max-lg:w-full mx-auto">
            <p className="font-medium xl:text-xl max-lg:text-base">
              <span>{coach.name}</span>
            </p>
            <p className="text-gray-500 max-lg:text-sm w-2/3 text-center mx-auto">{coach.detail}</p>
          </div>
        </div>
        <div className="bg-primary max-sm:bg-white xl:text-2xl lg:text-xl text-gray-500 rounded-[55px] xl:p-10 lg:p-10 md:p-8 sm:p-6 max-sm:text-base max-sm:w-full">
          {coach.description}
        </div>
      </div>
    </div>
  )
}
