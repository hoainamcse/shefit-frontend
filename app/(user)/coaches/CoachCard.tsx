import React from 'react'
import { Coach } from '@/models/coach'
import styles from './CoachCard.module.css'

interface CoachCardProps {
  coach: Coach
  reverse?: boolean
}

export function CoachCard({ coach, reverse = false }: CoachCardProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          className={`flex justify-between w-full max-md:flex-col items-center xl:gap-14 lg:gap-12 md:gap-8 gap-2 ${
            reverse ? 'flex-row-reverse' : ''
          }`}
        >
          <div className="flex-1 flex flex-col items-center text-center justify-center gap-7 md:gap-1 w-full max-w-[340px]">
            <div className="relative w-full" style={{ aspectRatio: '400/566' }}>
              <div className="absolute inset-0 bg-primary -z-10" />
              <img
                src={coach.image}
                alt={`Coach ${coach.name}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="w-full block md:hidden">
              <p className="font-semibold text-xl mb-1 md:mb-2">{coach.name}</p>
              <p className="text-gray-500 text-sm md:text-base lg:text-xl text-center">{coach.detail}</p>
            </div>
          </div>

          <div className="flex-[2] md:mt-5 bg-primary max-md:bg-white md:rounded-[28px] lg:rounded-[40px] xl:rounded-[55px]">
            <div
              className={`h-[calc(100%-40px)] xl:my-10 lg:my-8 md:my-5 flex items-center max-md:mx-auto max-md:text-center xl:text-2xl lg:text-xl text-gray-500 md:h-[158px] lg:h-[160px] xl:h-[208px] xl:px-16 lg:px-10 md:px-8 md:px-6 max-md:text-base overflow-y-auto ${styles.scrollBox}`}
            >
              <div className="my-auto max-md:mx-auto max-md:text-center xl:text-2xl lg:text-xl text-gray-500 whitespace-pre-line">
                {coach.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* This code block to show name and detail under the image and make the description as horizontal as the image */}
      <div className="hidden md:flex mt-1">
        <div
          className={`flex justify-between w-full max-md:flex-col items-center xl:gap-14 lg:gap-12 md:gap-8 gap-2 ${
            reverse ? 'flex-row-reverse' : ''
          }`}
        >
          <div className="flex-1 flex flex-col items-center text-center justify-center gap-7 md:gap-1 w-full max-w-[340px]">
            <div className="w-full xl:px-[44px] lg:px-8 md:px-4">
              <p className="font-semibold text-xl mb-1 md:mb-2">{coach.name}</p>
              <p className="text-gray-500 text-sm md:text-base lg:text-lg xl:text-xl text-center">{coach.detail}</p>
            </div>
          </div>
          <div className="flex-[2] xl:px-16 lg:px-10 md:px-8 md:px-6"></div>
        </div>
      </div>
    </div>
  )
}
