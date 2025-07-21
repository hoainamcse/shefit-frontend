'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-session'
import { addFavouriteExercise } from '@/network/client/user-favourites'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { useState } from 'react'
interface ActionButtonsProps {
  exerciseId: string
}

export default function ActionButtons({ exerciseId }: ActionButtonsProps) {
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleSaveExercise = async (exerciseId: string) => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    try {
      await addFavouriteExercise(session.userId, exerciseId)
      toast.success('Đã lưu bài tập thành công!')
    } catch (error) {
      console.error('Error saving exercise:', error)
      toast.error('Có lỗi xảy ra khi lưu bài tập!')
    }
  }

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
  }

  return (
    <div className="gap-5 w-full flex justify-center">
      <Button
        onClick={() => handleSaveExercise(exerciseId)}
        className="w-full rounded-full text-sm lg:text-lg bg-[#13D8A7] text-white hover:bg-[#11c296 h-[42px] md:h-14 lg:h-[70px] border-2 border-[#13D8A7]"
      >
        Lưu
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
