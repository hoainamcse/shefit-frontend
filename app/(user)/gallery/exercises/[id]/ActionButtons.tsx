'use client'

import type { Exercise } from '@/models/exercise'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-session'
import { addFavouriteExercise, getFavouriteExercises } from '@/network/client/user-favourites'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { useState, useEffect } from 'react'
interface ActionButtonsProps {
  exerciseId: Exercise['id']
}

export default function ActionButtons({ exerciseId }: ActionButtonsProps) {
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkFavouriteStatus = async () => {
      if (!session?.userId) {
        setIsFavourite(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await getFavouriteExercises(session.userId)
        const favouriteExercises = response.data || []
        const isAlreadyFavourite = favouriteExercises.some((exercise) => exercise.id === exerciseId)
        setIsFavourite(isAlreadyFavourite)
      } catch (error) {
        console.error('Error checking favourite status:', error)
        setIsFavourite(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkFavouriteStatus()
  }, [session?.userId, exerciseId])

  const handleSaveExercise = async (exerciseId: Exercise['id']) => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    try {
      await addFavouriteExercise(session.userId, exerciseId)
      setIsFavourite(true)
      toast.success(`Đã thêm động tác vào danh sách yêu thích!`)
    } catch (error) {
      console.error('Error saving exercise:', error)
      toast.error('Có lỗi xảy ra khi lưu động tác!')
    }
  }

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
  }

  return (
    <div className="w-2/3 mx-auto mb-10 flex justify-center mt-6 md:mt-10 max-lg:w-full max-lg:px-5">
      <Button
        onClick={() => handleSaveExercise(exerciseId)}
        disabled={isFavourite || isLoading}
        className={`w-full rounded-full text-sm lg:text-lg h-14 border-2 ${
          isFavourite
            ? 'bg-transparent text-[#11c296] border-[#11c296] cursor-not-allowed'
            : 'bg-[#13D8A7] text-white hover:bg-[#11c296] border-[#13D8A7]'
        }`}
      >
        {isLoading ? 'Đang kiểm tra...' : isFavourite ? 'Đã Lưu' : 'Lưu'}
      </Button>
      <Dialog open={showLoginDialog} onOpenChange={(open) => setShowLoginDialog(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-sm lg:text-lg">ĐĂNG NHẬP ĐỂ LƯU BÀI TẬP</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
