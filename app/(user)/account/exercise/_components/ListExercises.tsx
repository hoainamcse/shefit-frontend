import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserExercises } from "@/network/server/user-exercises"
import { DeleteIcon } from "@/components/icons/DeleteIcon"
export default async function ListExercises() {
  const exercises = await getUserExercises("1")
  console.log(exercises)
  return (
    <>
      {exercises.data.length === 0 ? (
        <div>
          <div className="text-gray-500 text-xl">Bạn chưa có động tác nào</div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
            {exercises.data.map((exercise) => (
              <Link href={`/gallery/muscle/${exercise.muscle_group_ids[0]}/${exercise.id}`} key={exercise.id}>
                <div key={exercise.id}>
                  <div className="relative group">
                    <div className="absolute top-4 right-4 z-10">
                      <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                    </div>
                    <img
                      src={exercise.exercise.cover_image}
                      alt={exercise.exercise.name}
                      className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                    />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <p className="font-medium">{exercise.exercise.name}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/gallery">
            <Button className="bg-button text-white text-xl w-full rounded-full h-14 mt-6">Thêm động tác</Button>
          </Link>
        </div>
      )}
    </>
  )
}
