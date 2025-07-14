import { cn } from '@/lib/utils'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMuscleGroupExercises, getMuscleGroups } from '@/network/server/muscle-groups'
import { getYoutubeThumbnail } from '@/lib/youtube'
import { Skeleton } from '@/components/ui/skeleton'

export default async function Muscle({ params }: { params: Promise<{ muscle_id: string }> }) {
  const resolvedParams = await params
  const { muscle_id } = resolvedParams
  const muscleGroups = await getMuscleGroups()
  const muscleGroupExercises = await getMuscleGroupExercises(muscle_id)

  const selectedMuscleGroup = muscleGroups.data?.find((group) => group.id.toString() === muscle_id)

  // Loading state
  if (!selectedMuscleGroup || !muscleGroupExercises.data) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-10 mt-10 animate-fade-in">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-14">
          <div className="font-[family-name:var(--font-coiny)] text-ring text-3xl lg:text-[40px] mb-5 font-bold">
            Các bài tập nhóm {selectedMuscleGroup?.name}
          </div>
        </div>
        <div className="mb-20">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-white mx-auto">
                <TabsTrigger value="all" className={cn('underline text-ring bg-white !shadow-none')}>
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="with-equipment" className={cn('underline text-ring bg-white !shadow-none')}>
                  Có dụng cụ
                </TabsTrigger>
                <TabsTrigger value="no-equipment" className={cn('underline text-ring bg-white !shadow-none')}>
                  Không có dụng cụ
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all">
              <div className="grid grid-cols-3 lg:gap-10 gap-4">
                {muscleGroupExercises.data?.map((exercise) => (
                  <Link href={`/gallery/muscle/${muscle_id}/${exercise.id}`} key={exercise.id}>
                    <div
                      key={`menu-${exercise.id}`}
                      className="text-xl lg:w-[585px] w-[122px] max-w-[585px] overflow-hidden"
                    >
                      <div className="relative group">
                        <img
                          src={getYoutubeThumbnail(exercise.youtube_url)}
                          alt={exercise.name}
                          className="aspect-[5/3] object-cover rounded-xl mb-4 lg:h-[373px] h-[122px] w-full"
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                      </div>
                      <p className="font-bold text-base lg:text-xl">{exercise.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="with-equipment">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {muscleGroupExercises.data
                  ?.filter((exercise) => exercise.equipments && exercise.equipments.length > 0)
                  .map((exercise) => (
                    <Link href={`/gallery/muscle/${muscle_id}/${exercise.id}`} key={exercise.id}>
                      <div key={`menu-${exercise.id}`} className="text-xl w-[585px] max-w-[585px] overflow-hidden">
                        <div className="relative group">
                          <img
                            src={getYoutubeThumbnail(exercise.youtube_url)}
                            alt={exercise.name}
                            className="aspect-[5/3] object-cover rounded-xl mb-4 w-[585px] h-[373px]"
                            width={585}
                            height={373}
                          />
                          <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        </div>
                        <p className="font-bold text-base lg:text-xl">{exercise.name}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="no-equipment">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {muscleGroupExercises.data
                  ?.filter((exercise) => !exercise.equipments || exercise.equipments.length === 0)
                  .map((exercise) => (
                    <Link href={`/gallery/muscle/${muscle_id}/${exercise.id}`} key={exercise.id}>
                      <div key={`menu-${exercise.id}`} className="text-xl w-[585px] max-w-[585px] overflow-hidden">
                        <div className="relative group">
                          <img
                            src={getYoutubeThumbnail(exercise.youtube_url)}
                            alt={exercise.name}
                            className="aspect-[5/3] object-cover rounded-xl mb-4 w-[585px] h-[373px]"
                            width={585}
                            height={373}
                          />
                          <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        </div>
                        <p className="font-bold text-base lg:text-xl">{exercise.name}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
