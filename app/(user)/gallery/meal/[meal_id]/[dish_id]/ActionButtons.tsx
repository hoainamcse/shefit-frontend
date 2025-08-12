'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-session'
import { addFavouriteDish, getFavouriteDishes } from '@/network/client/user-favourites'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { useState, useEffect } from 'react'
interface ActionButtonsProps {
  dishId: string
}

export default function ActionButtons({ dishId }: ActionButtonsProps) {
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
        const response = await getFavouriteDishes(session.userId)
        const favouriteDishes = response.data || []
        const isAlreadyFavourite = favouriteDishes.some((favourite: any) => favourite.dish.id.toString() === dishId)
        setIsFavourite(isAlreadyFavourite)
      } catch (error) {
        console.error('Error checking favourite status:', error)
        setIsFavourite(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkFavouriteStatus()
  }, [session?.userId, dishId])

  const handleSaveDish = async () => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    try {
      await addFavouriteDish(session.userId, dishId)
      setIsFavourite(true)
      toast.success('Đã lưu món ăn thành công!')
    } catch (error) {
      console.error('Error saving dish:', error)
      toast.error('Có lỗi xảy ra khi lưu món ăn!')
    }
  }

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
  }

  return (
    <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-6 md:mt-16 max-lg:w-full max-lg:px-5">
      <Button
        onClick={() => handleSaveDish()}
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
            <p className="text-lg lg:text-xl">ĐĂNG NHẬP ĐỂ LƯU MÓN ĂN</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-lg lg:text-xl" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
