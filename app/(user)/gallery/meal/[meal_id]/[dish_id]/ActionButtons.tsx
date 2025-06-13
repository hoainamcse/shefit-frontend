'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSession } from '@/components/providers/session-provider'
import { addFavouriteDish } from '@/network/server/favourite-dish'
interface ActionButtonsProps {
  dishId: string
}

export default function ActionButtons({ dishId }: ActionButtonsProps) {
  const { session } = useSession()

  const handleSaveDish = async () => {
    if (!session) {
      toast.error('Vui lòng đăng nhập để lưu món ăn')
      return
    }

    try {
      await addFavouriteDish(session.userId, dishId)
      toast.success('Đã lưu món ăn thành công!')
    } catch (error) {
      console.error('Error saving dish:', error)
      toast.error('Có lỗi xảy ra khi lưu món ăn!')
    }
  }
  return (
    <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
      <Button
        onClick={() => handleSaveDish()}
        className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296 h-14 border-2 border-[#13D8A7]"
      >
        Lưu
      </Button>
    </div>
  )
}
