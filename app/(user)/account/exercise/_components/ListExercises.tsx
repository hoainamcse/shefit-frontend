"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserExercises } from "@/network/server/user-exercises"
import { DeleteIcon } from "@/components/icons/DeleteIcon"
import { useAuth } from "@/components/providers/auth-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserExercise } from "@/models/user-exercises"
import { ListResponse } from "@/models/response"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ListExercises() {
  const router = useRouter()
  const { userId } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [exercises, setExercises] = useState<ListResponse<UserExercise>>({
    status: "",
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)
  const isLoggedIn = !!userId

  useEffect(() => {
    async function fetchExercises() {
      if (!isLoggedIn) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await getUserExercises(userId.toString())
        setExercises(response)
      } catch (error) {
        console.error("Error fetching user exercises:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExercises()
  }, [userId, isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm động tác</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center text-center gap-6">
              <p className="text-lg">HÃY ĐĂNG NHẬP & MUA GÓI ĐỂ THÊM KHÓA TẬP & THỰC ĐƠN</p>
              <div className="flex gap-4 justify-center w-full px-10">
                <div className="flex-1">
                  <Button 
                    className="bg-[#13D8A7] rounded-full w-full text-lg" 
                    onClick={() => {
                      setDialogOpen(false)
                      window.location.href = '/account?tab=buy-package'
                    }}
                  >
                    Mua gói
                  </Button>
                </div>
                <div className="flex-1">
                  <Button 
                    className="bg-[#13D8A7] rounded-full w-full text-lg" 
                    onClick={() => {
                      setDialogOpen(false)
                      window.location.href = '/auth/login'
                    }}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <div className="text-gray-500 text-xl">Đang tải...</div>
      </div>
    )
  }

  return (
    <>
      {exercises.data.length === 0 ? (
        <div>
          <div className="text-gray-500 text-xl">Bạn chưa có động tác nào</div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
            {exercises.data.map((exercise: UserExercise) => (
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
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm động tác</Button>
          </Link>
        </div>
      )}
    </>
  )
}
