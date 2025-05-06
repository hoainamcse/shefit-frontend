import { cn } from "@/lib/utils"
import React from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMuscleGroupExercises, getMuscleGroups } from "@/network/server/muscle-group"

export default async function Muscle({ params }: { params: { muscle_id: string } }) {
  const { muscle_id } = params
  const muscleGroups = await getMuscleGroups()
  const muscleGroupExercises = await getMuscleGroupExercises(muscle_id)

  const selectedMuscleGroup = muscleGroups.data?.find((group) => group.id.toString() === muscle_id)

  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-14">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] mb-5">
            Các bài tập nhóm {selectedMuscleGroup?.name}
          </div>
          {/* <p className="text-[#737373] text-xl">{selectedMuscleGroup?.description}</p> */}
        </div>
        <div className="flex justify-center mb-20">
          <Tabs defaultValue="video">
            <TabsList className="bg-white">
              <TabsTrigger value="video" className={cn("underline text-text bg-white !shadow-none")}>
                Có dụng cụ
              </TabsTrigger>
              <TabsTrigger value="zoom" className={cn("underline text-text bg-white !shadow-none")}>
                Không có dụng cụ
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {muscleGroupExercises.data?.map((exercise) => (
            <Link href={`/gallery/muscle/${muscle_id}/${exercise.id}`} key={exercise.id}>
              <div key={`menu-${exercise.id}`} className="text-xl">
                <div className="relative group">
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    className="aspect-[5/3] object-cover rounded-xl mb-4"
                    width={585}
                    height={373}
                  />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <p className="font-bold">{exercise.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
