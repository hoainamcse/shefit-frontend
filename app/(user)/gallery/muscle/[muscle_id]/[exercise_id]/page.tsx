'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getExerciseById } from '@/network/server/exercises'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import ActionButtons from './ActionButtons'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exerciseId, setExerciseId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params
        setExerciseId(resolvedParams.exercise_id)
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
    <div className="flex flex-col gap-10 mt-10">
      {exercise?.youtube_url && (
        <div className="w-full max-w-4xl mx-auto aspect-video bg-black rounded-lg overflow-hidden">
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
                aspectRatio: '16/9',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 mb-5">
          <div className="text-center font-[family-name:var(--font-coiny)] font-bold text-ring text-3xl lg:text-[40px]">
            {exercise?.name}
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-5">
          <div className="font-[family-name:var(--font-coiny)] font-bold text-ring text-3xl lg:text-[40px]">
            Thông tin bài tập
          </div>
          <div className="text-[#737373] text-lg lg:text-xl">{exercise?.description}</div>
        </div>
      </div>

      {exercise?.equipments?.length > 0 && (
        <div className="flex flex-col gap-5">
          <p className="font-[family-name:var(--font-coiny)] font-bold text-ring text-3xl lg:text-[40px]">Dụng cụ</p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex space-x-4 py-4 w-full">
              {exercise.equipments.map((equipment: any, index: number) => (
                <figure key={`equipment-${equipment.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={equipment.image ?? undefined}
                      alt={equipment.name}
                      className="w-[168px] h-[175px] object-cover rounded-xl"
                    />
                  </div>
                  <figcaption className="pt-2 font-semibold text-lg lg:text-xl text-muted-foreground w-full">
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
        <div className="flex flex-col gap-5">
          <p className="font-[family-name:var(--font-coiny)] font-bold text-ring text-3xl lg:text-[40px]">Nhóm cơ</p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex w-full space-x-4 py-4">
              {exercise.muscle_groups.map((muscleGroup: any, index: number) => (
                <figure key={`muscleGroup-${muscleGroup.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={muscleGroup.image ?? undefined}
                      alt={muscleGroup.name}
                      className="w-[168px] h-[175px] object-cover rounded-xl"
                    />
                  </div>
                  <figcaption className="pt-2 font-semibold text-lg lg:text-xl text-muted-foreground w-full">
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
