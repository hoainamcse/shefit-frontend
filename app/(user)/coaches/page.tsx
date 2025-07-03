import React from 'react'
import { getCoaches } from '@/network/server/coaches'
import { CoachCard } from './CoachCard'

export const dynamic = 'force-dynamic'

export default async function CoachesPage() {
  const coaches = await getCoaches()

  return (
    <div className="pb-20">
      <div>
        <p className="font-[family-name:var(--font-coiny)] font-bold text-center text-ring text-3xl my-2 sm:my-4">
          Các HLV của Shefit
        </p>
        <p className="text-center text-[#737373] text-lg sm:text-xl mb-12 sm:mb-20 max-w-3xl mx-auto">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis. Molestie
          nascetur justo sit.
        </p>
      </div>

      <div>
        <div className="flex flex-col gap-16 sm:gap-20">
          {coaches.data.map((coach: any, index: number) => (
            <CoachCard key={`coach-${coach.id || index}`} coach={coach} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
