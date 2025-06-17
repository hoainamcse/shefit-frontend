'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSession } from '@/components/providers/session-provider'
import { addFavouriteExercise } from '@/network/server/favourite-exercise'
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
    <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
      <Button
        onClick={() => handleSaveExercise(exerciseId)}
        className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296 h-14 border-2 border-[#13D8A7]"
      >
        Lưu
      </Button>
      <Dialog open={showLoginDialog} onOpenChange={(open) => setShowLoginDialog(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg">ĐĂNG NHẬP ĐỂ LƯU BÀI TẬP</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
