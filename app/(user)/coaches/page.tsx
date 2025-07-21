import React from 'react'
import { getCoaches } from '@/network/server/coaches'
import { CoachCard } from './CoachCard'

export const dynamic = 'force-dynamic'

export default async function CoachesPage() {
  const coaches = await getCoaches()

  return (
    <div>
      <div className="mb-12 md:mb-[72px]">
        <p className="font-[family-name:var(--font-coiny)] font-bold md:text-center text-ring text-2xl md:text-4xl mt-16 md:mt-16 lg:mt-[93px] mb-3.5 md:mb-7">
          Các HLV của Shefit
        </p>
        <p className="md:text-center text-gray-500 text-sm md:text-lg md:max-w-2xl lg:max-w-3xl mx-auto">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis. Molestie
          nascetur justo sit.
        </p>
      </div>

      <div>
        <div className="flex flex-col gap-12 md:gap-20">
          {coaches.data.map((coach: any, index: number) => (
            <CoachCard key={`coach-${coach.id || index}`} coach={coach} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
