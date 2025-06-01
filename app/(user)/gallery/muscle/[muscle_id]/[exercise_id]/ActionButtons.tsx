"use client"

import { Button } from "@/components/ui/button"
import { createUserExercise } from "@/network/server/user-exercises"
import { toast } from "sonner"

interface ActionButtonsProps {
  exerciseId: string
}

const handleSaveExercise = async (exerciseId: string) => {
  try {
    await createUserExercise({ exercise_id: exerciseId }, "1")
    toast.success("Đã lưu bài tập thành công!")
  } catch (error) {
    console.error("Error saving exercise:", error)
    toast.error("Có lỗi xảy ra khi lưu bài tập!")
  }
}

export default function ActionButtons({ exerciseId }: ActionButtonsProps) {
  return (
    <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
      <Button
        onClick={() => handleSaveExercise(exerciseId)}
        className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296 h-14 border-2 border-[#13D8A7]"
      >
        Lưu
      </Button>
    </div>
  )
}
