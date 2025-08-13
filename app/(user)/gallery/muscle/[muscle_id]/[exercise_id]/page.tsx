'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getExerciseById } from '@/network/server/exercises'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import ActionButtons from './ActionButtons'
import Link from 'next/link'
import { BackIconBlack } from '@/components/icons/BackIconBlack'

// Dynamically import ReactPlayer with no SSR to avoid window is not defined errors
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Đang tải video...</p>
    </div>
  ),
})

export default function MuscleDetail({ params }: { params: Promise<{ muscle_id: string; exercise_id: string }> }) {
  const [exercise, setExercise] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [exerciseId, setExerciseId] = useState<string>('')
  const [muscleId, setMuscleId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params
        setExerciseId(resolvedParams.exercise_id)
        setMuscleId(resolvedParams.muscle_id)
      } catch (err) {
        console.error('Error unwrapping params:', err)
        setError('Lỗi khi tải thông tin bài tập')
        setIsLoading(false)
      }
    }

    unwrapParams()
  }, [params])

  useEffect(() => {
    if (!exerciseId) return

    const fetchExercise = async () => {
      try {
        const response = await getExerciseById(exerciseId)
        setExercise(response.data)
      } catch (err) {
        console.error('Error fetching exercise:', err)
        setError('Không thể tải thông tin bài tập')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExercise()
  }, [exerciseId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="text-center py-10">
        <p>Không tìm thấy thông tin bài tập</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:pt-10 pt-4 xl:pt-[53px]">
      <Link
        href={`/gallery/muscle/${muscleId}`}
        className="flex cursor-pointer items-center gap-2 font-semibold lg:hidden md:mb-7 mb-3"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <BackIconBlack className="mb-1" />
        </div>
        {exercise?.muscle_groups && Array.isArray(exercise.muscle_groups)
          ? exercise.muscle_groups.find((mg: any) => mg.id?.toString() === muscleId)?.name || 'Quay về'
          : 'Quay về'}
      </Link>

      {exercise?.youtube_url && (
        <div className="w-full aspect-[400/255] lg:aspect-[1800/681] bg-black rounded-[20px] overflow-hidden mb-4 sm:mb-10 lg:mb-16">
          <div className="w-full h-full">
            <ReactPlayer
              url={exercise.youtube_url}
              width="100%"
              height="100%"
              controls
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    origin: typeof window !== 'undefined' ? window.location.origin : '',
                  },
                },
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex flex-col gap-2 sm:mb-10 lg:mb-16 text-center mb-6">
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
            {exercise?.name}
          </div>
        </div>

        <div className="flex flex-col mb-10 lg:mb-16">
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl mb-3.5">
            Thông tin bài tập
          </div>
          <div className="text-[#737373] text-sm lg:text-lg whitespace-pre-line">{exercise?.description}</div>
        </div>
      </div>

      {exercise?.equipments?.length > 0 && (
        <div className="flex flex-col mb-6 sm:mb-8 lg:mb-[52px]">
          <p className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl mb-5 sm:mb-3.5">
            Dụng cụ
          </p>
          <ScrollArea className="w-screen-max-xl px-0 md:px-5 lg:px-0">
            <div className="flex space-x-5 w-full">
              {exercise.equipments.map((equipment: any, index: number) => (
                <figure key={`equipment-${equipment.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={equipment.image ?? undefined}
                      alt={equipment.name}
                      className="w-[168px] h-[168px] object-cover rounded-xl"
                    />
                  </div>
                  <figcaption className="pt-2.5 lg:pt-3 font-medium text-sm lg:text-lg w-full">
                    {equipment.name}
                  </figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {exercise?.muscle_groups?.length > 0 && (
        <div className="flex flex-col lg:mb-12 mb-2">
          <p className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl mb-5">
            Nhóm cơ
          </p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex w-full space-x-5 px-0 md:px-5 lg:px-0">
              {exercise.muscle_groups.map((muscleGroup: any, index: number) => (
                <figure key={`muscleGroup-${muscleGroup.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={muscleGroup.image ?? undefined}
                      alt={muscleGroup.name}
                      className="w-[168px] h-[168px] object-cover rounded-xl"
                    />
                  </div>
                  <figcaption className="pt-2.5 lg:pt-3 font-medium text-sm lg:text-lg w-full">
                    {muscleGroup.name}
                  </figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      <ActionButtons exerciseId={exercise?.id.toString()} />
    </div>
  )
}
