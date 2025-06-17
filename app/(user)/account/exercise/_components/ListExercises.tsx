'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSubscription } from './SubscriptionContext'
import { useSession } from '@/components/providers/session-provider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getExercises } from '@/network/server/exercises'
import { DeleteIcon } from '@/components/icons/DeleteIcon'
import type { Exercise } from '@/models/exercise'
import { getYoutubeThumbnail } from '@/lib/youtube'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'

export default function ListExercises() {
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('buy-package')
  }

  useEffect(() => {
    if (!selectedSubscription?.exercises?.length) {
      setExercises([])
      setIsLoading(false)
      return
    }

    const fetchExercises = async () => {
      try {
        setIsLoading(true)
        const response = await getExercises()
        if (response?.data) {
          const subscriptionExerciseIds = selectedSubscription.exercises.map((ex: any) =>
            typeof ex === 'object' ? ex.id : ex
          )
          const filteredExercises = response.data.filter((exercise: any) =>
            subscriptionExerciseIds.includes(exercise.id)
          )

          setExercises(filteredExercises)
        }
      } catch (error) {
        console.error('Error fetching exercises:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExercises()
  }, [selectedSubscription?.exercises])

  if (!session) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm động tác</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">VUI LÒNG ĐĂNG NHẬP VÀ MUA GÓI</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg">HÃY ĐĂNG NHẬP & MUA GÓI ĐỂ THÊM KHÓA TẬP & THỰC ĐƠN</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleBuyPackageClick}>
                  Mua gói
                </Button>
              </div>
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleLoginClick}>
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!selectedSubscription) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-500 mb-4">Vui lòng chọn gói đăng ký để xem bài tập</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <Link href="/gallery">
        <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm động tác</Button>
      </Link>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
        {exercises.map((exercise) => (
          <Link href={`/gallery/muscle/${exercise.id}`} key={exercise.id}>
            <div key={exercise.id}>
              <div className="relative group">
                <div className="absolute top-4 right-4 z-10">
                  <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                </div>
                <img
                  src={getYoutubeThumbnail(exercise.youtube_url)}
                  alt={exercise.name}
                  className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              </div>
              <p className="font-medium">{exercise.name}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/gallery">
          <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm động tác</Button>
        </Link>
      </div>
    </div>
  )
}
