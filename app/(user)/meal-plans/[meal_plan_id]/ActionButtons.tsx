'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createUserMealPlan } from '@/network/server/user-meal-plans'
import { toast } from 'sonner'
import { useSession } from '@/components/providers/session-provider'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface ActionButtonsProps {
  mealPlanId: number
}

export default function ActionButtons({ mealPlanId }: ActionButtonsProps) {
  const { session } = useSession()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const router = useRouter()

  const handleSaveMealPlan = async (mealPlanId: number) => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    try {
      await createUserMealPlan({ meal_plan_id: mealPlanId }, session.userId!)
      toast.success('Đã lưu thực đơn thành công!')
    } catch (error) {
      console.error('Error saving meal plan:', error)
      toast.error('Có lỗi xảy ra khi lưu thực đơn!')
    }
  }

  const handleStartClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault()
      setShowLoginDialog(true)
    }
  }
  return (
    <>
      <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
        <Link href={`/meal-plans/${mealPlanId}/detail`} className="w-full" onClick={handleStartClick}>
          <Button className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296] h-14">
            Bắt đầu
          </Button>
        </Link>
        <Button
          onClick={() => handleSaveMealPlan(mealPlanId)}
          className="w-full rounded-full text-xl bg-white text-[#13D8A7] h-14 border-2 border-[#13D8A7]"
        >
          Lưu
        </Button>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg">ĐĂNG NHẬP & MUA GÓI ĐỂ TRUY CẬP THỰC ĐƠN</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button
                  className="bg-[#13D8A7] rounded-full w-full text-lg"
                  onClick={() => {
                    setShowLoginDialog(false)
                    window.location.href = '/account?tab=buy-package'
                  }}
                >
                  Mua gói Member
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  className="bg-[#13D8A7] rounded-full w-full text-lg"
                  onClick={() => {
                    setShowLoginDialog(false)
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
    </>
  )
}
